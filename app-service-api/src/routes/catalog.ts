import { Request, Response, Router } from 'express';
import { getDb } from '../shared/db.js';
import { requireAdmin } from '../shared/auth.js';

export const catalogRouter = Router();

catalogRouter.get('/categories', async (_req: Request, res: Response) => {
  const db = await getDb();
  const result = await db.request().query('SELECT * FROM Categories ORDER BY name');
  res.json(result.recordset);
});

catalogRouter.get('/brands', async (_req: Request, res: Response) => {
  const db = await getDb();
  const result = await db.request().query('SELECT * FROM Brands');
  res.json(result.recordset);
});

catalogRouter.get('/brands/:id', async (req: Request, res: Response) => {
  const db = await getDb();
  const result = await db.request().input('id', req.params.id).query('SELECT * FROM Brands WHERE id = @id');
  if (result.recordset.length === 0) return res.status(404).json({ error: 'Brand not found' });
  res.json(result.recordset[0]);
});

catalogRouter.get('/banners', async (req: Request, res: Response) => {
  const db = await getDb();
  const placement = req.query.placement as string | undefined;
  let query = 'SELECT * FROM Banners';
  const request = db.request();

  if (placement) {
    query += ' WHERE placement = @placement AND isActive = 1';
    request.input('placement', placement);
  }

  query += ' ORDER BY [order] ASC';
  const result = await request.query(query);
  res.json(result.recordset);
});

catalogRouter.post('/banners', requireAdmin, async (req: Request, res: Response) => {
  const body = req.body;
  const db = await getDb();

  await db.request()
    .input('id', body.id)
    .input('title', body.title)
    .input('imageUrl', body.imageUrl)
    .input('link', body.link)
    .input('placement', body.placement)
    .input('isActive', body.isActive ? 1 : 0)
    .input('order', body.order || 1)
    .query('INSERT INTO Banners (id, title, imageUrl, link, placement, isActive, [order]) VALUES (@id, @title, @imageUrl, @link, @placement, @isActive, @order)');

  res.status(201).json(body);
});
