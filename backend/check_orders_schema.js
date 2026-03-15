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
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'orders'
    `);
        console.log('ORDERS COLUMNS:');
        res.rows.forEach(col => console.log(`- ${col.column_name}`));
    } catch (err) {
        console.error('Schema check failed:', err);
    } finally {
        await pool.end();
    }
}

checkSchema();
