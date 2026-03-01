/**
 * Shared CORS + JSON response helpers for Azure Functions v4
 */
import { HttpRequest, HttpResponseInit } from '@azure/functions';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-token',
};

export function corsResponse(status: number, body?: unknown): HttpResponseInit {
  return {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  };
}

export function handleOptions(): HttpResponseInit {
  return { status: 204, headers: CORS_HEADERS };
}

export async function parseBody<T>(req: HttpRequest): Promise<T> {
  return (await req.json()) as T;
}

export function errorResponse(status: number, message: string): HttpResponseInit {
  return corsResponse(status, { error: message });
}
