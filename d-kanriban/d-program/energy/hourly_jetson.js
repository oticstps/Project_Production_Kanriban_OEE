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
    // PM 200
    // { pm_type: "PM 200", line_table: "tb_pm200_bs1", line_name: "BS1" },
    // { pm_type: "PM 200", line_table: "tb_pm200_bs2", line_name: "BS2" },
    // { pm_type: "PM 200", line_table: "tb_pm200_cc1", line_name: "CC1" },
    // { pm_type: "PM_200V", line_table: "tb_pm200_cc234", line_name: "CC234" },
    // { pm_type: "PM-200V", line_table: "tb_pm200_chab", line_name: "CHAB" },
    // { pm_type: "PM-3F", line_table: "tb_pm200_chcd", line_name: "CHCD" },
    // { pm_type: "PM_200V", line_table: "tb_pm200_chef", line_name: "CHEF" },
    // { pm_type: "PM_200V", line_table: "tb_pm200_chsaa", line_name: "CHSAA" },
    // { pm_type: "PM_200V", line_table: "tb_pm200_chsac", line_name: "CHSAC" },
    // { pm_type: "PM 200", line_table: "tb_pm200_conn", line_name: "CONN" },
    // { pm_type: "PM 200", line_table: "tb_pm200_cr1", line_name: "CR1" },
    // { pm_type: "PM 200", line_table: "tb_pm200_cr2", line_name: "CR2" },
    // { pm_type: "PM 200", line_table: "tb_pm200_cr3", line_name: "CR3" },
    // { pm_type: "PM 200", line_table: "tb_pm200_cr4", line_name: "CR4" },
    // { pm_type: "PM 200", line_table: "tb_pm200_cr5", line_name: "CR5" },
    // { pm_type: "PM 200", line_table: "tb_pm200_cr6", line_name: "CR6" },
    // { pm_type: "PM 200", line_table: "tb_pm200_cr7", line_name: "CR7" },
    // { pm_type: "PM 200", line_table: "tb_pm200_cr8", line_name: "CR8" },
    // { pm_type: "PM 200", line_table: "tb_pm200_cr9", line_name: "CR9" },
    // { pm_type: "PM 200", line_table: "tb_pm200_cr10", line_name: "CR10" },
    // { pm_type: "PM 200", line_table: "tb_pm200_cr11", line_name: "CR11" },
    // { pm_type: "PM 200", line_table: "tb_pm200_cr12", line_name: "CR12" },
    // { pm_type: "PM_200V", line_table: "tb_pm200_ct", line_name: "CT" },
    // { pm_type: "PM_200V", line_table: "tb_pm200_hla", line_name: "HLA" },
    // { pm_type: "PM 200", line_table: "tb_pm200_ra", line_name: "RA" },
    // { pm_type: "PM_200V", line_table: "tb_pm200_ret", line_name: "RET" },

    // // PM 220
    // { pm_type: "PM 220", line_table: "tb_pm220_bs1", line_name: "BS1" },
    // { pm_type: "PM 220", line_table: "tb_pm220_bs2", line_name: "BS2" },
    // { pm_type: "PM 220", line_table: "tb_pm220_cc1", line_name: "CC1" },
    // { pm_type: "PM_220V", line_table: "tb_pm220_cc234", line_name: "CC234" },
    // { pm_type: "PM-220V", line_table: "tb_pm220_chab", line_name: "CHAB" },
    // { pm_type: "PM-1F", line_table: "tb_pm220_chcd", line_name: "CHCD" },
    // { pm_type: "PM_220V", line_table: "tb_pm220_chef", line_name: "CHEF" },
    // { pm_type: "PM_220V", line_table: "tb_pm220_chsaa", line_name: "CHSAA" },
    // { pm_type: "PM_220V", line_table: "tb_pm220_chsac", line_name: "CHSAC" },
    // { pm_type: "PM 220", line_table: "tb_pm220_conn", line_name: "CONN" },
    // { pm_type: "PM 220", line_table: "tb_pm220_cr1", line_name: "CR1" },
    // { pm_type: "PM 220", line_table: "tb_pm220_cr2", line_name: "CR2" },
    // { pm_type: "PM 220", line_table: "tb_pm220_cr3", line_name: "CR3" },
    // { pm_type: "PM 220", line_table: "tb_pm220_cr4", line_name: "CR4" },
    // { pm_type: "PM 220", line_table: "tb_pm220_cr5", line_name: "CR5" },
    // { pm_type: "PM 220", line_table: "tb_pm220_cr6", line_name: "CR6" },
    // { pm_type: "PM 220", line_table: "tb_pm220_cr7", line_name: "CR7" },
    // { pm_type: "PM 220", line_table: "tb_pm220_cr8", line_name: "CR8" },
    // { pm_type: "PM 220", line_table: "tb_pm220_cr9", line_name: "CR9" },
    // { pm_type: "PM 220", line_table: "tb_pm220_cr10", line_name: "CR10" },
    // { pm_type: "PM 220", line_table: "tb_pm220_cr11", line_name: "CR11" },
    // { pm_type: "PM 220", line_table: "tb_pm220_cr12", line_name: "CR12" },
    // { pm_type: "PM_220V", line_table: "tb_pm220_ct", line_name: "CT" },
    // { pm_type: "PM 220", line_table: "tb_pm220_hla", line_name: "HLA" },
    // { pm_type: "PM 220", line_table: "tb_pm220_ra", line_name: "RA" },
    // { pm_type: "PM_220V", line_table: "tb_pm220_ret", line_name: "RET" },
    // { pm_type: "PM_220V", line_table: "tb_pm200_chsab", line_name: "CHSAB" },
    // { pm_type: "PM_200V", line_table: "tb_pm220_chsab", line_name: "CHSAB" },
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

