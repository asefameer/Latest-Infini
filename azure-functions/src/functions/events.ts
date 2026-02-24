/**
 * Events API — Azure Function (HTTP Trigger)
 *
 * Routes:
 *   GET    /api/events              → list (supports ?brand, ?featured)
 *   GET    /api/events/:id          → get by ID
 *   GET    /api/events/slug/:slug   → get by slug
 *   POST   /api/events              → create
 *   PUT    /api/events/:id          → update
 *   DELETE /api/events/:id          → delete
 */
import { app, HttpRequest } from '@azure/functions';
import { getDb } from '../shared/db.js';
import { corsResponse, handleOptions, parseBody, errorResponse } from '../shared/http.js';
import { requireAdmin } from '../shared/auth.js';

// ── List / Filter ──
app.http('events-list', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'events',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();

    const db = await getDb();
    const brand = req.query.get('brand');
    const featured = req.query.get('featured');

    let query = 'SELECT * FROM Events WHERE 1=1';
    const request = db.request();

    if (brand) {
      query += ' AND brand = @brand';
      request.input('brand', brand);
    }
    if (featured === 'true') query += ' AND isFeatured = 1';

    query += ' ORDER BY date ASC';
    const result = await request.query(query);

    return corsResponse(200, result.recordset.map(parseEventRow));
  },
});

// ── Get by ID ──
app.http('events-get', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'events/{id}',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();

    const id = req.params.id;
    if (id === 'slug') return corsResponse(400, { error: 'Use /events/slug/:slug' });

    const db = await getDb();
    const result = await db.request().input('id', id).query('SELECT * FROM Events WHERE id = @id');

    if (result.recordset.length === 0) return errorResponse(404, 'Event not found');
    return corsResponse(200, parseEventRow(result.recordset[0]));
  },
});

// ── Get by Slug ──
app.http('events-get-slug', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'events/slug/{slug}',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();

    const slug = req.params.slug;
    const db = await getDb();
    const result = await db.request().input('slug', slug).query('SELECT * FROM Events WHERE slug = @slug');

    if (result.recordset.length === 0) return errorResponse(404, 'Event not found');
    return corsResponse(200, parseEventRow(result.recordset[0]));
  },
});

// ── Create ──
app.http('events-create', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'events',
  handler: requireAdmin(async (req) => {

    const body = await parseBody<any>(req);
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

    return corsResponse(201, body);
  }),
});

// ── Update ──
app.http('events-update', {
  methods: ['PUT', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'events/{id}',
  handler: requireAdmin(async (req) => {

    const id = req.params.id;
    const body = await parseBody<any>(req);
    const db = await getDb();

    const scalarFields = ['slug', 'title', 'brand', 'date', 'time', 'venue', 'city', 'bannerImage', 'description'];
    const jsonFields = ['ticketTiers', 'faq', 'lineup', 'schedule'];
    const boolFields = ['isFeatured'];
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
    for (const f of boolFields) {
      if (body[f] !== undefined) {
        setClauses.push(`${f} = @${f}`);
        request.input(f, body[f] ? 1 : 0);
      }
    }

    if (setClauses.length === 0) return errorResponse(400, 'No fields to update');

    await request.query(`UPDATE Events SET ${setClauses.join(', ')} WHERE id = @id`);
    return corsResponse(200, { id, ...body });
  }),
});

// ── Delete ──
app.http('events-delete', {
  methods: ['DELETE', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'events/{id}',
  handler: requireAdmin(async (req) => {
    const id = req.params.id;
    const db = await getDb();
    await db.request().input('id', id).query('DELETE FROM Events WHERE id = @id');
    return corsResponse(204);
  }),
});

// ── Row parser ──
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

function tryParseJson(val: string | null | undefined, fallback: any) {
  if (!val) return fallback;
  try { return JSON.parse(val); } catch { return fallback; }
}
