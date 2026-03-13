
import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://antonioterra@localhost:5432/imobai_db';

const ssl =
  connectionString.includes('railway.app') ||
  connectionString.includes('render.com') ||
  connectionString.includes('neon.tech')
    ? { rejectUnauthorized: false }
    : false;

const pool = new Pool({
  connectionString,
  ssl,
});

export default pool;

