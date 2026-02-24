/**
 * CRM Customers API — Azure Function (HTTP Trigger)
 *
 * Routes:
 *   GET    /api/crm/customers       → list (supports ?segment)
 *   GET    /api/crm/customers/:id   → get by ID
 *   POST   /api/crm/customers       → create
 *   PUT    /api/crm/customers/:id   → update
 *   DELETE /api/crm/customers/:id   → delete
 */
import { app, HttpRequest } from '@azure/functions';
import { getDb } from '../shared/db.js';
import { corsResponse, handleOptions, parseBody, errorResponse } from '../shared/http.js';

app.http('customers-list', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/customers',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const db = await getDb();
    const segment = req.query.get('segment');
    let query = 'SELECT * FROM Customers';
    const request = db.request();
    if (segment) { query += ' WHERE segment = @segment'; request.input('segment', segment); }
    query += ' ORDER BY lastActive DESC';
    const result = await request.query(query);
    return corsResponse(200, result.recordset.map(parseCustomerRow));
  },
});

app.http('customers-get', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/customers/{id}',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const db = await getDb();
    const result = await db.request().input('id', req.params.id).query('SELECT * FROM Customers WHERE id = @id');
    if (result.recordset.length === 0) return errorResponse(404, 'Customer not found');
    return corsResponse(200, parseCustomerRow(result.recordset[0]));
  },
});

app.http('customers-create', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/customers',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const body = await parseBody<any>(req);
    const db = await getDb();
    await db.request()
      .input('id', body.id)
      .input('name', body.name)
      .input('email', body.email)
      .input('phone', body.phone || '')
      .input('avatar', body.avatar || null)
      .input('segment', body.segment || 'new')
      .input('totalSpent', body.totalSpent || 0)
      .input('orderCount', body.orderCount || 0)
      .input('lastActive', body.lastActive || new Date().toISOString().split('T')[0])
      .input('joinedAt', body.joinedAt || new Date().toISOString().split('T')[0])
      .input('tags', JSON.stringify(body.tags || []))
      .input('notes', body.notes || '')
      .query(`
        INSERT INTO Customers (id, name, email, phone, avatar, segment, totalSpent, orderCount, lastActive, joinedAt, tags, notes)
        VALUES (@id, @name, @email, @phone, @avatar, @segment, @totalSpent, @orderCount, @lastActive, @joinedAt, @tags, @notes)
      `);
    return corsResponse(201, body);
  },
});

app.http('customers-update', {
  methods: ['PUT', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/customers/{id}',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const id = req.params.id;
    const body = await parseBody<any>(req);
    const db = await getDb();
    const scalarFields = ['name', 'email', 'phone', 'avatar', 'segment', 'totalSpent', 'orderCount', 'lastActive', 'joinedAt', 'notes'];
    const setClauses: string[] = [];
    const request = db.request().input('id', id);
    for (const f of scalarFields) {
      if (body[f] !== undefined) { setClauses.push(`${f} = @${f}`); request.input(f, body[f]); }
    }
    if (body.tags !== undefined) { setClauses.push('tags = @tags'); request.input('tags', JSON.stringify(body.tags)); }
    if (setClauses.length === 0) return errorResponse(400, 'No fields to update');
    await request.query(`UPDATE Customers SET ${setClauses.join(', ')} WHERE id = @id`);
    return corsResponse(200, { id, ...body });
  },
});

app.http('customers-delete', {
  methods: ['DELETE', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/customers/{id}',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const db = await getDb();
    await db.request().input('id', req.params.id).query('DELETE FROM Customers WHERE id = @id');
    return corsResponse(204);
  },
});

function parseCustomerRow(row: any) {
  return { ...row, tags: tryParseJson(row.tags, []) };
}
function tryParseJson(val: string | null | undefined, fallback: any) {
  if (!val) return fallback;
  try { return JSON.parse(val); } catch { return fallback; }
}
