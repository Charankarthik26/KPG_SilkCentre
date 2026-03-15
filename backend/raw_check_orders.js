import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { require: true },
});

async function checkOrders() {
    try {
        const res = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        console.log(`Total orders found: ${res.rows.length}`);
        res.rows.forEach(order => {
            console.log(`ID: ${order.id} | UserID: ${order.user_id} | Amount: ${order.total_amount} | Tracking: ${order.tracking_id}`);
        });
    } catch (err) {
        console.error('Check failed:', err);
    } finally {
        await pool.end();
    }
}

checkOrders();
