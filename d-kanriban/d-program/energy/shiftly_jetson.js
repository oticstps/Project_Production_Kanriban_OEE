const mysql = require("mysql2/promise");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta");

// Konfigurasi database
const dbConfigSource = {
    host: "169.254.33.24",
    user: "otics_tps",
    password: "sukatno_ali",
    database: "database_tps_core",
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000
};

const dbConfigTarget = {
    host: "172.27.63.180",
    user: "otics_tps",
    password: "sukatno_ali",
    database: "database_tps_core",
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000
};

const lineTables = [

    { pm_type: "DA_01", line_table: "tb_kub1_total_kwh", line_name: "kubikal_1" },
];

async function testConnection(config, name) {
    try {
        const connection = await mysql.createConnection(config);
        console.log(`✅ Berhasil terhubung ke ${name}`);
        await connection.end();
        return true;
    } catch (error) {
        console.error(`❌ Gagal terhubung ke ${name}:`, error.message);
        return false;
    }
}

// Fungsi untuk mengambil data awal dan akhir dalam rentang shift
async function getShiftData(connection, tableName, startTime, endTime) {
    const [startRow] = await connection.query(`
        SELECT date_time, value
        FROM ${tableName}
        WHERE date_time >= ? AND date_time < ?
        ORDER BY date_time ASC
        LIMIT 1;
    `, [startTime.format('YYYY-MM-DD HH:mm:ss'), endTime.format('YYYY-MM-DD HH:mm:ss')]);

    const [endRow] = await connection.query(`
        SELECT date_time, value
        FROM ${tableName}
        WHERE date_time >= ? AND date_time < ?
        ORDER BY date_time DESC
        LIMIT 1;
    `, [startTime.format('YYYY-MM-DD HH:mm:ss'), endTime.format('YYYY-MM-DD HH:mm:ss')]);

    if (startRow.length > 0 && endRow.length > 0) {
        const startValue = parseFloat(startRow[0].value);
        const endValue = parseFloat(endRow[0].value);
        const totalValue = endValue - startValue;

        return {
            startDatetime: startRow[0].date_time,
            endDatetime: endRow[0].date_time,
            startValue,
            endValue,
            totalValue
        };
    }
    return null;
}

// Fungsi untuk INSERT atau UPDATE data shift
async function upsertShiftReport(connectionTarget, data) {
    const [cek] = await connectionTarget.query(`
        SELECT idPrimary FROM tb_pm_shiftly_kub_report
        WHERE pm_type = ? AND line_table = ? AND shift_date = ? AND shift = ?;
    `, [data.pm_type, data.line_table, data.shift_date, data.shift]);

    if (cek.length === 0) {
        // INSERT
        await connectionTarget.query(`
            INSERT INTO tb_pm_shiftly_kub_report (
                pm_type, line_table, line_name, shift, shift_date,
                shift_start_datetime, shift_end_datetime,
                start_kwh, end_kwh, total_kwh,
                year, month, month_name, day, day_name, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW());
        `, [
            data.pm_type, data.line_table, data.line_name, data.shift, data.shift_date,
            data.shift_start_datetime, data.shift_end_datetime,
            data.start_kwh, data.end_kwh, data.total_kwh,
            data.year, data.month, data.month_name, data.day, data.day_name
        ]);
        console.log(`✅ Insert Shift ${data.shift.slice(-1)}: ${data.shift_date} (${data.total_kwh} KWH)`);
    } else {
        // UPDATE
        await connectionTarget.query(`
            UPDATE tb_pm_shiftly_kub_report
            SET shift_start_datetime = ?, shift_end_datetime = ?, 
                start_kwh = ?, end_kwh = ?, total_kwh = ?, 
                month_name = ?, day_name = ?, updated_at = NOW()
            WHERE idPrimary = ?;
        `, [
            data.shift_start_datetime, data.shift_end_datetime,
            data.start_kwh, data.end_kwh, data.total_kwh,
            data.month_name, data.day_name,
            cek[0].idPrimary
        ]);
        console.log(`♻️ Update Shift ${data.shift.slice(-1)}: ${data.shift_date} (${data.total_kwh} KWH)`);
    }
}

