import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { require: true },
});

async function checkSchema() {
    try {
        const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'favorites'
      ORDER BY ordinal_position
    `);
        const output = res.rows.map(col => `- ${col.column_name}: ${col.data_type}`).join('\n');
        fs.writeFileSync('schema_output.txt', output);
        console.log('Schema written to schema_output.txt');
    } catch (err) {
        console.error('Schema check failed:', err);
    } finally {
        await pool.end();
    }
}

checkSchema();
