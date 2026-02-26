const { Pool } = require('pg');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

//validacion de seguridad
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL no está definida. Revisa tu archivo .env');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool; 