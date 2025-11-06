const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit:0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

pool.on('error', (err) => {
    console.error('Error en el pool de MySQL', err);
});

module.exports = pool;