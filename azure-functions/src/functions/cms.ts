import { app, HttpRequest } from '@azure/functions';
import { randomUUID } from 'crypto';
import { getDb } from '../shared/db.js';
import { corsResponse, handleOptions, parseBody, errorResponse } from '../shared/http.js';
import { requireAdmin } from '../shared/auth.js';

app.http('cms-site-content-list', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'cms/site-content',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();

    const section = req.query.get('section');
    const db = await getDb();
    const request = db.request();
    let query = `
      SELECT id, section, content_key, content_value, content_type, sort_order
      FROM site_content
    `;

    if (section) {
      query += ' WHERE section = @section';
      request.input('section', section);
    }

    query += ' ORDER BY section ASC, sort_order ASC, content_key ASC';
    const result = await request.query(query);
    return corsResponse(200, result.recordset);
  },
});

app.http('cms-site-content-upsert', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'cms/site-content/upsert',
  handler: requireAdmin(async (req) => {
    const body = await parseBody<any>(req);
    if (!body?.section || !body?.content_key) return errorResponse(400, 'section and content_key are required');

    const db = await getDb();
    const id = body.id || randomUUID();

    await db.request()
      .input('id', id)
      .input('section', body.section)
      .input('content_key', body.content_key)
      .input('content_value', body.content_value ?? '')
      .input('content_type', body.content_type ?? 'text')
      .input('sort_order', body.sort_order ?? 0)
      .query(`
        MERGE site_content AS target
        USING (SELECT @id AS id, @section AS section, @content_key AS content_key) AS source
          ON target.id = source.id OR (target.section = source.section AND target.content_key = source.content_key)
        WHEN MATCHED THEN
          UPDATE SET
            section = @section,
            content_key = @content_key,
            content_value = @content_value,
            content_type = @content_type,
            sort_order = @sort_order
        WHEN NOT MATCHED THEN
          INSERT (id, section, content_key, content_value, content_type, sort_order)
          VALUES (@id, @section, @content_key, @content_value, @content_type, @sort_order);
      `);

    return corsResponse(200, { id, ...body, content_value: body.content_value ?? '', content_type: body.content_type ?? 'text', sort_order: body.sort_order ?? 0 });
  }),
});

app.http('cms-site-content-update', {
  methods: ['PUT', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'cms/site-content/{id}',
  handler: requireAdmin(async (req) => {
    const id = req.params.id;
    const body = await parseBody<any>(req);

    const db = await getDb();
    const setClauses: string[] = [];
    const request = db.request().input('id', id);

    const fields = ['section', 'content_key', 'content_value', 'content_type', 'sort_order'];
    for (const field of fields) {
      if (body[field] !== undefined) {
        setClauses.push(`${field} = @${field}`);
        request.input(field, body[field]);
      }
    }

    if (setClauses.length === 0) return errorResponse(400, 'No fields to update');

    await request.query(`UPDATE site_content SET ${setClauses.join(', ')} WHERE id = @id`);
    return corsResponse(200, { id, ...body });
  }),
});

app.http('cms-site-content-delete', {
  methods: ['DELETE', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'cms/site-content/{id}',
  handler: requireAdmin(async (req) => {
    const id = req.params.id;
    const db = await getDb();
    await db.request().input('id', id).query('DELETE FROM site_content WHERE id = @id');
    return corsResponse(204);
  }),
});

app.http('cms-navigation-items-list', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'cms/navigation-items',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();

    const location = req.query.get('location');
    const visible = req.query.get('visible');
    const db = await getDb();
    const request = db.request();

    let query = `
      SELECT id, location, label, href, sort_order, is_visible, parent_id
      FROM navigation_items
      WHERE 1 = 1
    `;

    if (location) {
      query += ' AND location = @location';
      request.input('location', location);
    }

    if (visible !== 'false') {
      query += ' AND is_visible = 1';
    }

    query += ' ORDER BY location ASC, sort_order ASC';
    const result = await request.query(query);

    const rows = result.recordset.map((row: any) => ({
      ...row,
      is_visible: !!row.is_visible,
    }));

    return corsResponse(200, rows);
  },
});

