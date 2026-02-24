/**
 * CRM Messaging API — Email Campaigns, Push Notifications, Knowledge Base
 *
 * Routes:
 *   GET    /api/crm/email-campaigns       → list
 *   POST   /api/crm/email-campaigns       → create
 *   PUT    /api/crm/email-campaigns/:id   → update (schedule/send)
 *   GET    /api/crm/push-notifications    → list
 *   POST   /api/crm/push-notifications    → create
 *   PUT    /api/crm/push-notifications/:id → update
 *   GET    /api/crm/kb-articles           → list
 *   POST   /api/crm/kb-articles           → create
 *   PUT    /api/crm/kb-articles/:id       → update
 *   DELETE /api/crm/kb-articles/:id       → delete
 */
import { app, HttpRequest } from '@azure/functions';
import { getDb } from '../shared/db.js';
import { corsResponse, handleOptions, parseBody, errorResponse } from '../shared/http.js';

// ═══════════════════════════════════════
// Email Campaigns
// ═══════════════════════════════════════

app.http('email-campaigns-list', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/email-campaigns',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const db = await getDb();
    const result = await db.request().query('SELECT * FROM EmailCampaigns ORDER BY COALESCE(sentAt, scheduledAt, id) DESC');
    return corsResponse(200, result.recordset);
  },
});

app.http('email-campaigns-create', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/email-campaigns',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const body = await parseBody<any>(req);
    const db = await getDb();
    await db.request()
      .input('id', body.id)
      .input('name', body.name)
      .input('subject', body.subject)
      .input('status', body.status || 'draft')
      .input('segment', body.segment)
      .input('scheduledAt', body.scheduledAt || null)
      .input('sentAt', body.sentAt || null)
      .input('recipientCount', body.recipientCount || 0)
      .input('openRate', body.openRate || null)
      .input('clickRate', body.clickRate || null)
      .query(`
        INSERT INTO EmailCampaigns (id, name, subject, status, segment, scheduledAt, sentAt, recipientCount, openRate, clickRate)
        VALUES (@id, @name, @subject, @status, @segment, @scheduledAt, @sentAt, @recipientCount, @openRate, @clickRate)
      `);
    return corsResponse(201, body);
  },
});

app.http('email-campaigns-update', {
  methods: ['PUT', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/email-campaigns/{id}',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const id = req.params.id;
    const body = await parseBody<any>(req);
    const db = await getDb();
    const fields = ['name', 'subject', 'status', 'segment', 'scheduledAt', 'sentAt', 'recipientCount', 'openRate', 'clickRate'];
    const setClauses: string[] = [];
    const request = db.request().input('id', id);
    for (const f of fields) {
      if (body[f] !== undefined) { setClauses.push(`${f} = @${f}`); request.input(f, body[f]); }
    }
    if (setClauses.length === 0) return errorResponse(400, 'No fields to update');
    await request.query(`UPDATE EmailCampaigns SET ${setClauses.join(', ')} WHERE id = @id`);
    return corsResponse(200, { id, ...body });
  },
});

// ═══════════════════════════════════════
// Push Notifications
// ═══════════════════════════════════════

app.http('push-notifications-list', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/push-notifications',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const db = await getDb();
    const result = await db.request().query('SELECT * FROM PushNotifications ORDER BY COALESCE(sentAt, scheduledAt, id) DESC');
    return corsResponse(200, result.recordset);
  },
});

app.http('push-notifications-create', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/push-notifications',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const body = await parseBody<any>(req);
    const db = await getDb();
    await db.request()
      .input('id', body.id)
      .input('title', body.title)
      .input('body', body.body)
      .input('status', body.status || 'draft')
      .input('segment', body.segment)
      .input('scheduledAt', body.scheduledAt || null)
      .input('sentAt', body.sentAt || null)
      .input('recipientCount', body.recipientCount || 0)
      .query(`
        INSERT INTO PushNotifications (id, title, body, status, segment, scheduledAt, sentAt, recipientCount)
        VALUES (@id, @title, @body, @status, @segment, @scheduledAt, @sentAt, @recipientCount)
      `);
    return corsResponse(201, body);
  },
});

app.http('push-notifications-update', {
  methods: ['PUT', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/push-notifications/{id}',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const id = req.params.id;
    const body = await parseBody<any>(req);
    const db = await getDb();
    const fields = ['title', 'body', 'status', 'segment', 'scheduledAt', 'sentAt', 'recipientCount'];
    const setClauses: string[] = [];
    const request = db.request().input('id', id);
    for (const f of fields) {
      if (body[f] !== undefined) { setClauses.push(`${f} = @${f}`); request.input(f, body[f]); }
    }
    if (setClauses.length === 0) return errorResponse(400, 'No fields to update');
    await request.query(`UPDATE PushNotifications SET ${setClauses.join(', ')} WHERE id = @id`);
    return corsResponse(200, { id, ...body });
  },
});

// ═══════════════════════════════════════
// Knowledge Base Articles
// ═══════════════════════════════════════

app.http('kb-articles-list', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/kb-articles',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const db = await getDb();
    const result = await db.request().query('SELECT * FROM KBArticles ORDER BY updatedAt DESC');
    return corsResponse(200, result.recordset.map(r => ({ ...r, isPublished: !!r.isPublished })));
  },
});

app.http('kb-articles-create', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/kb-articles',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const body = await parseBody<any>(req);
    const db = await getDb();
    await db.request()
      .input('id', body.id)
      .input('title', body.title)
      .input('category', body.category)
      .input('content', body.content || '')
      .input('isPublished', body.isPublished ? 1 : 0)
      .input('updatedAt', body.updatedAt || new Date().toISOString().split('T')[0])
      .query('INSERT INTO KBArticles (id, title, category, content, isPublished, updatedAt) VALUES (@id, @title, @category, @content, @isPublished, @updatedAt)');
    return corsResponse(201, body);
  },
});

app.http('kb-articles-update', {
  methods: ['PUT', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/kb-articles/{id}',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const id = req.params.id;
    const body = await parseBody<any>(req);
    const db = await getDb();
    const fields = ['title', 'category', 'content', 'updatedAt'];
    const setClauses: string[] = [];
    const request = db.request().input('id', id);
    for (const f of fields) {
      if (body[f] !== undefined) { setClauses.push(`${f} = @${f}`); request.input(f, body[f]); }
    }
    if (body.isPublished !== undefined) { setClauses.push('isPublished = @isPublished'); request.input('isPublished', body.isPublished ? 1 : 0); }
    if (setClauses.length === 0) return errorResponse(400, 'No fields to update');
    await request.query(`UPDATE KBArticles SET ${setClauses.join(', ')} WHERE id = @id`);
    return corsResponse(200, { id, ...body });
  },
});

app.http('kb-articles-delete', {
  methods: ['DELETE', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/kb-articles/{id}',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const db = await getDb();
    await db.request().input('id', req.params.id).query('DELETE FROM KBArticles WHERE id = @id');
    return corsResponse(204);
  },
});
