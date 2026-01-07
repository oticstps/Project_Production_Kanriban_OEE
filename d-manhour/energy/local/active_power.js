const mysql = require("mysql2/promise");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta");

const dbConfigSource = {
    host: "169.254.33.125",
    user: "otics_tps",
    password: "sukatno_ali",
    database: "database_tps_energy"
};

const dbConfigTarget = {
    host: "169.254.33.24",
    user: "otics_tps",
    password: "sukatno_ali",
    database: "database_tps_core"
};

const BATCH_SIZE = 2000; // Sesuaikan berdasarkan memori dan max_allowed_packet

async function syncActivePower() {
    let connSource, connTarget;

    try {
        connSource = await mysql.createConnection(dbConfigSource);
        connTarget = await mysql.createConnection(dbConfigTarget);
        console.log("✅ Terhubung ke kedua database");

        console.log("📥 Mengambil data dari sumber...");
        const [rows] = await connSource.execute(`
            SELECT date_time, power_meter, value, shift, day, week, month, year
            FROM tb_kub1_active_power
            ORDER BY date_time
        `);

        if (!rows.length) {
            console.log("⚠️ Tidak ada data di sumber.");
            return;
        }

        console.log(`📤 Memproses ${rows.length} baris dalam batch...`);

        // Nonaktifkan autocommit sementara
        await connTarget.beginTransaction();

        for (let i = 0; i < rows.length; i += BATCH_SIZE) {
            const batch = rows.slice(i, i + BATCH_SIZE);

            const values = batch.map(row => [
                row.date_time,
                row.power_meter,
                row.value,
                row.shift,
                row.day,
                row.week,
                row.month,
                row.year
            ]);

            const placeholders = values.map(() => "(?, ?, ?, ?, ?, ?, ?, ?)").join(", ");

            const sql = `
                INSERT INTO tb_kub1_active_power
                    (date_time, power_meter, value, shift, day, week, month, year)
                VALUES ${placeholders}
                ON DUPLICATE KEY UPDATE
                    value = VALUES(value),
                    shift = VALUES(shift),
                    day = VALUES(day),
                    week = VALUES(week),
                    month = VALUES(month),
                    year = VALUES(year)
            `;

            // Flatten array of arrays into single array for execute
            const flatValues = values.flat();

            await connTarget.execute(sql, flatValues);
            console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1} selesai (${i + batch.length}/${rows.length})`);
        }

        await connTarget.commit();
        console.log("🎉 Sinkronisasi selesai!");

    } catch (err) {
        console.error("❌ Error:", err);
        if (connTarget) await connTarget.rollback();
    } finally {
        if (connSource) await connSource.end();
        if (connTarget) await connTarget.end();
        console.log("🔌 Koneksi ditutup");
    }
}

syncActivePower();