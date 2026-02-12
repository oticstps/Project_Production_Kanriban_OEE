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

        // 1. Ambil semua data mentah yang valid dari tabel baru
        const [rawData] = await conn.execute(`
            SELECT 
                id, 
                Panel_name,
                data_wh,
                Tanggal,
                Waktu,
                timestamp,
                shift
            FROM Main_data  -- Ganti dengan nama tabel yang sesuai
            WHERE Tanggal IS NOT NULL 
              AND Waktu IS NOT NULL
              AND STR_TO_DATE(CONCAT(Tanggal, ' ', Waktu), '%Y-%m-%d %H:%i:%s') IS NOT NULL
            ORDER BY timestamp ASC;
        `);

        if (rawData.length === 0) {
            console.log('⚠️ Tidak ada data mentah valid.');
            return;
        }

        // 2. Kelompokkan per shift (gunakan shift dari data atau hitung jika null)
        const shiftGroups = {};
        for (const row of rawData) {
            const dt = DateTime.fromJSDate(row.timestamp);
            const [hour, minute] = [dt.hour, dt.minute];
            
            // Gunakan shift dari data jika ada, jika tidak hitung berdasarkan waktu
            let shift = row.shift;
            if (!shift) {
                shift = getShift(hour, minute);
            }
            
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

            // Urutkan berdasarkan timestamp
            records.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
            const first = records[0];
            const last = records[records.length - 1];
            
            // Hitung delta_wh (selisih antara pertama dan terakhir dalam shift)
            let delta_wh = null;
            if (records.length >= 1) {
                const whFirst = parseWh(first.data_wh);
                const whLast = parseWh(last.data_wh);
                if (whLast !== null && whFirst !== null) {
                    delta_wh = Math.round(whLast - whFirst); // ✅ Integer
                }
            }

            const [shiftDate] = key.split('_');
            const shift = key.endsWith('1') ? 1 : 2;

            reportData.push([
                shift,
                shiftDate,
                last.id,
                last.Panel_name,
                last.data_wh, // Gunakan data_wh sebagai wh
                delta_wh,
                last.timestamp
            ]);
        }

        if (reportData.length === 0) {
            console.log('⚠️ Tidak ada shift valid untuk dilaporkan.');
            return;
        }

        // 4. HAPUS SEMUA DATA LAPORAN LAMA — sinkron penuh
        await conn.execute('TRUNCATE tb_kub_plant2_report');

        // 5. INSERT data terbaru 
        // Sesuaikan dengan struktur tabel laporan yang ada
        const placeholders = reportData.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(', ');
        const insertSQL = `
            INSERT INTO tb_kub_plant2_report 
            (shift, shift_date, last_record_id, panel_name, wh, delta_wh, record_datetime)
            VALUES ${placeholders}
        `;

        // Flatten array of arrays into single array
        const flatValues = reportData.flat();

        await conn.execute(insertSQL, flatValues);
        console.log(`✅ Sinkronisasi berhasil: ${reportData.length} record disimpan.`);

    } catch (err) {
        console.error('❌ Error:', err.message);
        if (err.sqlMessage) console.error('SQL:', err.sqlMessage);
        console.error('Stack:', err.stack);
    } finally {
        if (conn) await conn.end();
    }
}

// Tambahkan fungsi untuk menampilkan data contoh
async function showSampleData() {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        const [data] = await conn.execute(`
            SELECT 
                id,
                Panel_name,
                data_wh,
                Tanggal,
                Waktu,
                timestamp,
                shift
            FROM tb_kub_plant2
            ORDER BY timestamp DESC
            LIMIT 10
        `);
        
        console.log('\n📊 Contoh data dari tabel:');
        console.log('=' .repeat(80));
        data.forEach(row => {
            console.log(`ID: ${row.id}, Panel: ${row.Panel_name}, WH: ${row.data_wh}, Tanggal: ${row.Tanggal}, Waktu: ${row.Waktu}, Shift: ${row.shift}`);
        });
        
    } catch (err) {
        console.error('Error mengambil contoh data:', err.message);
    } finally {
        if (conn) await conn.end();
    }
}

// Jalankan sinkronisasi
async function main() {
    console.log('🔄 Memulai sinkronisasi data...');
    await showSampleData();
    await syncShiftReport();
}

main();