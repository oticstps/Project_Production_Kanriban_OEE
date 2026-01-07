
const mysql = require('mysql2/promise');
const { DateTime } = require('luxon');

const dbConfig = {
    host: "169.254.33.24",
    user: "otics_tps",
    password: "sukatno_ali",
    database: "database_tps_core",
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000
};

function getShift(hour, minute) {
    const total = hour * 60 + minute;
    const s1Start = 7 * 60 + 10;   // 07:10
    const s1End = 19 * 60 + 50;    // 19:50
    return (total >= s1Start && total < s1End) ? 1 : 2;
}

function parseWh(whStr) {
    if (whStr == null || whStr === '') return null;
    const clean = String(whStr).replace(/,/g, '').trim();
    const num = parseFloat(clean);
    return isNaN(num) ? null : num;
}

async function syncShiftReport() {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);

        // 1. Ambil semua data mentah yang valid
        const [rawData] = await conn.execute(`
            SELECT 
                id, col1, power_meter, wh,
                STR_TO_DATE(CONCAT(date, ' ', time), '%Y-%m-%d %H:%i:%s') AS record_datetime
            FROM tb_kub_plant2
            WHERE date IS NOT NULL 
              AND time IS NOT NULL
              AND STR_TO_DATE(CONCAT(date, ' ', time), '%Y-%m-%d %H:%i:%s') IS NOT NULL
            ORDER BY record_datetime ASC;
        `);

        if (rawData.length === 0) {
            console.log('⚠️ Tidak ada data mentah valid.');
            return;
        }

        // 2. Kelompokkan per shift
        const shiftGroups = {};
        for (const row of rawData) {
            const dt = DateTime.fromJSDate(row.record_datetime);
            const [hour, minute] = [dt.hour, dt.minute];
            let shift = getShift(hour, minute);
            let shiftDate = dt;

            // Shift 2 sebelum 07:10 → milik hari sebelumnya
            if (shift === 2 && (hour < 7 || (hour === 7 && minute < 10))) {
                shiftDate = dt.minus({ days: 1 });
            }

            const key = `${shiftDate.toISODate()}_shift${shift}`;
            shiftGroups[key] = shiftGroups[key] || [];
            shiftGroups[key].push(row);
        }

        // 3. Siapkan data laporan
        const reportData = [];
        for (const [key, records] of Object.entries(shiftGroups)) {
            if (records.length === 0) continue;

            const last = records[records.length - 1];
            let delta_wh = null;

            if (records.length >= 2) {
                const prev = records[records.length - 2];
                const whEnd = parseWh(last.wh);
                const whPrev = parseWh(prev.wh);
                if (whEnd !== null && whPrev !== null) {
                    delta_wh = Math.round(whEnd - whPrev); // ✅ Integer
                }
            }

            const [shiftDate] = key.split('_');
            const shift = key.endsWith('1') ? 1 : 2;

            reportData.push([
                shift,
                shiftDate,
                last.id,
                last.col1,
                last.power_meter,
                last.wh,
                delta_wh,
                last.record_datetime
            ]);
        }

        if (reportData.length === 0) {
            console.log('⚠️ Tidak ada shift valid untuk dilaporkan.');
            return;
        }

        // 4. HAPUS SEMUA DATA LAPORAN LAMA — sinkron penuh
        await conn.execute('TRUNCATE tb_kub_plant2_report');

        // 5. INSERT data terbaru (gunakan INSERT ... VALUES (...), (...))
        const placeholders = reportData.map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
        const insertSQL = `
            INSERT INTO tb_kub_plant2_report 
            (shift, shift_date, last_record_id, col1, power_meter, wh, delta_wh, record_datetime)
            VALUES ${placeholders}
        `;

        // Flatten array of arrays into single array
        const flatValues = reportData.flat();

        await conn.execute(insertSQL, flatValues);
        console.log(`✅ Sinkronisasi berhasil: ${reportData.length} record disimpan.`);

    } catch (err) {
        console.error('❌ Error:', err.message);
        if (err.sqlMessage) console.error('SQL:', err.sqlMessage);
    } finally {
        if (conn) await conn.end();
    }
}

// Jalankan
syncShiftReport();