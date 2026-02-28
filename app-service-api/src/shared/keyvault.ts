import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

type CacheEntry = { value: string; expiresAt: number };
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000;

function getLocalFallback(name: string): string | undefined {
  const map: Record<string, string> = {
    'sql-server': process.env.SQL_SERVER || '',
    'sql-database': process.env.SQL_DATABASE || '',
    'sql-user': process.env.SQL_USER || '',
    'sql-password': process.env.SQL_PASSWORD || '',
  };
  const value = map[name];
  return value || undefined;
}

export async function getSecret(name: string): Promise<string> {
  const cached = cache.get(name);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const fallback = getLocalFallback(name);
  const keyVaultUrl = process.env.KEY_VAULT_URL;

  if (!keyVaultUrl) {
    if (!fallback) throw new Error(`Missing KEY_VAULT_URL and fallback env for secret '${name}'`);
    cache.set(name, { value: fallback, expiresAt: Date.now() + CACHE_TTL_MS });
    return fallback;
  }

  try {
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(keyVaultUrl, credential);
    const secret = await client.getSecret(name);

    if (!secret.value) throw new Error(`Secret '${name}' is empty`);

    cache.set(name, { value: secret.value, expiresAt: Date.now() + CACHE_TTL_MS });
    return secret.value;
  } catch {
    if (!fallback) throw new Error(`Unable to resolve secret '${name}' from Key Vault or env`);
    cache.set(name, { value: fallback, expiresAt: Date.now() + CACHE_TTL_MS });
    return fallback;
  }
}
