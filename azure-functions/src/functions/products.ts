/**
 * Products API — Azure Function (HTTP Trigger)
 *
 * Routes:
 *   GET    /api/products              → list (supports ?category, ?brand, ?trending, ?new, ?featured)
 *   GET    /api/products/:id          → get by ID
 *   GET    /api/products/slug/:slug   → get by slug
 *   POST   /api/products              → create
 *   PUT    /api/products/:id          → update
 *   DELETE /api/products/:id          → delete
 */
import { app, HttpRequest, InvocationContext } from '@azure/functions';
import { getDb } from '../shared/db.js';
import { corsResponse, handleOptions, parseBody, errorResponse } from '../shared/http.js';
import { requireAdmin } from '../shared/auth.js';

// ── List / Filter ──
app.http('products-list', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'products',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();

    const db = await getDb();
    const category = req.query.get('category');
    const brand = req.query.get('brand');
    const trending = req.query.get('trending');
    const isNew = req.query.get('new');
    const featured = req.query.get('featured');

    let query = 'SELECT * FROM Products WHERE 1=1';
    const inputs: { name: string; value: string }[] = [];

    if (category) {
      query += ' AND category = @category';
      inputs.push({ name: 'category', value: category });
    }
    if (brand) {
      query += ' AND brand = @brand';
      inputs.push({ name: 'brand', value: brand });
    }
    if (trending === 'true') query += ' AND isTrending = 1';
    if (isNew === 'true') query += ' AND isNew = 1';
    if (featured === 'true') query += ' ORDER BY createdAt DESC OFFSET 0 ROWS FETCH NEXT 6 ROWS ONLY';

    const request = db.request();
    inputs.forEach(i => request.input(i.name, i.value));
    const result = await request.query(query);

    return corsResponse(200, result.recordset.map(parseProductRow));
  },
});

// ── Get by ID ──
app.http('products-get', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'products/{id}',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();

    const id = req.params.id;
    if (id === 'slug') return corsResponse(400, { error: 'Use /products/slug/:slug' });

    const db = await getDb();
    const result = await db.request().input('id', id).query('SELECT * FROM Products WHERE id = @id');

    if (result.recordset.length === 0) return errorResponse(404, 'Product not found');
    return corsResponse(200, parseProductRow(result.recordset[0]));
  },
});

// ── Get by Slug ──
app.http('products-get-slug', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'products/slug/{slug}',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();

    const slug = req.params.slug;
    const db = await getDb();
    const result = await db.request().input('slug', slug).query('SELECT * FROM Products WHERE slug = @slug');

    if (result.recordset.length === 0) return errorResponse(404, 'Product not found');
    return corsResponse(200, parseProductRow(result.recordset[0]));
  },
});

// ── Create ──
app.http('products-create', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'products',
  handler: requireAdmin(async (req) => {

    const body = await parseBody<any>(req);
    const db = await getDb();

    const result = await db.request()
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

    return corsResponse(201, { ...body });
  }),
});

// ── Update ──
app.http('products-update', {
  methods: ['PUT', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'products/{id}',
  handler: requireAdmin(async (req) => {

    const id = req.params.id;
    const body = await parseBody<any>(req);
    const db = await getDb();

    // Build dynamic SET clause from provided fields
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

    if (setClauses.length === 0) return errorResponse(400, 'No fields to update');

    await request.query(`UPDATE Products SET ${setClauses.join(', ')} WHERE id = @id`);
    return corsResponse(200, { id, ...body });
  }),
});

// ── Delete ──
app.http('products-delete', {
  methods: ['DELETE', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'products/{id}',
  handler: requireAdmin(async (req) => {
    const id = req.params.id;
    const db = await getDb();
    await db.request().input('id', id).query('DELETE FROM Products WHERE id = @id');
    return corsResponse(204);
  }),
});

// ── Row parser (JSON columns → JS objects) ──
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

function tryParseJson(val: string | null | undefined, fallback: any) {
  if (!val) return fallback;
  try { return JSON.parse(val); } catch { return fallback; }
}
