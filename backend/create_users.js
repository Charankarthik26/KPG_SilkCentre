import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function createUsersTable() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { require: true },
    });

    try {
        console.log("Connecting to database...");
        await pool.query('SELECT NOW()'); // Test connection

        console.log("Creating users table if it doesn't exist...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Users table created successfully!");
    } catch (err) {
        console.error("Failed to create users table:", err);
    } finally {
        await pool.end();
    }
}

createUsersTable();
