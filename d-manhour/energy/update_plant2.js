const fs = require("fs");
const readline = require("readline");
const mysql = require("mysql2/promise");

const sqlFile = "C:/Users/234066/Desktop/db_tps_kwh_plant_2.sql";

// KONFIGURASI DATABASE TUJUAN
const dbConfig = {
    host: "169.254.33.24",
    user: "otics_tps",
    password: "sukatno_ali",
    database: "database_tps_plant_2",
    multipleStatements: true
};

(async () => {
    try {
        console.log("🔄 Menghubungkan ke database...");
        const db = await mysql.createConnection(dbConfig);

        console.log("📄 Membaca file SQL secara streaming...");
        const fileStream = fs.createReadStream(sqlFile);

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let sqlBuffer = "";
        let totalQuery = 0;

        for await (const line of rl) {
            // Lewati komentar
            if (line.startsWith("--") || line.startsWith("/*") || line.trim() === "") {
                continue;
            }

            sqlBuffer += line + "\n";

            // Jika menemukan tanda akhir query ;
            if (line.trim().endsWith(";")) {
                try {
                    await db.query(sqlBuffer);
                    totalQuery++;
                    console.log(`✔ Query ke-${totalQuery} berhasil dieksekusi`);
                } catch (err) {
                    console.error("❌ ERROR eksekusi query:");
                    console.error(sqlBuffer);
                    console.error(err);
                }

                sqlBuffer = ""; // reset buffer
            }
        }

        console.log(`\n🎉 SELESAI! Total query dijalankan: ${totalQuery}`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Gagal:", error);
        process.exit(1);
    }
})();
