import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

async function updateSchema() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { require: true },
    });

    try {
        console.log("Connecting to database...");

        // 0. Create products table
        console.log("Creating products table...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100),
                sub_category VARCHAR(100),
                price VARCHAR(50),
                is_ar BOOLEAN DEFAULT FALSE,
                color VARCHAR(50),
                stock INTEGER DEFAULT 0,
                image TEXT,
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 1. Add profile fields to users table
        console.log("Updating users table with profile fields...");
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
            ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
            ADD COLUMN IF NOT EXISTS preferred_size VARCHAR(20),
            ADD COLUMN IF NOT EXISTS address TEXT,
            ADD COLUMN IF NOT EXISTS bio TEXT;
        `);

        // 2. Create favorites table
        console.log("Creating favorites table...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS favorites (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                product_id INTEGER NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, product_id)
            );
        `);

        // 3. Create orders table
        console.log("Creating orders table...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                total_amount VARCHAR(50) NOT NULL,
                status VARCHAR(50) DEFAULT 'Pending',
                shipping_address TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 4. Create order_items table
        console.log("Creating order_items table...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
                product_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                price VARCHAR(50) NOT NULL
            );
        `);

        // 5. Create cart_items table for persistence
        console.log("Creating cart_items table for persistence...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cart_items (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                product_id INTEGER NOT NULL,
                quantity INTEGER DEFAULT 1,
                UNIQUE(user_id, product_id)
            );
        `);

        console.log("Database schema updated successfully!");
    } catch (err) {
        console.error("Failed to update database schema:", err);
    } finally {
        await pool.end();
    }
}

updateSchema();
