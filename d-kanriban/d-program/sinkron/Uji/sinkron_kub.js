
        // // KONEKSI DB
        // const db = await mysql.createConnection({
        //     host: "169.254.33.24",
        //     user: "otics_tps",
        //     password: "sukatno_ali",
        //     database: "database_tps_core",
        //     multipleStatements: true
        // });






const mysql = require("mysql2/promise");
const LineByLine = require("line-by-line");

// ==============================
// SETTING KONEKSI DATABASE
// ==============================
const dbConfig = {
    host: "169.254.33.24",
    user: "otics_tps",
    password: "sukatno_ali",
    database: "database_tps_core",
    multipleStatements: true
};

// ==============================
// NAMA FILE SQL YANG MAU DIIMPORT
// ==============================
const filePath = "C:/Users/234066/Downloads/common_rail_12.sql";


async function startImport() {
  console.log("⏳ Membuka koneksi database...");
  const conn = await mysql.createConnection(dbConfig);
  console.log("✅ Koneksi OK. Mulai import data...");

  const lr = new LineByLine(filePath);

  let buffer = "";
  let count = 0;

  lr.on("line", async (line) => {
    // Abaikan komentar atau baris kosong
    if (line.startsWith("--") || line.trim() === "") return;

    buffer += line;

    // Jika menemukan akhir statement
    if (line.trim().endsWith(";")) {
      lr.pause(); // pause sementara biar tidak keburu lanjut

      try {
        await conn.query(buffer);
        count++;
        if (count % 100 === 0) {
          console.log(`✔️  ${count} query diinsert...`);
        }
      } catch (err) {
        console.log("❌ Error Query:", err.message);
        console.log("Query Bermasalah:", buffer);
      }

      buffer = "";
      lr.resume();
    }
  });

  lr.on("end", async () => {
    console.log("🎉 IMPORT SELESAI");
    console.log(`Total query dieksekusi: ${count}`);
    await conn.end();
  });
}

startImport().catch(err => console.error("Error:", err));
