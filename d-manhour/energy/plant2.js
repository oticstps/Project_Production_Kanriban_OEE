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

async function importSQL() {
    const connection = await mysql.createConnection(dbConfig);

    const rl = readline.createInterface({
        input: fs.createReadStream(sqlFile),
        crlfDelay: Infinity
    });

    let sqlBuffer = "";
    let count = 0;

    try {
        console.log("🚀 Mulai import SQL...");

        for await (const line of rl) {
            const trimmed = line.trim();

            // skip komentar & baris kosong
            if (
                trimmed.startsWith("--") ||
                trimmed.startsWith("/*") ||
                trimmed.startsWith("/*!") ||
                trimmed === ""
            ) continue;

            sqlBuffer += line + "\n";

            // eksekusi jika satu statement selesai
            if (trimmed.endsWith(";")) {
                await connection.query(sqlBuffer);
                sqlBuffer = "";
                count++;

                if (count % 100 === 0) {
                    console.log(`✅ ${count} query berhasil dieksekusi`);
                }
            }
        }

        console.log(`🎉 Import selesai. Total query: ${count}`);
    } catch (err) {
        console.error("❌ Error saat import:", err.message);
    } finally {
        await connection.end();
        rl.close();
    }
}

importSQL();
