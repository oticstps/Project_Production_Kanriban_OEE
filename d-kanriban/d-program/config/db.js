const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "169.254.33.135",
  user: process.env.DB_USER || "otics_tps",
  password: process.env.DB_PASS || "sukatno_ali",
  database: process.env.DB_NAME || "database_tps_produksi",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+07:00",
});

module.exports = pool;




