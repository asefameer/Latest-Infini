/**
 * Azure SQL connection pool (mssql)
 *
 * Reads credentials from Azure Key Vault via Managed Identity.
 * Falls back to environment variables / local.settings.json for local dev.
 * The pool is reused across warm invocations for performance.
 */
import sql from 'mssql';
import { getSecret } from './keyvault.js';

let pool: sql.ConnectionPool | null = null;

export async function getDb(): Promise<sql.ConnectionPool> {
  if (!pool) {
    const [server, database, user, password] = await Promise.all([
      getSecret('sql-server'),
      getSecret('sql-database'),
      getSecret('sql-user'),
      getSecret('sql-password'),
    ]);

    const config: sql.config = {
      server,
      database,
      user,
      password,
      options: {
        encrypt: true,
        trustServerCertificate: false,
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
    };

    pool = await sql.connect(config);
  }
  return pool;
}
