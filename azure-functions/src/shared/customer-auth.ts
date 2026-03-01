import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import type { HttpRequest, HttpResponseInit } from '@azure/functions';
import { errorResponse, handleOptions } from './http.js';

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface CustomerTokenPayload {
  sub: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export type CustomerHandler = (req: HttpRequest, user: AuthUser) => Promise<HttpResponseInit>;

function base64urlEncode(input: string | Buffer): string {
  return Buffer.from(input).toString('base64url');
}

function base64urlDecode(input: string): Buffer {
  return Buffer.from(input, 'base64url');
}

function getTokenSecret(): string {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) throw new Error('AUTH_JWT_SECRET is not configured');
  return secret;
}

function sign(payload: CustomerTokenPayload): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac('sha256', getTokenSecret()).update(data).digest('base64url');
  return `${data}.${signature}`;
}

function verifyToken(token: string): CustomerTokenPayload {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');

  const [encodedHeader, encodedPayload, signature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  const expected = createHmac('sha256', getTokenSecret()).update(data).digest();
  const provided = base64urlDecode(signature);

  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) {
    throw new Error('Invalid token signature');
  }

  const payload = JSON.parse(base64urlDecode(encodedPayload).toString('utf-8')) as CustomerTokenPayload;
  const now = Math.floor(Date.now() / 1000);
  if (!payload.exp || now >= payload.exp) throw new Error('Token expired');
  if (!payload.sub || !payload.email) throw new Error('Invalid token payload');
  return payload;
}

export function createCustomerToken(user: AuthUser): string {
  const now = Math.floor(Date.now() / 1000);
  return sign({
    sub: user.id,
    email: user.email,
    name: user.name,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  });
}

function extractBearerToken(req: HttpRequest): string | null {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export function getCustomerUserFromRequest(req: HttpRequest): AuthUser {
  const token = extractBearerToken(req);
  if (!token) throw new Error('Missing Authorization header');
  const payload = verifyToken(token);
  return { id: payload.sub, email: payload.email, name: payload.name };
}

export function requireCustomerAuth(handler: CustomerHandler): (req: HttpRequest) => Promise<HttpResponseInit> {
  return async (req: HttpRequest): Promise<HttpResponseInit> => {
    if (req.method === 'OPTIONS') return handleOptions();
    try {
      const user = getCustomerUserFromRequest(req);
      return handler(req, user);
    } catch (err: any) {
      return errorResponse(401, `Authentication failed: ${err.message}`);
    }
  };
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hashHex] = storedHash.split(':');
  if (!salt || !hashHex) return false;

  const derived = scryptSync(password, salt, 64).toString('hex');
  const expected = Buffer.from(hashHex, 'hex');
  const provided = Buffer.from(derived, 'hex');
  if (expected.length !== provided.length) return false;
  return timingSafeEqual(expected, provided);
}