


const fs = require("fs");
const mysql = require("mysql2/promise");

// ================= DB CONFIG =================
const dbConfig = {
  host: "169.254.33.24",
  user: "otics_tps",
  password: "sukatno_ali",
  database: "database_tps_core",
};

// ================= MAIN =================
(async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("✅ Terkoneksi ke database");

    const sqlText = fs.readFileSync("C:/Users/234066/Desktop/tb_total_kwh_kubikal.sql", "utf8");

    // ambil hanya baris INSERT
    const insertLines = sqlText
      .split(";\n")
      .filter(line => line.toUpperCase().startsWith("INSERT"));

    console.log(`📦 Total query INSERT: ${insertLines.length}`);

    let success = 0;

    for (let i = 0; i < insertLines.length; i++) {
      // ganti nama tabel
      const query = insertLines[i].replace(
        /tb_total_kwh_kubikal/gi,
        "tb_kub1_total_kwh"
      );

      try {
        await connection.query(query);
        success++;
      } catch (err) {
        console.error(`❌ Gagal di baris ${i + 1}:`, err.message);
      }

      // delay kecil biar MySQL nggak kaget
      await new Promise(r => setTimeout(r, 5));
    }

    console.log(`✅ Insert selesai: ${success}/${insertLines.length}`);
    await connection.end();

  } catch (err) {
    console.error("🔥 ERROR FATAL:", err.message);
  }
})();