// Fungsi untuk INSERT atau UPDATE data hourly
async function upsertHourlyReport(connectionTarget, data) {
    const [cek] = await connectionTarget.query(`
        SELECT idPrimary FROM tb_pm_hourly_report
        WHERE pm_type = ? AND line_table = ? AND hour_start_datetime = ?;
    `, [data.pm_type, data.line_table, data.hour_start_datetime]);

    if (cek.length === 0) {
        // INSERT
        await connectionTarget.query(`
            INSERT INTO tb_pm_hourly_report (
                pm_type, line_table, line_name,
                hour_start_datetime, hour_end_datetime,
                start_kwh, end_kwh, total_kwh,
                date, year, month, month_name, day, day_name, hour_of_day, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW());
        `, [
            data.pm_type, data.line_table, data.line_name,
            data.hour_start_datetime, data.hour_end_datetime,
            data.start_kwh, data.end_kwh, data.total_kwh,
            data.date, data.year, data.month, data.month_name, data.day, data.day_name, data.hour_of_day
        ]);
        console.log(`✅ Insert Hourly: ${data.hour_start_datetime} (${data.total_kwh} KWH)`);
    } else {
        // UPDATE
        await connectionTarget.query(`
            UPDATE tb_pm_hourly_report
            SET hour_end_datetime = ?, 
                start_kwh = ?, end_kwh = ?, total_kwh = ?, 
                month_name = ?, day_name = ?, updated_at = NOW()
            WHERE idPrimary = ?;
        `, [
            data.hour_end_datetime,
            data.start_kwh, data.end_kwh, data.total_kwh,
            data.month_name, data.day_name,
            cek[0].idPrimary
        ]);
        console.log(`♻️ Update Hourly: ${data.hour_start_datetime} (${data.total_kwh} KWH)`);
    }
}

async function rekapHourly() {
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
            console.log(`\n🔍 Proses hourly: ${line.line_table}`);

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

                // Loop untuk setiap jam dalam sehari (00:00 - 23:00)
                for (let hour = 0; hour < 24; hour++) {
                    const hourStart = moment(date).hour(hour).minute(0).second(0).millisecond(0);
                    const hourEnd = moment(date).hour(hour).minute(59).second(59).millisecond(999);

                    // Ambil data awal dan akhir untuk jam ini dari database SUMBER
                    const [startRow] = await connectionSource.query(`
                        SELECT date_time, value
                        FROM ${line.line_table}
                        WHERE date_time >= ? AND date_time <= ?
                        ORDER BY date_time ASC
                        LIMIT 1;
                    `, [hourStart.format('YYYY-MM-DD HH:mm:ss'), hourEnd.format('YYYY-MM-DD HH:mm:ss')]);

                    const [endRow] = await connectionSource.query(`
                        SELECT date_time, value
                        FROM ${line.line_table}
                        WHERE date_time >= ? AND date_time <= ?
                        ORDER BY date_time DESC
                        LIMIT 1;
                    `, [hourStart.format('YYYY-MM-DD HH:mm:ss'), hourEnd.format('YYYY-MM-DD HH:mm:ss')]);

                    if (startRow.length > 0 && endRow.length > 0) {
                        const startDatetime = startRow[0].date_time;
                        const endDatetime = endRow[0].date_time;
                        const startKwh = parseFloat(startRow[0].value);
                        const endKwh = parseFloat(endRow[0].value);
                        const totalKwh = endKwh - startKwh;

                        await upsertHourlyReport(connectionTarget, {
                            ...line,
                            hour_start_datetime: hourStart.format('YYYY-MM-DD HH:mm:ss'),
                            hour_end_datetime: hourEnd.format('YYYY-MM-DD HH:mm:ss'),
                            start_kwh: startKwh,
                            end_kwh: endKwh,
                            total_kwh: totalKwh,
                            date: date,
                            year, month, month_name: monthName, day, day_name: dayName,
                            hour_of_day: hour
                        });
                    } else {
                        // Jika tidak ada data dalam jam ini, bisa dilewati atau diisi nilai 0
                        console.log(`⚠️  Tidak ada data untuk ${line.line_table} pada jam ${hour}:00 - ${hour}:59`);
                    }
                }
            }
        }

        console.log("\n🎉 Rekap hourly selesai. Data telah dipindahkan ke database tujuan.");
        
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

rekapHourly();