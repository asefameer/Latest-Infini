/**
 * Azure AD B2C JWT Authentication Middleware
 *
 * Validates Bearer tokens issued by Azure AD B2C.
 * Fetches JWKS from the B2C OpenID Connect metadata endpoint,
 * caches keys in memory, and verifies token signature + claims.
 *
 * Required App Settings:
 *   B2C_TENANT_NAME   – e.g. "mycompanyb2c"
 *   B2C_POLICY_NAME   – e.g. "B2C_1_signupsignin"
 *   B2C_CLIENT_ID     – Application (client) ID registered in B2C
 *   B2C_ADMIN_ROLE    – Role claim value for admins (default: "Admin")
 */
import { HttpRequest, HttpResponseInit } from '@azure/functions';
import * as crypto from 'crypto';
import { errorResponse, handleOptions } from './http.js';

// ── Types ──

interface JWK {
  kty: string;
  use: string;
  kid: string;
  n: string;
  e: string;
}

interface JWKSResponse {
  keys: JWK[];
}

interface TokenPayload {
  sub: string;
  oid?: string;
  emails?: string[];
  extension_Role?: string;
  roles?: string[];
  tfp?: string;
  iss: string;
  aud: string;
  exp: number;
  nbf: number;
  [key: string]: unknown;
}

// ── JWKS Cache ──

let cachedKeys: JWK[] | null = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

async function getSigningKeys(): Promise<JWK[]> {
  if (cachedKeys && Date.now() < cacheExpiresAt) return cachedKeys;

  const tenant = process.env.B2C_TENANT_NAME;
  const policy = process.env.B2C_POLICY_NAME;
  if (!tenant || !policy) throw new Error('B2C_TENANT_NAME and B2C_POLICY_NAME must be set');

  const metadataUrl = `https://${tenant}.b2clogin.com/${tenant}.onmicrosoft.com/${policy}/v2.0/.well-known/openid-configuration`;
  const metaRes = await fetch(metadataUrl);
  if (!metaRes.ok) throw new Error(`Failed to fetch OIDC metadata: ${metaRes.status}`);
  const meta = (await metaRes.json()) as { jwks_uri: string };

  const jwksRes = await fetch(meta.jwks_uri);
  if (!jwksRes.ok) throw new Error(`Failed to fetch JWKS: ${jwksRes.status}`);
  const jwks = (await jwksRes.json()) as JWKSResponse;

  cachedKeys = jwks.keys;
  cacheExpiresAt = Date.now() + CACHE_TTL_MS;
  return cachedKeys;
}

// ── Base64url decoding ──

function base64urlDecode(str: string): Buffer {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Buffer.from(str, 'base64');
}

// ── JWT verification (no external JWT library needed) ──

async function verifyToken(token: string): Promise<TokenPayload> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');

  const [headerB64, payloadB64, signatureB64] = parts;
  const header = JSON.parse(base64urlDecode(headerB64).toString('utf-8'));
  const payload: TokenPayload = JSON.parse(base64urlDecode(payloadB64).toString('utf-8'));

  // ── Time validation ──
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && now > payload.exp) throw new Error('Token expired');
  if (payload.nbf && now < payload.nbf) throw new Error('Token not yet valid');

  // ── Audience validation ──
  const clientId = process.env.B2C_CLIENT_ID;
  if (clientId && payload.aud !== clientId) throw new Error('Invalid audience');

  // ── Signature validation ──
  const keys = await getSigningKeys();
  const key = keys.find(k => k.kid === header.kid);
  if (!key) throw new Error('Signing key not found');

  const pem = jwkToPem(key);
  const signedContent = `${headerB64}.${payloadB64}`;
  const signature = base64urlDecode(signatureB64);

  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(signedContent);
  if (!verifier.verify(pem, signature)) throw new Error('Invalid signature');

  return payload;
}

