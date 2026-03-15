import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { require: true },
});

async function checkSchema() {
    try {
        const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
        console.log('Tables in public schema:', res.rows.map(r => r.table_name));

        const checkFav = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'favorites'
    `);
        console.log('Favorites Columns:', checkFav.rows);
    } catch (err) {
        console.error('Schema check failed:', err);
    } finally {
        await pool.end();
    }
}

checkSchema();
