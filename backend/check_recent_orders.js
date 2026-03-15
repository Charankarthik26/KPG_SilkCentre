import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { require: true },
});

async function checkOrders() {
    try {
        const res = await pool.query(`
      SELECT o.id, u.email, o.total_amount, o.created_at, o.tracking_id 
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);
        console.log('RECENT ORDERS:');
        res.rows.forEach(order => {
            console.log(`ID: ${order.id} | Email: ${order.email} | Amount: ${order.total_amount} | Created: ${order.created_at} | Tracking: ${order.tracking_id}`);
        });
    } catch (err) {
        console.error('Check failed:', err);
    } finally {
        await pool.end();
    }
}

checkOrders();
