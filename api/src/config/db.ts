import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

// Initialize the PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

const db = drizzle(pool);

export default db