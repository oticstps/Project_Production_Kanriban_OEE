const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");

// konfigurasi database
const dbConfig = {
  host: "169.254.33.125",
  user: "otics_tps",
  password: "sukatno_ali",
  database: "database_tps_core",
  multipleStatements: true, // penting untuk file .sql
};

// buat koneksi
const connection = mysql.createConnection(dbConfig);

// path file SQL
const sqlFilePath = path.join(__dirname, "./hikitori_data.sql");

// baca file SQL
const sql = fs.readFileSync(sqlFilePath, "utf8");

// koneksi & import
connection.connect((err) => {
  if (err) {
    console.error("❌ Koneksi database gagal:", err.message);
    return;
  }

  console.log("✅ Terhubung ke database");

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Gagal import data:", err.message);
    } else {
      console.log("🎉 Import data berhasil!");
    }

    connection.end();
  });
});
