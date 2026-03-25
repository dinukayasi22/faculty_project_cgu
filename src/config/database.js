import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from './env.js';
import * as schema from '../db/schema.js';

const pool = new Pool({
    connectionString: env.DATABASE_URL,
});

// Test database connection
pool.on('error', (err) => {
    console.error('Unexpected database error:', err);
    process.exit(1);
});

// Verify connection on startup
export const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Database connection established successfully');
        client.release();
        return true;
    } catch (error) {
        console.error('Failed to connect to database:', error.message);
        throw error;
    }
};

export const db = drizzle(pool, { schema });
