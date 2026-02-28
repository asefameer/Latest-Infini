import { Request, Response, Router } from 'express';

export const searchRouter = Router();

const SEARCH_ENDPOINT = process.env.AZURE_SEARCH_ENDPOINT || '';
const SEARCH_API_KEY = process.env.AZURE_SEARCH_API_KEY || '';

searchRouter.get('/', async (req: Request, res: Response) => {
  const q = (req.query.q as string) || '*';
  const type = (req.query.type as string) || 'products';
  const top = parseInt((req.query.top as string) || '20', 10);
  const skip = parseInt((req.query.skip as string) || '0', 10);
  const filter = (req.query.filter as string) || '';

  if (!SEARCH_ENDPOINT || !SEARCH_API_KEY) {
    return res.status(503).json({ error: 'Azure AI Search is not configured' });
  }

  const indexName = type === 'events' ? 'events-index' : 'products-index';

  const response = await fetch(
    `${SEARCH_ENDPOINT}/indexes/${indexName}/docs/search?api-version=2024-07-01`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': SEARCH_API_KEY,
      },
      body: JSON.stringify({
        search: q,
        top,
        skip,
        count: true,
        queryType: 'simple',
        searchMode: 'any',
        ...(filter ? { filter } : {}),
        highlight: 'name,description',
        highlightPreTag: '<mark>',
        highlightPostTag: '</mark>',
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    return res.status(response.status).json({ error: text });
  }

  const data: any = await response.json();
  return res.json({
    results: data.value || [],
    totalCount: data['@odata.count'] || 0,
    nextLink: data['@odata.nextLink'] || null,
  });
});

searchRouter.get('/suggest', async (req: Request, res: Response) => {
  const q = (req.query.q as string) || '';
  const type = (req.query.type as string) || 'products';

  if (!SEARCH_ENDPOINT || !SEARCH_API_KEY) {
    return res.status(503).json({ error: 'Azure AI Search is not configured' });
  }

  const indexName = type === 'events' ? 'events-index' : 'products-index';
  const suggesterName = type === 'events' ? 'events-suggester' : 'products-suggester';

  const response = await fetch(
    `${SEARCH_ENDPOINT}/indexes/${indexName}/docs/suggest?api-version=2024-07-01`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': SEARCH_API_KEY,
      },
      body: JSON.stringify({ search: q, suggesterName, top: 5, fuzzy: true }),
    }
  );

  if (!response.ok) {
    return res.status(response.status).json({ error: 'Suggestions failed' });
  }

  const data: any = await response.json();
  return res.json({ suggestions: data.value || [] });
});
