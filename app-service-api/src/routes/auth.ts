import { Request, Response, Router } from 'express';
import { createCustomerToken, hashPassword, requireCustomer, verifyPassword } from '../shared/customer-auth.js';
import { getDb } from '../shared/db.js';

export const authRouter = Router();

let authSchemaReady = false;

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

function toSqlDateTimeString(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

async function ensureAuthSchema() {
  if (authSchemaReady) return;

  const db = await getDb();
  await db.request().batch(`
    IF OBJECT_ID('dbo.CustomerAccounts', 'U') IS NULL
    BEGIN
      CREATE TABLE dbo.CustomerAccounts (
        id NVARCHAR(50) NOT NULL PRIMARY KEY,
        name NVARCHAR(200) NOT NULL,
        email NVARCHAR(255) NOT NULL UNIQUE,
        passwordHash NVARCHAR(512) NOT NULL,
        isActive BIT NOT NULL DEFAULT 1,
        createdAt NVARCHAR(30) NOT NULL,
        updatedAt NVARCHAR(30) NOT NULL
      );

      CREATE UNIQUE INDEX IX_CustomerAccounts_Email ON dbo.CustomerAccounts(email);
    END;
  `);

  authSchemaReady = true;
}

authRouter.post('/signup', async (req: Request, res: Response) => {
  try {
    const body = req.body as SignupBody;
    const name = (body.name || '').trim();
    const email = normalizeEmail(body.email || '');
    const password = body.password || '';

    if (!name) return res.status(400).json({ error: 'Name is required' });
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Valid email is required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    await ensureAuthSchema();
    const db = await getDb();
    const exists = await db.request().input('email', email).query('SELECT id FROM CustomerAccounts WHERE email = @email');
    if (exists.recordset.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const userId = cryptoRandomId('cus');
    const nowDate = new Date();
    const now = nowDate.toISOString();
    const customerNow = toSqlDateTimeString(nowDate);
    const passwordHash = hashPassword(password);

    await db.request()
      .input('id', userId)
      .input('name', name)
      .input('email', email)
      .input('passwordHash', passwordHash)
      .input('createdAt', now)
      .input('updatedAt', now)
      .query(`
        INSERT INTO CustomerAccounts (id, name, email, passwordHash, isActive, createdAt, updatedAt)
        VALUES (@id, @name, @email, @passwordHash, 1, @createdAt, @updatedAt)
      `);

    await db.request()
      .input('id', userId)
      .input('name', name)
      .input('email', email)
      .input('lastActive', customerNow)
      .input('joinedAt', customerNow)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM Customers WHERE email = @email)
        BEGIN
          INSERT INTO Customers (id, name, email, phone, segment, totalSpent, orderCount, lastActive, joinedAt, tags, notes)
          VALUES (@id, @name, @email, '', 'new', 0, 0, @lastActive, @joinedAt, '[]', '')
        END
      `);

    const user = { id: userId, name, email };
    const token = createCustomerToken(user);
    return res.status(201).json({ token, user });
  } catch (err: any) {
    const message = err?.message || 'Signup failed';
    return res.status(500).json({ error: message });
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const body = req.body as LoginBody;
    const email = normalizeEmail(body.email || '');
    const password = body.password || '';

    if (!isValidEmail(email)) return res.status(400).json({ error: 'Valid email is required' });
    if (!password) return res.status(400).json({ error: 'Password is required' });

    await ensureAuthSchema();
    const db = await getDb();
    const result = await db.request()
      .input('email', email)
      .query('SELECT id, name, email, passwordHash, isActive FROM CustomerAccounts WHERE email = @email');

    if (result.recordset.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const row = result.recordset[0] as {
      id: string;
      name: string;
      email: string;
      passwordHash: string;
      isActive: boolean;
    };

    if (!row.isActive) return res.status(403).json({ error: 'Account is disabled' });
    if (!verifyPassword(password, row.passwordHash)) return res.status(401).json({ error: 'Invalid email or password' });

    const user = { id: row.id, name: row.name, email: row.email };
    const token = createCustomerToken(user);
    return res.status(200).json({ token, user });
  } catch (err: any) {
    const message = err?.message || 'Login failed';
    return res.status(500).json({ error: message });
  }
});

authRouter.get('/me', requireCustomer, async (req: Request, res: Response) => {
  const user = req.customerUser;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  return res.status(200).json({ user });
});

function cryptoRandomId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
