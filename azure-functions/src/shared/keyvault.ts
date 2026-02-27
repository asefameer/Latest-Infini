/**
 * Azure Key Vault Secret Retrieval via Managed Identity
 *
 * Uses the Azure Identity DefaultAzureCredential which automatically
 * picks up the system-assigned managed identity when running on App Service
 * or Azure Functions. Falls back to environment variables for local dev.
 *
 * Required App Settings:
 *   KEY_VAULT_URL – e.g. "https://kv-portal-infinity-i001.vault.azure.net"
 *
 * Note: The Function App's managed identity must have "Key Vault Secrets User"
 * role on the Key Vault resource.
 */

// Cache for secrets to avoid repeated Key Vault calls
const secretCache = new Map<string, { value: string; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Get a secret from Azure Key Vault using REST API + Managed Identity.
 * Falls back to environment variable if Key Vault is not configured.
 */
export async function getSecret(secretName: string): Promise<string> {
  // Check cache first
  const cached = secretCache.get(secretName);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.value;
  }

  const vaultUrl = process.env.KEY_VAULT_URL;
  if (!vaultUrl) {
    // Fallback: read directly from environment (local dev)
    const envValue = process.env[secretName.replace(/-/g, '_').toUpperCase()];
    if (envValue) return envValue;
    throw new Error(`KEY_VAULT_URL not set and no env var found for ${secretName}`);
  }

  try {
    // Get access token from Managed Identity endpoint
    const tokenResponse = await fetch(
      `${process.env.IDENTITY_ENDPOINT}?resource=https://vault.azure.net&api-version=2019-08-01`,
      {
        headers: {
          'X-IDENTITY-HEADER': process.env.IDENTITY_HEADER || '',
        },
      }
    );

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get managed identity token: ${tokenResponse.status}`);
    }

    const tokenData = (await tokenResponse.json()) as { access_token: string };

    // Fetch secret from Key Vault
    const secretResponse = await fetch(
      `${vaultUrl}/secrets/${secretName}?api-version=7.4`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    if (!secretResponse.ok) {
      throw new Error(`Failed to get secret '${secretName}': ${secretResponse.status}`);
    }

    const secretData = (await secretResponse.json()) as { value: string };

    // Cache the value
    secretCache.set(secretName, {
      value: secretData.value,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return secretData.value;
  } catch (err: any) {
    console.error(`Key Vault error for '${secretName}':`, err.message);
    // Fallback to env var
    const envValue = process.env[secretName.replace(/-/g, '_').toUpperCase()];
    if (envValue) return envValue;
    throw err;
  }
}

/** Pre-load commonly used secrets into cache */
export async function preloadSecrets(names: string[]): Promise<void> {
  await Promise.allSettled(names.map(name => getSecret(name)));
}
