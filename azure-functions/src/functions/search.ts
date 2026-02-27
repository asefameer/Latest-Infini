/**
 * Search API — Azure Function (HTTP Trigger)
 * 
 * Proxies search requests to Azure AI Search (Cognitive Search).
 * This avoids exposing the search admin key to the frontend.
 *
 * Routes:
 *   GET /api/search?q=term&type=products|events&top=10&skip=0
 *
 * Required App Settings:
 *   AZURE_SEARCH_ENDPOINT  – e.g. "https://search-portal-prod-i001.search.windows.net"
 *   AZURE_SEARCH_API_KEY   – Query key (read-only) from Azure AI Search
 */
import { app, HttpRequest } from '@azure/functions';
import { corsResponse, handleOptions, errorResponse } from '../shared/http.js';

const SEARCH_ENDPOINT = process.env.AZURE_SEARCH_ENDPOINT || '';
const SEARCH_API_KEY = process.env.AZURE_SEARCH_API_KEY || '';

app.http('search', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'search',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();

    const q = req.query.get('q') || '*';
    const type = req.query.get('type') || 'products'; // "products" or "events"
    const top = parseInt(req.query.get('top') || '20', 10);
    const skip = parseInt(req.query.get('skip') || '0', 10);
    const filter = req.query.get('filter') || '';

    if (!SEARCH_ENDPOINT || !SEARCH_API_KEY) {
      return errorResponse(503, 'Azure AI Search is not configured');
    }

    const indexName = type === 'events' ? 'events-index' : 'products-index';

    const searchBody = {
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
    };

    try {
      const response = await fetch(
        `${SEARCH_ENDPOINT}/indexes/${indexName}/docs/search?api-version=2024-07-01`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': SEARCH_API_KEY,
          },
          body: JSON.stringify(searchBody),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error(`Azure Search error [${response.status}]: ${errText}`);
        return errorResponse(response.status, `Search failed: ${errText}`);
      }

      const data = await response.json();

      return corsResponse(200, {
        results: data.value || [],
        totalCount: data['@odata.count'] || 0,
        nextLink: data['@odata.nextLink'] || null,
      });
    } catch (err: any) {
      console.error('Search proxy error:', err);
      return errorResponse(500, `Search error: ${err.message}`);
    }
  },
});

// ── Autocomplete / Suggestions ──
app.http('search-suggest', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'search/suggest',
  handler: async (req: HttpRequest) => {
    if (req.method === 'OPTIONS') return handleOptions();

    const q = req.query.get('q') || '';
    const type = req.query.get('type') || 'products';

    if (!SEARCH_ENDPOINT || !SEARCH_API_KEY) {
      return errorResponse(503, 'Azure AI Search is not configured');
    }

    const indexName = type === 'events' ? 'events-index' : 'products-index';
    const suggesterName = type === 'events' ? 'events-suggester' : 'products-suggester';

    try {
      const response = await fetch(
        `${SEARCH_ENDPOINT}/indexes/${indexName}/docs/suggest?api-version=2024-07-01`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': SEARCH_API_KEY,
          },
          body: JSON.stringify({
            search: q,
            suggesterName,
            top: 5,
            fuzzy: true,
          }),
        }
      );

      if (!response.ok) {
        return errorResponse(response.status, 'Suggestions failed');
      }

      const data = await response.json();
      return corsResponse(200, { suggestions: data.value || [] });
    } catch (err: any) {
      return errorResponse(500, `Suggest error: ${err.message}`);
    }
  },
});
