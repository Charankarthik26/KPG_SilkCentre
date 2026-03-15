import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { require: true },
});

async function checkTables() {
  const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  let output = 'TABLES: ' + res.rows.map(r => r.table_name).join(', ') + '\n';

  if (res.rows.some(r => r.table_name === 'products')) {
    const columns = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products'");
    output += 'COLUMNS: ' + columns.rows.map(c => c.column_name).join(', ') + '\n';
  }
  fs.writeFileSync('db_structure.txt', output);
  await pool.end();
}
checkTables().catch(err => fs.writeFileSync('db_structure.txt', err.message));
