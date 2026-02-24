/**
 * Discounts API — Azure Function (HTTP Trigger)
 *
 * Routes:
 *   GET    /api/discounts              → list all
 *   GET    /api/discounts/code/:code   → validate promo code
 *   POST   /api/discounts              → create
 *   PUT    /api/discounts/:id          → update
 *   DELETE /api/discounts/:id          → delete
 */
import { app, HttpRequest } from '@azure/functions';
import { getDb } from '../shared/db.js';
import { corsResponse, handleOptions, parseBody, errorResponse } from '../shared/http.js';
import { requireAdmin } from '../shared/auth.js';

app.http('discounts-list', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'discounts',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const db = await getDb();
    const result = await db.request().query('SELECT * FROM Discounts ORDER BY startDate DESC');
    return corsResponse(200, result.recordset);
  },
});

app.http('discounts-get-code', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'discounts/code/{code}',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const code = req.params.code;
    const db = await getDb();
    const result = await db.request()
      .input('code', code)
      .query('SELECT * FROM Discounts WHERE code = @code AND isActive = 1');
    if (result.recordset.length === 0) return corsResponse(200, null);
    return corsResponse(200, result.recordset[0]);
  },
});

app.http('discounts-create', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'discounts',
  handler: requireAdmin(async (req) => {
    const body = await parseBody<any>(req);
    const db = await getDb();
    await db.request()
      .input('id', body.id)
      .input('code', body.code)
      .input('description', body.description || '')
      .input('type', body.type)
      .input('value', body.value)
      .input('currency', body.currency || 'BDT')
      .input('appliesTo', body.appliesTo)
      .input('minPurchase', body.minPurchase || null)
      .input('maxUses', body.maxUses || null)
      .input('usedCount', body.usedCount || 0)
      .input('startDate', body.startDate)
      .input('endDate', body.endDate)
      .input('isActive', body.isActive ? 1 : 0)
      .query(`
        INSERT INTO Discounts (id, code, description, type, value, currency, appliesTo, minPurchase, maxUses, usedCount, startDate, endDate, isActive)
        VALUES (@id, @code, @description, @type, @value, @currency, @appliesTo, @minPurchase, @maxUses, @usedCount, @startDate, @endDate, @isActive)
      `);
    return corsResponse(201, body);
  }),
});

app.http('discounts-update', {
  methods: ['PUT', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'discounts/{id}',
  handler: requireAdmin(async (req) => {
    const id = req.params.id;
    const body = await parseBody<any>(req);
    const db = await getDb();
    const fields = ['code', 'description', 'type', 'value', 'currency', 'appliesTo', 'minPurchase', 'maxUses', 'usedCount', 'startDate', 'endDate'];
    const setClauses: string[] = [];
    const request = db.request().input('id', id);

    for (const f of fields) {
      if (body[f] !== undefined) { setClauses.push(`${f} = @${f}`); request.input(f, body[f]); }
    }
    if (body.isActive !== undefined) { setClauses.push('isActive = @isActive'); request.input('isActive', body.isActive ? 1 : 0); }
    if (setClauses.length === 0) return errorResponse(400, 'No fields to update');

    await request.query(`UPDATE Discounts SET ${setClauses.join(', ')} WHERE id = @id`);
    return corsResponse(200, { id, ...body });
  }),
});

app.http('discounts-delete', {
  methods: ['DELETE', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'discounts/{id}',
  handler: requireAdmin(async (req) => {
    const id = req.params.id;
    const db = await getDb();
    await db.request().input('id', id).query('DELETE FROM Discounts WHERE id = @id');
    return corsResponse(204);
  }),
});
