import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { require: true },
});

async function fixSchema() {
    try {
        // Check if columns exist before renaming
        const columnsRes = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products'
    `);
        const columnNames = columnsRes.rows.map(r => r.column_name);

        if (columnNames.includes('subCategory')) {
            await pool.query('ALTER TABLE products RENAME COLUMN "subCategory" TO sub_category');
            console.log('Renamed subCategory to sub_category');
        }

        if (columnNames.includes('isAR')) {
            await pool.query('ALTER TABLE products RENAME COLUMN "isAR" TO is_ar');
            console.log('Renamed isAR to is_ar');
        }

        console.log('Schema fix completed');
    } catch (err) {
        console.error('Schema fix failed:', err);
    } finally {
        await pool.end();
    }
}

fixSchema();
