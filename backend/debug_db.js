import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { require: true },
});

async function checkTables() {
    try {
        const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('Tables:', res.rows.map(r => r.table_name));

        if (res.rows.find(r => r.table_name === 'favorites')) {
            const favSchema = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'favorites'");
            console.log('Favorites Schema:', favSchema.rows);
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await pool.end();
    }
}

checkTables();
