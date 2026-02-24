/**
 * Orders API — Azure Function (HTTP Trigger)
 *
 * Routes:
 *   GET    /api/orders                    → list (admin, supports ?status, ?customerId, ?email)  [admin]
 *   GET    /api/orders/:id                → get by ID                                            [admin]
 *   POST   /api/orders                    → create (from checkout)                               [public]
 *   PUT    /api/orders/:id                → update (status, payment, notes)                      [admin]
 *   PUT    /api/orders/:id/cancel         → cancel order                                         [public]
 *   GET    /api/orders/customer/:email     → get orders by customer email                        [public]
 */
import { app, HttpRequest } from '@azure/functions';
import { getDb } from '../shared/db.js';
import { corsResponse, handleOptions, parseBody, errorResponse } from '../shared/http.js';
import { requireAdmin } from '../shared/auth.js';

// ── List / Filter (admin) ──
app.http('orders-list', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'orders',
  handler: requireAdmin(async (req) => {
    const db = await getDb();
    const status = req.query.get('status');
    const customerId = req.query.get('customerId');
    const email = req.query.get('email');

    let query = 'SELECT * FROM Orders WHERE 1=1';
    const request = db.request();

    if (status) { query += ' AND status = @status'; request.input('status', status); }
    if (customerId) { query += ' AND customerId = @customerId'; request.input('customerId', customerId); }
    if (email) { query += ' AND customerEmail = @email'; request.input('email', email); }

    query += ' ORDER BY createdAt DESC';
    const result = await request.query(query);
    return corsResponse(200, result.recordset.map(parseOrderRow));
  }),
});

// ── Get by ID (admin) ──
app.http('orders-get', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'orders/{id}',
  handler: requireAdmin(async (req) => {
    const id = req.params.id;
    if (id === 'customer') return corsResponse(400, { error: 'Use /orders/customer/:email' });

    const db = await getDb();
    const result = await db.request().input('id', id).query('SELECT * FROM Orders WHERE id = @id');
    if (result.recordset.length === 0) return errorResponse(404, 'Order not found');
    return corsResponse(200, parseOrderRow(result.recordset[0]));
  }),
});

// ── Create (public — from checkout) ──
app.http('orders-create', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'orders',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();

    const body = await parseBody<any>(req);
    const now = new Date().toISOString();
    const id = body.id || `ORD-${Date.now()}`;
    const db = await getDb();

    await db.request()
      .input('id', id)
      .input('customerId', body.customerId || null)
      .input('customerEmail', body.customerEmail)
      .input('customerName', body.customerName)
      .input('status', 'processing')
      .input('paymentMethod', body.paymentMethod || 'stripe')
      .input('paymentStatus', body.paymentStatus || 'pending')
      .input('subtotal', body.subtotal || 0)
      .input('discount', body.discount || 0)
      .input('shippingCost', body.shippingCost || 0)
      .input('total', body.total || 0)
      .input('currency', body.currency || 'BDT')
      .input('promoCode', body.promoCode || null)
      .input('items', JSON.stringify(body.items || []))
      .input('shippingAddress', JSON.stringify(body.shippingAddress || {}))
      .input('notes', body.notes || '')
      .input('createdAt', now)
      .input('updatedAt', now)
      .query(`
        INSERT INTO Orders (id, customerId, customerEmail, customerName, status, paymentMethod, paymentStatus,
          subtotal, discount, shippingCost, total, currency, promoCode, items, shippingAddress, notes, createdAt, updatedAt)
        VALUES (@id, @customerId, @customerEmail, @customerName, @status, @paymentMethod, @paymentStatus,
          @subtotal, @discount, @shippingCost, @total, @currency, @promoCode, @items, @shippingAddress, @notes, @createdAt, @updatedAt)
      `);

    return corsResponse(201, { id, ...body, status: 'processing', createdAt: now, updatedAt: now });
  },
});

// ── Update (admin) ──
app.http('orders-update', {
  methods: ['PUT', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'orders/{id}',
  handler: requireAdmin(async (req) => {
    const id = req.params.id;
    if (id === 'customer') return errorResponse(400, 'Use /orders/customer/:email');

    const body = await parseBody<any>(req);
    const db = await getDb();
    const scalarFields = ['status', 'paymentMethod', 'paymentStatus', 'subtotal', 'discount', 'shippingCost', 'total', 'currency', 'promoCode', 'notes'];
    const jsonFields = ['items', 'shippingAddress'];
    const setClauses: string[] = ['updatedAt = @updatedAt'];
    const request = db.request().input('id', id).input('updatedAt', new Date().toISOString());

    for (const f of scalarFields) {
      if (body[f] !== undefined) { setClauses.push(`${f} = @${f}`); request.input(f, body[f]); }
    }
    for (const f of jsonFields) {
      if (body[f] !== undefined) { setClauses.push(`${f} = @${f}`); request.input(f, JSON.stringify(body[f])); }
    }

    await request.query(`UPDATE Orders SET ${setClauses.join(', ')} WHERE id = @id`);
    return corsResponse(200, { id, ...body });
  }),
});

// ── Cancel (public — customer can cancel their own order) ──
app.http('orders-cancel', {
  methods: ['PUT', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'orders/{id}/cancel',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();

    const id = req.params.id;
    const db = await getDb();

    // Only allow cancellation of processing orders
    const result = await db.request().input('id', id).query('SELECT status FROM Orders WHERE id = @id');
    if (result.recordset.length === 0) return errorResponse(404, 'Order not found');
    if (result.recordset[0].status !== 'processing') return errorResponse(400, 'Only processing orders can be cancelled');

    const now = new Date().toISOString();
    await db.request()
      .input('id', id)
      .input('status', 'cancelled')
      .input('updatedAt', now)
      .query('UPDATE Orders SET status = @status, updatedAt = @updatedAt WHERE id = @id');

    return corsResponse(200, { id, status: 'cancelled', updatedAt: now });
  },
});

// ── Customer orders (public — by email) ──
app.http('orders-by-customer', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'orders/customer/{email}',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();

    const email = req.params.email;
    const db = await getDb();
    const result = await db.request()
      .input('email', email)
      .query('SELECT * FROM Orders WHERE customerEmail = @email ORDER BY createdAt DESC');

    return corsResponse(200, result.recordset.map(parseOrderRow));
  },
});

// ── Row parser ──
function parseOrderRow(row: any) {
  return {
    ...row,
    items: tryParseJson(row.items, []),
    shippingAddress: tryParseJson(row.shippingAddress, {}),
  };
}

function tryParseJson(val: string | null | undefined, fallback: any) {
  if (!val) return fallback;
  try { return JSON.parse(val); } catch { return fallback; }
}
