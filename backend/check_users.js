import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { require: true },
});

async function checkUsers() {
    try {
        const res = await pool.query('SELECT id, name, email FROM users ORDER BY id DESC');
        console.log(`Total users found: ${res.rows.length}`);
        res.rows.forEach(user => {
            console.log(`ID: ${user.id} | Name: ${user.name} | Email: ${user.email}`);
        });
    } catch (err) {
        console.error('Check failed:', err);
    } finally {
        await pool.end();
    }
}

checkUsers();
