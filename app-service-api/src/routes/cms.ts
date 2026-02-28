import { Request, Response, Router } from 'express';
import { getDb } from '../shared/db.js';
import { requireAdmin } from '../shared/auth.js';

export const cmsRouter = Router();

cmsRouter.get('/site-content', async (req: Request, res: Response) => {
  const section = req.query.section as string | undefined;
  const db = await getDb();

  const request = db.request();
  let query = 'SELECT * FROM SiteContent';
  if (section) {
    query += ' WHERE section = @section';
    request.input('section', section);
  }
  query += ' ORDER BY section ASC, sort_order ASC';

  const result = await request.query(query);
  res.json(result.recordset.map(mapSiteContent));
});

cmsRouter.put('/site-content/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  const db = await getDb();

  const allowed = ['section', 'content_key', 'content_value', 'content_type', 'sort_order'];
  const setClauses: string[] = [];
  const request = db.request().input('id', id);

  for (const key of allowed) {
    if (body[key] !== undefined) {
      setClauses.push(`${key} = @${key}`);
      request.input(key, body[key]);
    }
  }

  if (setClauses.length === 0) return res.status(400).json({ error: 'No fields to update' });

  await request.query(`UPDATE SiteContent SET ${setClauses.join(', ')} WHERE id = @id`);
  res.json({ id, ...body });
});

cmsRouter.post('/site-content/upsert', requireAdmin, async (req: Request, res: Response) => {
  const body = req.body;
  const db = await getDb();

  await db.request()
    .input('section', body.section)
    .input('content_key', body.content_key)
    .input('content_value', body.content_value)
    .input('content_type', body.content_type || 'text')
    .input('sort_order', body.sort_order || 0)
    .query(`
      MERGE SiteContent AS target
      USING (SELECT @section AS section, @content_key AS content_key) AS source
      ON target.section = source.section AND target.content_key = source.content_key
      WHEN MATCHED THEN
        UPDATE SET content_value = @content_value, content_type = @content_type, sort_order = @sort_order
      WHEN NOT MATCHED THEN
        INSERT (id, section, content_key, content_value, content_type, sort_order)
        VALUES (CONVERT(NVARCHAR(50), NEWID()), @section, @content_key, @content_value, @content_type, @sort_order);
    `);

  res.status(200).json(body);
});

cmsRouter.delete('/site-content/:id', requireAdmin, async (req: Request, res: Response) => {
  const db = await getDb();
  await db.request().input('id', req.params.id).query('DELETE FROM SiteContent WHERE id = @id');
  res.status(204).send();
});

cmsRouter.get('/navigation-items', async (req: Request, res: Response) => {
  const location = req.query.location as string | undefined;
  const visibleOnly = req.query.visible !== 'false';
  const db = await getDb();

  const request = db.request();
  const clauses: string[] = [];
  if (location) {
    clauses.push('location = @location');
    request.input('location', location);
  }
  if (visibleOnly) {
    clauses.push('is_visible = 1');
  }

  let query = 'SELECT * FROM NavigationItems';
  if (clauses.length) query += ` WHERE ${clauses.join(' AND ')}`;
  query += ' ORDER BY location ASC, sort_order ASC';

  const result = await request.query(query);
  res.json(result.recordset.map(mapNavigationItem));
});

cmsRouter.post('/navigation-items/upsert', requireAdmin, async (req: Request, res: Response) => {
  const body = req.body;
  const db = await getDb();
  const id = body.id || cryptoRandomId();

  await db.request()
    .input('id', id)
    .input('location', body.location)
    .input('label', body.label)
    .input('href', body.href)
    .input('sort_order', body.sort_order ?? 0)
    .input('is_visible', body.is_visible !== false ? 1 : 0)
    .input('parent_id', body.parent_id || null)
    .query(`
      MERGE NavigationItems AS target
      USING (SELECT @id AS id) AS source
      ON target.id = source.id
      WHEN MATCHED THEN
        UPDATE SET location = @location, label = @label, href = @href, sort_order = @sort_order, is_visible = @is_visible, parent_id = @parent_id
      WHEN NOT MATCHED THEN
        INSERT (id, location, label, href, sort_order, is_visible, parent_id)
        VALUES (@id, @location, @label, @href, @sort_order, @is_visible, @parent_id);
    `);

  res.status(200).json({ ...body, id });
});

cmsRouter.delete('/navigation-items/:id', requireAdmin, async (req: Request, res: Response) => {
  const db = await getDb();
  await db.request().input('id', req.params.id).query('DELETE FROM NavigationItems WHERE id = @id');
  res.status(204).send();
});

cmsRouter.get('/homepage-banners', async (req: Request, res: Response) => {
  const activeOnly = req.query.active !== 'false';
  const db = await getDb();

  let query = 'SELECT * FROM HomepageBanners';
  if (activeOnly) query += ' WHERE is_active = 1';
  query += ' ORDER BY sort_order ASC';

  const result = await db.request().query(query);
  res.json(result.recordset.map(mapHomepageBanner));
});

cmsRouter.post('/homepage-banners/upsert', requireAdmin, async (req: Request, res: Response) => {
  const body = req.body;
  const db = await getDb();
  const id = body.id || cryptoRandomId();

  await db.request()
    .input('id', id)
    .input('name', body.name)
    .input('tagline', body.tagline)
    .input('image_url', body.image_url)
    .input('link', body.link)
    .input('accent_color', body.accent_color)
    .input('sort_order', body.sort_order ?? 0)
    .input('is_active', body.is_active !== false ? 1 : 0)
    .query(`
      MERGE HomepageBanners AS target
      USING (SELECT @id AS id) AS source
      ON target.id = source.id
      WHEN MATCHED THEN
        UPDATE SET name = @name, tagline = @tagline, image_url = @image_url, link = @link, accent_color = @accent_color, sort_order = @sort_order, is_active = @is_active
      WHEN NOT MATCHED THEN
        INSERT (id, name, tagline, image_url, link, accent_color, sort_order, is_active)
        VALUES (@id, @name, @tagline, @image_url, @link, @accent_color, @sort_order, @is_active);
    `);

  res.status(200).json({ ...body, id });
});

cmsRouter.delete('/homepage-banners/:id', requireAdmin, async (req: Request, res: Response) => {
  const db = await getDb();
  await db.request().input('id', req.params.id).query('DELETE FROM HomepageBanners WHERE id = @id');
  res.status(204).send();
});

function mapSiteContent(row: any) {
  return {
    id: row.id,
    section: row.section,
    content_key: row.content_key,
    content_value: row.content_value,
    content_type: row.content_type,
    sort_order: row.sort_order,
  };
}

function mapNavigationItem(row: any) {
  return {
    id: row.id,
    location: row.location,
    label: row.label,
    href: row.href,
    sort_order: row.sort_order,
    is_visible: !!row.is_visible,
    parent_id: row.parent_id,
  };
}

function mapHomepageBanner(row: any) {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    image_url: row.image_url,
    link: row.link,
    accent_color: row.accent_color,
    sort_order: row.sort_order,
    is_active: !!row.is_active,
  };
}

function cryptoRandomId() {
  return `cms-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
