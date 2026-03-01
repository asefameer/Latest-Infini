import { app, HttpRequest } from '@azure/functions';
import { randomUUID } from 'crypto';
import { getDb } from '../shared/db.js';
import { corsResponse, errorResponse, handleOptions, parseBody } from '../shared/http.js';
import { createCustomerToken, hashPassword, requireCustomerAuth, verifyPassword } from '../shared/customer-auth.js';

type SignupBody = {
  name?: string;
  email?: string;
  password?: string;
};

type LoginBody = {
  email?: string;
  password?: string;
};

function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.http('auth-signup', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'auth/signup',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();

    const body = await parseBody<SignupBody>(req);
    const name = (body.name || '').trim();
    const email = normalizeEmail(body.email || '');
    const password = body.password || '';

    if (!name) return errorResponse(400, 'Name is required');
    if (!isValidEmail(email)) return errorResponse(400, 'Valid email is required');
    if (password.length < 8) return errorResponse(400, 'Password must be at least 8 characters');

    const db = await getDb();
    const existing = await db.request().input('email', email).query('SELECT id FROM CustomerAccounts WHERE email = @email');
    if (existing.recordset.length > 0) return errorResponse(409, 'An account with this email already exists');

    const userId = randomUUID();
    const now = new Date().toISOString();
    const passwordHash = hashPassword(password);

    await db.request()
      .input('id', userId)
      .input('name', name)
      .input('email', email)
      .input('passwordHash', passwordHash)
      .input('createdAt', now)
      .input('updatedAt', now)
      .query(`
        INSERT INTO CustomerAccounts (id, name, email, passwordHash, createdAt, updatedAt, isActive)
        VALUES (@id, @name, @email, @passwordHash, @createdAt, @updatedAt, 1)
      `);

    await db.request()
      .input('id', userId)
      .input('name', name)
      .input('email', email)
      .input('lastActive', now)
      .input('joinedAt', now)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM Customers WHERE email = @email)
        BEGIN
          INSERT INTO Customers (id, name, email, phone, segment, totalSpent, orderCount, lastActive, joinedAt, tags, notes)
          VALUES (@id, @name, @email, '', 'new', 0, 0, @lastActive, @joinedAt, '[]', '')
        END
      `);

    const user = { id: userId, name, email };
    const token = createCustomerToken(user);
    return corsResponse(201, { token, user });
  },
});

app.http('auth-login', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'auth/login',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();

    const body = await parseBody<LoginBody>(req);
    const email = normalizeEmail(body.email || '');
    const password = body.password || '';

    if (!isValidEmail(email)) return errorResponse(400, 'Valid email is required');
    if (!password) return errorResponse(400, 'Password is required');

    const db = await getDb();
    const result = await db.request()
      .input('email', email)
      .query('SELECT id, name, email, passwordHash, isActive FROM CustomerAccounts WHERE email = @email');

    if (result.recordset.length === 0) return errorResponse(401, 'Invalid email or password');
    const row = result.recordset[0] as { id: string; name: string; email: string; passwordHash: string; isActive: boolean };

    if (!row.isActive) return errorResponse(403, 'Account is disabled');
    if (!verifyPassword(password, row.passwordHash)) return errorResponse(401, 'Invalid email or password');

    const user = { id: row.id, name: row.name, email: row.email };
    const token = createCustomerToken(user);
    return corsResponse(200, { token, user });
  },
});

app.http('auth-me', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'auth/me',
  handler: requireCustomerAuth(async (_req, user) => {
    return corsResponse(200, { user });
  }),
});