async function rekapShiftly() {
    let connectionSource;
    let connectionTarget;
    
    try {
        console.log("🔌 Testing koneksi database...");
        
        // Test koneksi sumber
        const sourceConnected = await testConnection(dbConfigSource, "Database Sumber");
        if (!sourceConnected) {
            throw new Error("Tidak bisa terhubung ke database sumber");
        }
        
        // Test koneksi tujuan  
        const targetConnected = await testConnection(dbConfigTarget, "Database Tujuan");
        if (!targetConnected) {
            throw new Error("Tidak bisa terhubung ke database tujuan");
        }

        // Buat koneksi permanen
        connectionSource = await mysql.createConnection(dbConfigSource);
        connectionTarget = await mysql.createConnection(dbConfigTarget);
        
        console.log("✅ Kedua koneksi database berhasil");

        for (const line of lineTables) {
            console.log(`\n🔍 Proses shiftly: ${line.line_table}`);

            // Ambil semua kombinasi tanggal unik dari tabel SUMBER
            const [periode] = await connectionSource.query(`
                SELECT DISTINCT 
                DATE(date_time) as date,
                YEAR(date_time) as year,
                MONTH(date_time) as month,
                DAY(date_time) as day
                FROM ${line.line_table}
                WHERE date_time IS NOT NULL
                ORDER BY date;
            `);

            for (const { date, year, month, day } of periode) {
                const dateObj = moment(date);
                const dayName = dateObj.format('dddd');
                const monthName = dateObj.format('MMMM');

                // Shift 1: 07:10:00 - 19:50:00 (hari yang sama)
                const shift1Start = moment(date).set({ hour: 7, minute: 10, second: 0, millisecond: 0 });
                const shift1End = moment(date).set({ hour: 19, minute: 50, second: 0, millisecond: 0 });

                // Shift 2: 19:50:00 (hari ini) - 07:10:00 (hari esok)
                const shift2Start = moment(date).set({ hour: 19, minute: 50, second: 0, millisecond: 0 });
                const nextDay = moment(date).add(1, 'day');
                const shift2End = nextDay.set({ hour: 7, minute: 10, second: 0, millisecond: 0 });

                // Proses Shift 1 - ambil data dari SUMBER
                const shift1Data = await getShiftData(connectionSource, line.line_table, shift1Start, shift1End);
                if (shift1Data) {
                    await upsertShiftReport(connectionTarget, {
                        ...line,
                        shift: 'shift_1',
                        shift_date: date,
                        shift_start_datetime: shift1Data.startDatetime,
                        shift_end_datetime: shift1Data.endDatetime,
                        start_kwh: shift1Data.startValue,
                        end_kwh: shift1Data.endValue,
                        total_kwh: shift1Data.totalValue,
                        year, month, month_name: monthName, day, day_name: dayName
                    });
                }

                // Proses Shift 2 - ambil data dari SUMBER
                const shift2Data = await getShiftData(connectionSource, line.line_table, shift2Start, shift2End);
                if (shift2Data) {
                    await upsertShiftReport(connectionTarget, {
                        ...line,
                        shift: 'shift_2',
                        shift_date: date, // Catat sebagai tanggal shift, bukan tanggal akhir
                        shift_start_datetime: shift2Data.startDatetime,
                        shift_end_datetime: shift2Data.endDatetime,
                        start_kwh: shift2Data.startValue,
                        end_kwh: shift2Data.endValue,
                        total_kwh: shift2Data.totalValue,
                        year, month, month_name: monthName, day, day_name: dayName
                    });
                }
            }
        }

        console.log("\n🎉 Rekap shiftly selesai. Data telah dipindahkan ke database tujuan.");
        
    } catch (err) {
        console.error("❌ Error:", err);
        
        // Berikan solusi troubleshooting
        if (err.code === 'ECONNREFUSED') {
            console.log("\n🔧 Troubleshooting:");
            console.log("1. Periksa apakah database tujuan sedang online");
            console.log("2. Periksa koneksi jaringan ke 172.27.63.180");
            console.log("3. Pastikan port 3306 tidak diblokir firewall");
            console.log("4. Coba ping 172.27.63.180 dari command prompt");
        }
    } finally {
        // Tutup koneksi database
        if (connectionSource) {
            await connectionSource.end();
            console.log("🔌 Koneksi database sumber ditutup");
        }
        if (connectionTarget) {
            await connectionTarget.end();
            console.log("🔌 Koneksi database tujuan ditutup");
        }
    }
}

rekapShiftly();