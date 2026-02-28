import { Request, Response, Router } from 'express';
import { getDb } from '../shared/db.js';
import { requireAdmin } from '../shared/auth.js';
import { tryParseJson } from '../shared/json.js';

export const ordersRouter = Router();

ordersRouter.get('/', requireAdmin, async (req: Request, res: Response) => {
  const db = await getDb();
  const status = req.query.status as string | undefined;
  const customerId = req.query.customerId as string | undefined;
  const email = req.query.email as string | undefined;

  let query = 'SELECT * FROM Orders WHERE 1=1';
  const request = db.request();

  if (status) {
    query += ' AND status = @status';
    request.input('status', status);
  }
  if (customerId) {
    query += ' AND customerId = @customerId';
    request.input('customerId', customerId);
  }
  if (email) {
    query += ' AND customerEmail = @email';
    request.input('email', email);
  }

  query += ' ORDER BY createdAt DESC';
  const result = await request.query(query);
  res.json(result.recordset.map(parseOrderRow));
});

ordersRouter.get('/customer/:email', async (req: Request, res: Response) => {
  const db = await getDb();
  const result = await db.request().input('email', req.params.email).query('SELECT * FROM Orders WHERE customerEmail = @email ORDER BY createdAt DESC');
  res.json(result.recordset.map(parseOrderRow));
});

ordersRouter.get('/:id', requireAdmin, async (req: Request, res: Response) => {
  const db = await getDb();
  const result = await db.request().input('id', req.params.id).query('SELECT * FROM Orders WHERE id = @id');
  if (result.recordset.length === 0) return res.status(404).json({ error: 'Order not found' });
  res.json(parseOrderRow(result.recordset[0]));
});

ordersRouter.post('/', async (req: Request, res: Response) => {
  const body = req.body;
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

  res.status(201).json({ id, ...body, status: 'processing', createdAt: now, updatedAt: now });
});

ordersRouter.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  const db = await getDb();
  const scalarFields = ['status', 'paymentMethod', 'paymentStatus', 'subtotal', 'discount', 'shippingCost', 'total', 'currency', 'promoCode', 'notes'];
  const jsonFields = ['items', 'shippingAddress'];

  const setClauses: string[] = ['updatedAt = @updatedAt'];
  const request = db.request().input('id', id).input('updatedAt', new Date().toISOString());

  for (const f of scalarFields) {
    if (body[f] !== undefined) {
      setClauses.push(`${f} = @${f}`);
      request.input(f, body[f]);
    }
  }

  for (const f of jsonFields) {
    if (body[f] !== undefined) {
      setClauses.push(`${f} = @${f}`);
      request.input(f, JSON.stringify(body[f]));
    }
  }

  await request.query(`UPDATE Orders SET ${setClauses.join(', ')} WHERE id = @id`);
  res.json({ id, ...body });
});

ordersRouter.put('/:id/cancel', async (req: Request, res: Response) => {
  const id = req.params.id;
  const db = await getDb();

  const found = await db.request().input('id', id).query('SELECT status FROM Orders WHERE id = @id');
  if (found.recordset.length === 0) return res.status(404).json({ error: 'Order not found' });
  if (found.recordset[0].status !== 'processing') return res.status(400).json({ error: 'Only processing orders can be cancelled' });

  const now = new Date().toISOString();
  await db.request().input('id', id).input('status', 'cancelled').input('updatedAt', now)
    .query('UPDATE Orders SET status = @status, updatedAt = @updatedAt WHERE id = @id');

  res.json({ id, status: 'cancelled', updatedAt: now });
});

function parseOrderRow(row: any) {
  return {
    ...row,
    items: tryParseJson(row.items, []),
    shippingAddress: tryParseJson(row.shippingAddress, {}),
  };
}
