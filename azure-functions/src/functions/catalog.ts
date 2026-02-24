/**
 * Banners, Categories, Brands — lightweight CRUD endpoints
 */
import { app, HttpRequest } from '@azure/functions';
import { getDb } from '../shared/db.js';
import { corsResponse, handleOptions, parseBody, errorResponse } from '../shared/http.js';
import { requireAdmin } from '../shared/auth.js';

// ── Categories ──
app.http('categories-list', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'categories',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const db = await getDb();
    const result = await db.request().query('SELECT * FROM Categories ORDER BY name');
    return corsResponse(200, result.recordset);
  },
});

// ── Brands ──
app.http('brands-list', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'brands',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const db = await getDb();
    const result = await db.request().query('SELECT * FROM Brands');
    return corsResponse(200, result.recordset);
  },
});

app.http('brands-get', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'brands/{id}',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const id = req.params.id;
    const db = await getDb();
    const result = await db.request().input('id', id).query('SELECT * FROM Brands WHERE id = @id');
    if (result.recordset.length === 0) return errorResponse(404, 'Brand not found');
    return corsResponse(200, result.recordset[0]);
  },
});

// ── Banners ──
app.http('banners-list', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'banners',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const db = await getDb();
    const placement = req.query.get('placement');
    let query = 'SELECT * FROM Banners';
    const request = db.request();
    if (placement) {
      query += ' WHERE placement = @placement AND isActive = 1';
      request.input('placement', placement);
    }
    query += ' ORDER BY [order] ASC';
    const result = await request.query(query);
    return corsResponse(200, result.recordset);
  },
});

app.http('banners-create', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'banners',
  handler: requireAdmin(async (req) => {
    const body = await parseBody<any>(req);
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
    return corsResponse(201, body);
  }),
});

app.http('banners-update', {
  methods: ['PUT', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'banners/{id}',
  handler: requireAdmin(async (req) => {
    const id = req.params.id;
    const body = await parseBody<any>(req);
    const db = await getDb();
    const fields = ['title', 'imageUrl', 'link', 'placement', 'order'];
    const setClauses: string[] = [];
    const request = db.request().input('id', id);
    for (const f of fields) {
      if (body[f] !== undefined) { setClauses.push(`${f === 'order' ? '[order]' : f} = @${f}`); request.input(f, body[f]); }
    }
    if (body.isActive !== undefined) { setClauses.push('isActive = @isActive'); request.input('isActive', body.isActive ? 1 : 0); }
    if (setClauses.length === 0) return errorResponse(400, 'No fields');
    await request.query(`UPDATE Banners SET ${setClauses.join(', ')} WHERE id = @id`);
    return corsResponse(200, { id, ...body });
  }),
});

app.http('banners-delete', {
  methods: ['DELETE', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'banners/{id}',
  handler: requireAdmin(async (req) => {
    const db = await getDb();
    await db.request().input('id', req.params.id).query('DELETE FROM Banners WHERE id = @id');
    return corsResponse(204);
  }),
});
