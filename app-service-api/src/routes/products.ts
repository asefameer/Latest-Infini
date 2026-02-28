import { Request, Response, Router } from 'express';
import { getDb } from '../shared/db.js';
import { requireAdmin } from '../shared/auth.js';
import { tryParseJson } from '../shared/json.js';

export const productsRouter = Router();

productsRouter.get('/', async (req: Request, res: Response) => {
  const db = await getDb();
  const category = req.query.category as string | undefined;
  const brand = req.query.brand as string | undefined;
  const trending = req.query.trending === 'true';
  const isNew = req.query.new === 'true';
  const featured = req.query.featured === 'true';

  let query = 'SELECT * FROM Products WHERE 1=1';
  const request = db.request();

  if (category) {
    query += ' AND category = @category';
    request.input('category', category);
  }
  if (brand) {
    query += ' AND brand = @brand';
    request.input('brand', brand);
  }
  if (trending) query += ' AND isTrending = 1';
  if (isNew) query += ' AND isNew = 1';
  if (featured) query += ' ORDER BY createdAt DESC OFFSET 0 ROWS FETCH NEXT 6 ROWS ONLY';

  const result = await request.query(query);
  res.json(result.recordset.map(parseProductRow));
});

productsRouter.get('/slug/:slug', async (req: Request, res: Response) => {
  const db = await getDb();
  const result = await db.request().input('slug', req.params.slug).query('SELECT * FROM Products WHERE slug = @slug');
  if (result.recordset.length === 0) return res.status(404).json({ error: 'Product not found' });
  res.json(parseProductRow(result.recordset[0]));
});

productsRouter.get('/:id', async (req: Request, res: Response) => {
  const db = await getDb();
  const result = await db.request().input('id', req.params.id).query('SELECT * FROM Products WHERE id = @id');
  if (result.recordset.length === 0) return res.status(404).json({ error: 'Product not found' });
  res.json(parseProductRow(result.recordset[0]));
});

productsRouter.post('/', requireAdmin, async (req: Request, res: Response) => {
  const body = req.body;
  const db = await getDb();

  await db.request()
    .input('id', body.id)
    .input('slug', body.slug)
    .input('name', body.name)
    .input('brand', body.brand)
    .input('category', body.category)
    .input('price', body.price)
    .input('compareAtPrice', body.compareAtPrice || null)
    .input('currency', body.currency || 'BDT')
    .input('images', JSON.stringify(body.images || []))
    .input('description', body.description || '')
    .input('specs', JSON.stringify(body.specs || []))
    .input('variants', JSON.stringify(body.variants || []))
    .input('tags', JSON.stringify(body.tags || []))
    .input('inStock', body.inStock ? 1 : 0)
    .input('isNew', body.isNew ? 1 : 0)
    .input('isTrending', body.isTrending ? 1 : 0)
    .query(`
      INSERT INTO Products (id, slug, name, brand, category, price, compareAtPrice, currency, images, description, specs, variants, tags, inStock, isNew, isTrending)
      VALUES (@id, @slug, @name, @brand, @category, @price, @compareAtPrice, @currency, @images, @description, @specs, @variants, @tags, @inStock, @isNew, @isTrending)
    `);

  res.status(201).json(body);
});

productsRouter.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  const db = await getDb();

  const allowedFields = ['slug', 'name', 'brand', 'category', 'price', 'compareAtPrice', 'currency', 'description', 'inStock', 'isNew', 'isTrending'];
  const jsonFields = ['images', 'specs', 'variants', 'tags'];
  const setClauses: string[] = [];
  const request = db.request().input('id', id);

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      setClauses.push(`${field} = @${field}`);
      request.input(field, field === 'inStock' || field === 'isNew' || field === 'isTrending' ? (body[field] ? 1 : 0) : body[field]);
    }
  }

  for (const field of jsonFields) {
    if (body[field] !== undefined) {
      setClauses.push(`${field} = @${field}`);
      request.input(field, JSON.stringify(body[field]));
    }
  }

  if (setClauses.length === 0) return res.status(400).json({ error: 'No fields to update' });

  await request.query(`UPDATE Products SET ${setClauses.join(', ')} WHERE id = @id`);
  res.json({ id, ...body });
});

productsRouter.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  const db = await getDb();
  await db.request().input('id', req.params.id).query('DELETE FROM Products WHERE id = @id');
  res.status(204).send();
});

function parseProductRow(row: any) {
  return {
    ...row,
    images: tryParseJson(row.images, []),
    specs: tryParseJson(row.specs, []),
    variants: tryParseJson(row.variants, []),
    tags: tryParseJson(row.tags, []),
    inStock: !!row.inStock,
    isNew: !!row.isNew,
    isTrending: !!row.isTrending,
  };
}