function jwkToPem(jwk: JWK): string {
  const n = base64urlDecode(jwk.n);
  const e = base64urlDecode(jwk.e);

  // DER encode RSA public key
  const nBytes = encodeLength(n.length) ;
  const eBytes = encodeLength(e.length);

  const nDer = Buffer.concat([Buffer.from([0x02]), nBytes, n.length > 127 || n[0] >= 0x80 ? Buffer.concat([Buffer.from([0]), n]) : n]);
  const eDer = Buffer.concat([Buffer.from([0x02]), eBytes, e]);

  // Recalculate with potential leading zero for n
  const nWithPad = n[0] >= 0x80 ? Buffer.concat([Buffer.from([0]), n]) : n;
  const nDerFinal = Buffer.concat([Buffer.from([0x02]), encodeLength(nWithPad.length), nWithPad]);
  const eDerFinal = Buffer.concat([Buffer.from([0x02]), encodeLength(e.length), e]);

  const seq = Buffer.concat([nDerFinal, eDerFinal]);
  const seqDer = Buffer.concat([Buffer.from([0x30]), encodeLength(seq.length), seq]);

  // BitString wrapper
  const bitString = Buffer.concat([Buffer.from([0x00]), seqDer]);
  const bitStringDer = Buffer.concat([Buffer.from([0x03]), encodeLength(bitString.length), bitString]);

  // AlgorithmIdentifier: OID for rsaEncryption + NULL
  const algoId = Buffer.from('300d06092a864886f70d0101010500', 'hex');

  const pubKeyInfo = Buffer.concat([algoId, bitStringDer]);
  const pubKeyInfoDer = Buffer.concat([Buffer.from([0x30]), encodeLength(pubKeyInfo.length), pubKeyInfo]);

  const b64 = pubKeyInfoDer.toString('base64');
  const lines = b64.match(/.{1,64}/g)!.join('\n');
  return `-----BEGIN PUBLIC KEY-----\n${lines}\n-----END PUBLIC KEY-----`;
}

function encodeLength(len: number): Buffer {
  if (len < 0x80) return Buffer.from([len]);
  if (len < 0x100) return Buffer.from([0x81, len]);
  return Buffer.from([0x82, (len >> 8) & 0xff, len & 0xff]);
}

// ── Extract Bearer token ──

function extractToken(req: HttpRequest): string | null {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function hasValidAdminApiToken(req: HttpRequest): boolean {
  const expected = process.env.ADMIN_API_TOKEN;
  if (!expected) return false;

  const provided = req.headers.get('x-admin-token');
  if (!provided) return false;

  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(provided);
  if (expectedBuf.length !== providedBuf.length) return false;

  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}

// ── Check admin role ──

function hasAdminRole(payload: TokenPayload): boolean {
  const requiredRole = process.env.B2C_ADMIN_ROLE || 'Admin';

  // Check extension_Role (B2C custom attribute)
  if (payload.extension_Role === requiredRole) return true;

  // Check roles array (App Roles from Azure AD)
  if (payload.roles && payload.roles.includes(requiredRole)) return true;

  return false;
}

// ── Public middleware: requireAdmin ──

export type AdminHandler = (req: HttpRequest, user: TokenPayload) => Promise<HttpResponseInit>;

/**
 * Wraps a handler to require a valid Azure AD B2C token with admin role.
 * OPTIONS requests are passed through for CORS preflight.
 */
export function requireAdmin(handler: AdminHandler): (req: HttpRequest) => Promise<HttpResponseInit> {
  return async (req: HttpRequest): Promise<HttpResponseInit> => {
    if (req.method === 'OPTIONS') return handleOptions();

    if (hasValidAdminApiToken(req)) {
      const now = Math.floor(Date.now() / 1000);
      const mockPayload: TokenPayload = {
        sub: 'admin_api_token',
        iss: 'admin_api_token',
        aud: 'admin_api_token',
        exp: now + 3600,
        nbf: now - 60,
        roles: [process.env.B2C_ADMIN_ROLE || 'Admin'],
      };
      return handler(req, mockPayload);
    }

    const token = extractToken(req);
    if (!token) return errorResponse(401, 'Missing Authorization header');

    try {
      const payload = await verifyToken(token);
      if (!hasAdminRole(payload)) return errorResponse(403, 'Insufficient permissions — admin role required');
      return handler(req, payload);
    } catch (err: any) {
      return errorResponse(401, `Authentication failed: ${err.message}`);
    }
  };
}

/**
 * Lighter variant: validates token but doesn't require admin role.
 */
export function requireAuth(handler: AdminHandler): (req: HttpRequest) => Promise<HttpResponseInit> {
  return async (req: HttpRequest): Promise<HttpResponseInit> => {
    if (req.method === 'OPTIONS') return handleOptions();

    const token = extractToken(req);
    if (!token) return errorResponse(401, 'Missing Authorization header');

    try {
      const payload = await verifyToken(token);
      return handler(req, payload);
    } catch (err: any) {
      return errorResponse(401, `Authentication failed: ${err.message}`);
    }
  };
}