app.http('cms-navigation-items-upsert', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'cms/navigation-items/upsert',
  handler: requireAdmin(async (req) => {
    const body = await parseBody<any>(req);
    if (!body?.label || !body?.href) return errorResponse(400, 'label and href are required');

    const id = body.id || randomUUID();
    const db = await getDb();

    await db.request()
      .input('id', id)
      .input('location', body.location ?? 'header')
      .input('label', body.label)
      .input('href', body.href)
      .input('sort_order', body.sort_order ?? 0)
      .input('is_visible', body.is_visible === false ? 0 : 1)
      .input('parent_id', body.parent_id ?? null)
      .query(`
        MERGE navigation_items AS target
        USING (SELECT @id AS id) AS source
          ON target.id = source.id
        WHEN MATCHED THEN
          UPDATE SET
            location = @location,
            label = @label,
            href = @href,
            sort_order = @sort_order,
            is_visible = @is_visible,
            parent_id = @parent_id
        WHEN NOT MATCHED THEN
          INSERT (id, location, label, href, sort_order, is_visible, parent_id)
          VALUES (@id, @location, @label, @href, @sort_order, @is_visible, @parent_id);
      `);

    return corsResponse(200, {
      id,
      location: body.location ?? 'header',
      label: body.label,
      href: body.href,
      sort_order: body.sort_order ?? 0,
      is_visible: body.is_visible === false ? false : true,
      parent_id: body.parent_id ?? null,
    });
  }),
});

app.http('cms-navigation-items-delete', {
  methods: ['DELETE', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'cms/navigation-items/{id}',
  handler: requireAdmin(async (req) => {
    const id = req.params.id;
    const db = await getDb();
    await db.request().input('id', id).query('DELETE FROM navigation_items WHERE id = @id');
    return corsResponse(204);
  }),
});

app.http('cms-homepage-banners-list', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'cms/homepage-banners',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();

    const active = req.query.get('active');
    const db = await getDb();
    const request = db.request();
    let query = `
      SELECT id, name, tagline, image_url, link, accent_color, sort_order, is_active
      FROM homepage_banners
    `;

    if (active !== 'false') {
      query += ' WHERE is_active = 1';
    }

    query += ' ORDER BY sort_order ASC';
    const result = await request.query(query);

    const rows = result.recordset.map((row: any) => ({
      ...row,
      is_active: !!row.is_active,
    }));

    return corsResponse(200, rows);
  },
});

app.http('cms-homepage-banners-upsert', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'cms/homepage-banners/upsert',
  handler: requireAdmin(async (req) => {
    const body = await parseBody<any>(req);
    if (!body?.name || !body?.image_url) return errorResponse(400, 'name and image_url are required');

    const id = body.id || randomUUID();
    const db = await getDb();

    await db.request()
      .input('id', id)
      .input('name', body.name)
      .input('tagline', body.tagline ?? '')
      .input('image_url', body.image_url)
      .input('link', body.link ?? '/')
      .input('accent_color', body.accent_color ?? '180 100% 50%')
      .input('sort_order', body.sort_order ?? 0)
      .input('is_active', body.is_active === false ? 0 : 1)
      .query(`
        MERGE homepage_banners AS target
        USING (SELECT @id AS id) AS source
          ON target.id = source.id
        WHEN MATCHED THEN
          UPDATE SET
            name = @name,
            tagline = @tagline,
            image_url = @image_url,
            link = @link,
            accent_color = @accent_color,
            sort_order = @sort_order,
            is_active = @is_active
        WHEN NOT MATCHED THEN
          INSERT (id, name, tagline, image_url, link, accent_color, sort_order, is_active)
          VALUES (@id, @name, @tagline, @image_url, @link, @accent_color, @sort_order, @is_active);
      `);

    return corsResponse(200, {
      id,
      name: body.name,
      tagline: body.tagline ?? '',
      image_url: body.image_url,
      link: body.link ?? '/',
      accent_color: body.accent_color ?? '180 100% 50%',
      sort_order: body.sort_order ?? 0,
      is_active: body.is_active === false ? false : true,
    });
  }),
});

app.http('cms-homepage-banners-delete', {
  methods: ['DELETE', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'cms/homepage-banners/{id}',
  handler: requireAdmin(async (req) => {
    const id = req.params.id;
    const db = await getDb();
    await db.request().input('id', id).query('DELETE FROM homepage_banners WHERE id = @id');
    return corsResponse(204);
  }),
});

app.http('uploads-cms-image', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'uploads/cms-image',
  handler: requireAdmin(async (req) => {
    const form = await req.formData();
    const file = form.get('file');

    if (!file || typeof file === 'string') {
      return errorResponse(400, 'Missing file');
    }

    const fileName = (file as File).name || 'cms-image';
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '-');
    return corsResponse(200, { url: `/uploads/${Date.now()}-${safeName}` });
  }),
});
