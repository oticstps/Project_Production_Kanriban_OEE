const mysql = require('mysql2/promise');


// Database connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'wandaadii',
  password: 'pasbatron',
  database: 'database_v1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

