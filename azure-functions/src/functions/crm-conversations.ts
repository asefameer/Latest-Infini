/**
 * CRM Conversations (Chatbot) API — Azure Function (HTTP Trigger)
 *
 * Routes:
 *   GET    /api/crm/conversations            → list (supports ?status)
 *   GET    /api/crm/conversations/:id         → get with messages
 *   PUT    /api/crm/conversations/:id/status  → update status
 *   POST   /api/crm/conversations/:id/messages → add message
 */
import { app, HttpRequest } from '@azure/functions';
import { getDb } from '../shared/db.js';
import { corsResponse, handleOptions, parseBody, errorResponse } from '../shared/http.js';

app.http('conversations-list', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/conversations',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const db = await getDb();
    const status = req.query.get('status');
    let query = 'SELECT * FROM Conversations';
    const request = db.request();
    if (status) { query += ' WHERE status = @status'; request.input('status', status); }
    query += ' ORDER BY lastMessageAt DESC';
    const result = await request.query(query);
    return corsResponse(200, result.recordset.map(parseConversationRow));
  },
});

app.http('conversations-get', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/conversations/{id}',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const db = await getDb();
    const result = await db.request().input('id', req.params.id).query('SELECT * FROM Conversations WHERE id = @id');
    if (result.recordset.length === 0) return errorResponse(404, 'Conversation not found');
    return corsResponse(200, parseConversationRow(result.recordset[0]));
  },
});

app.http('conversations-update-status', {
  methods: ['PUT', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/conversations/{id}/status',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const id = req.params.id;
    const body = await parseBody<{ status: string }>(req);
    if (!['open', 'resolved', 'escalated'].includes(body.status)) return errorResponse(400, 'Invalid status');
    const db = await getDb();
    await db.request().input('id', id).input('status', body.status).query('UPDATE Conversations SET status = @status WHERE id = @id');
    return corsResponse(200, { id, status: body.status });
  },
});

app.http('conversations-add-message', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'crm/conversations/{id}/messages',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();
    const id = req.params.id;
    const body = await parseBody<{ role: string; content: string }>(req);
    const db = await getDb();

    // Get existing messages
    const result = await db.request().input('id', id).query('SELECT messages FROM Conversations WHERE id = @id');
    if (result.recordset.length === 0) return errorResponse(404, 'Conversation not found');

    const messages = tryParseJson(result.recordset[0].messages, []);
    const newMsg = { id: `m-${Date.now()}`, role: body.role, content: body.content, timestamp: new Date().toISOString() };
    messages.push(newMsg);

    await db.request()
      .input('id', id)
      .input('messages', JSON.stringify(messages))
      .input('lastMessageAt', newMsg.timestamp)
      .query('UPDATE Conversations SET messages = @messages, lastMessageAt = @lastMessageAt WHERE id = @id');

    return corsResponse(201, newMsg);
  },
});

function parseConversationRow(row: any) {
  return { ...row, messages: tryParseJson(row.messages, []) };
}
function tryParseJson(val: string | null | undefined, fallback: any) {
  if (!val) return fallback;
  try { return JSON.parse(val); } catch { return fallback; }
}
