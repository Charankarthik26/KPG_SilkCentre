import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { require: true },
});

async function addTrackingId() {
    try {
        console.log("Adding tracking_id to orders table...");
        await pool.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_id VARCHAR(100)');
        console.log("Success!");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await pool.end();
    }
}

addTrackingId();
