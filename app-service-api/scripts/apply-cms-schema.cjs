const fs = require('fs');
const sql = require('mssql');

async function main() {
  const connectionString = process.env.DB_CONN || process.env.DB_CONNECTION_STRING || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Database connection string is missing (set DB_CONN or DB_CONNECTION_STRING or DATABASE_URL)');
  }

  const script = fs.readFileSync('sql/cms-schema.sql', 'utf8');
  const pool = await sql.connect(connectionString);
  await pool.request().batch(script);
  await pool.close();
  console.log('CMS_SCHEMA_APPLIED');
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
