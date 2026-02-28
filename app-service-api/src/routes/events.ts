import { Request, Response, Router } from 'express';
import { getDb } from '../shared/db.js';
import { requireAdmin } from '../shared/auth.js';
import { tryParseJson } from '../shared/json.js';

export const eventsRouter = Router();

eventsRouter.get('/', async (req: Request, res: Response) => {
  const db = await getDb();
  const brand = req.query.brand as string | undefined;
  const featured = req.query.featured === 'true';

  let query = 'SELECT * FROM Events WHERE 1=1';
  const request = db.request();

  if (brand) {
    query += ' AND brand = @brand';
    request.input('brand', brand);
  }
  if (featured) query += ' AND isFeatured = 1';

  query += ' ORDER BY date ASC';
  const result = await request.query(query);
  res.json(result.recordset.map(parseEventRow));
});

eventsRouter.get('/slug/:slug', async (req: Request, res: Response) => {
  const db = await getDb();
  const result = await db.request().input('slug', req.params.slug).query('SELECT * FROM Events WHERE slug = @slug');
  if (result.recordset.length === 0) return res.status(404).json({ error: 'Event not found' });
  res.json(parseEventRow(result.recordset[0]));
});

eventsRouter.get('/:id', async (req: Request, res: Response) => {
  const db = await getDb();
  const result = await db.request().input('id', req.params.id).query('SELECT * FROM Events WHERE id = @id');
  if (result.recordset.length === 0) return res.status(404).json({ error: 'Event not found' });
  res.json(parseEventRow(result.recordset[0]));
});

eventsRouter.post('/', requireAdmin, async (req: Request, res: Response) => {
  const body = req.body;
  const db = await getDb();

  await db.request()
    .input('id', body.id)
    .input('slug', body.slug)
    .input('title', body.title)
    .input('brand', body.brand)
    .input('date', body.date)
    .input('time', body.time)
    .input('venue', body.venue)
    .input('city', body.city)
    .input('bannerImage', body.bannerImage || '')
    .input('description', body.description || '')
    .input('ticketTiers', JSON.stringify(body.ticketTiers || []))
    .input('faq', JSON.stringify(body.faq || []))
    .input('lineup', JSON.stringify(body.lineup || []))
    .input('schedule', JSON.stringify(body.schedule || []))
    .input('isFeatured', body.isFeatured ? 1 : 0)
    .query(`
      INSERT INTO Events (id, slug, title, brand, date, time, venue, city, bannerImage, description, ticketTiers, faq, lineup, schedule, isFeatured)
      VALUES (@id, @slug, @title, @brand, @date, @time, @venue, @city, @bannerImage, @description, @ticketTiers, @faq, @lineup, @schedule, @isFeatured)
    `);

  res.status(201).json(body);
});

eventsRouter.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  const db = await getDb();

  const scalarFields = ['slug', 'title', 'brand', 'date', 'time', 'venue', 'city', 'bannerImage', 'description'];
  const jsonFields = ['ticketTiers', 'faq', 'lineup', 'schedule'];
  const setClauses: string[] = [];
  const request = db.request().input('id', id);

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

  if (body.isFeatured !== undefined) {
    setClauses.push('isFeatured = @isFeatured');
    request.input('isFeatured', body.isFeatured ? 1 : 0);
  }

  if (setClauses.length === 0) return res.status(400).json({ error: 'No fields to update' });

  await request.query(`UPDATE Events SET ${setClauses.join(', ')} WHERE id = @id`);
  res.json({ id, ...body });
});

eventsRouter.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  const db = await getDb();
  await db.request().input('id', req.params.id).query('DELETE FROM Events WHERE id = @id');
  res.status(204).send();
});

function parseEventRow(row: any) {
  return {
    ...row,
    ticketTiers: tryParseJson(row.ticketTiers, []),
    faq: tryParseJson(row.faq, []),
    lineup: tryParseJson(row.lineup, []),
    schedule: tryParseJson(row.schedule, []),
    isFeatured: !!row.isFeatured,
  };
}
