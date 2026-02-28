import { Request, Response, Router } from 'express';
import { getDb } from '../shared/db.js';
import { requireAdmin } from '../shared/auth.js';

export const discountsRouter = Router();

discountsRouter.get('/', async (_req: Request, res: Response) => {
  const db = await getDb();
  const result = await db.request().query('SELECT * FROM Discounts ORDER BY startDate DESC');
  res.json(result.recordset);
});

discountsRouter.get('/code/:code', async (req: Request, res: Response) => {
  const db = await getDb();
  const result = await db.request().input('code', req.params.code)
    .query('SELECT * FROM Discounts WHERE code = @code AND isActive = 1');
  if (result.recordset.length === 0) return res.json(null);
  res.json(result.recordset[0]);
});

discountsRouter.post('/', requireAdmin, async (req: Request, res: Response) => {
  const body = req.body;
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

  res.status(201).json(body);
});

discountsRouter.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  const db = await getDb();
  const fields = ['code', 'description', 'type', 'value', 'currency', 'appliesTo', 'minPurchase', 'maxUses', 'usedCount', 'startDate', 'endDate'];
  const setClauses: string[] = [];
  const request = db.request().input('id', id);

  for (const f of fields) {
    if (body[f] !== undefined) {
      setClauses.push(`${f} = @${f}`);
      request.input(f, body[f]);
    }
  }

  if (body.isActive !== undefined) {
    setClauses.push('isActive = @isActive');
    request.input('isActive', body.isActive ? 1 : 0);
  }

  if (setClauses.length === 0) return res.status(400).json({ error: 'No fields to update' });
  await request.query(`UPDATE Discounts SET ${setClauses.join(', ')} WHERE id = @id`);
  res.json({ id, ...body });
});

discountsRouter.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  const db = await getDb();
  await db.request().input('id', req.params.id).query('DELETE FROM Discounts WHERE id = @id');
  res.status(204).send();
});
