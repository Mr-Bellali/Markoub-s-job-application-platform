import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema/admins';

// Initialize the PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

// Test the connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

(async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (err) {
    console.error('Error acquiring client', err);
  }
})();

const db = drizzle(pool, { schema });

export default db