
// const lineTables = [
//     // PM 200
//     // { pm_type: "PM 200", line_table: "tb_pm200_bs1", line_name: "BS1" },
//     // { pm_type: "PM 200", line_table: "tb_pm200_bs2", line_name: "BS2" },
//     // { pm_type: "PM 200", line_table: "tb_pm200_cc1", line_name: "CC1" },
//     // { pm_type: "PM_200V", line_table: "tb_pm200_cc234", line_name: "CC234" },
//     // { pm_type: "PM-200V", line_table: "tb_pm200_chab", line_name: "CHAB" },
//     // { pm_type: "PM-3F", line_table: "tb_pm200_chcd", line_name: "CHCD" },
//     // { pm_type: "PM_200V", line_table: "tb_pm200_chef", line_name: "CHEF" },
//     // { pm_type: "PM_200V", line_table: "tb_pm200_chsaa", line_name: "CHSAA" },
//     // { pm_type: "PM_200V", line_table: "tb_pm200_chsac", line_name: "CHSAC" },
//     // { pm_type: "PM 200", line_table: "tb_pm200_conn", line_name: "CONN" },
//     // { pm_type: "PM 200", line_table: "tb_pm200_cr1", line_name: "CR1" },
//     // { pm_type: "PM 200", line_table: "tb_pm200_cr2", line_name: "CR2" },
//     // { pm_type: "PM 200", line_table: "tb_pm200_cr3", line_name: "CR3" },
//     // { pm_type: "PM 200", line_table: "tb_pm200_cr4", line_name: "CR4" },
//     // { pm_type: "PM 200", line_table: "tb_pm200_cr5", line_name: "CR5" },
//     // { pm_type: "PM 200", line_table: "tb_pm200_cr6", line_name: "CR6" },
//     // { pm_type: "PM 200", line_table: "tb_pm200_cr7", line_name: "CR7" },
//     // { pm_type: "PM 200", line_table: "tb_pm200_cr8", line_name: "CR8" },
//     // { pm_type: "PM 200", line_table: "tb_pm200_cr9", line_name: "CR9" },
//     // { pm_type: "PM 200", line_table: "tb_pm200_cr10", line_name: "CR10" },
//     // { pm_type: "PM 200", line_table: "tb_pm200_cr11", line_name: "CR11" },
//     // { pm_type: "PM 200", line_table: "tb_pm200_cr12", line_name: "CR12" },
//     // // { pm_type: "PM_200V", line_table: "tb_pm200_ct", line_name: "CT" },
//     // { pm_type: "PM_200V", line_table: "tb_pm200_hla", line_name: "HLA" },
//     // { pm_type: "PM 200", line_table: "tb_pm200_ra", line_name: "RA" },
//     // { pm_type: "PM_200V", line_table: "tb_pm200_ret", line_name: "RET" },

//     // // PM 220
//     // { pm_type: "PM 220", line_table: "tb_pm220_bs1", line_name: "BS1" },
//     // { pm_type: "PM 220", line_table: "tb_pm220_bs2", line_name: "BS2" },
//     // { pm_type: "PM 220", line_table: "tb_pm220_cc1", line_name: "CC1" },
//     // { pm_type: "PM_220V", line_table: "tb_pm220_cc234", line_name: "CC234" },
//     // { pm_type: "PM-220V", line_table: "tb_pm220_chab", line_name: "CHAB" },
//     // { pm_type: "PM-1F", line_table: "tb_pm220_chcd", line_name: "CHCD" },
//     // { pm_type: "PM_220V", line_table: "tb_pm220_chef", line_name: "CHEF" },
//     // { pm_type: "PM_220V", line_table: "tb_pm220_chsaa", line_name: "CHSAA" },
//     // { pm_type: "PM_220V", line_table: "tb_pm220_chsac", line_name: "CHSAC" },
//     // { pm_type: "PM 220", line_table: "tb_pm220_conn", line_name: "CONN" },
//     // { pm_type: "PM 220", line_table: "tb_pm220_cr1", line_name: "CR1" },
//     // { pm_type: "PM 220", line_table: "tb_pm220_cr2", line_name: "CR2" },
//     // { pm_type: "PM 220", line_table: "tb_pm220_cr3", line_name: "CR3" },
//     // { pm_type: "PM 220", line_table: "tb_pm220_cr4", line_name: "CR4" },
//     // { pm_type: "PM 220", line_table: "tb_pm220_cr5", line_name: "CR5" },
//     // { pm_type: "PM 220", line_table: "tb_pm220_cr6", line_name: "CR6" },
//     // { pm_type: "PM 220", line_table: "tb_pm220_cr7", line_name: "CR7" },
//     // { pm_type: "PM 220", line_table: "tb_pm220_cr8", line_name: "CR8" },
//     // { pm_type: "PM 220", line_table: "tb_pm220_cr9", line_name: "CR9" },
//     // { pm_type: "PM 220", line_table: "tb_pm220_cr10", line_name: "CR10" },
//     // { pm_type: "PM 220", line_table: "tb_pm220_cr11", line_name: "CR11" },
//     // { pm_type: "PM 220", line_table: "tb_pm220_cr12", line_name: "CR12" },
//     // // { pm_type: "PM_220V", line_table: "tb_pm220_ct", line_name: "CT" },
//     // { pm_type: "PM 220", line_table: "tb_pm220_hla", line_name: "HLA" },
//     // { pm_type: "PM 220", line_table: "tb_pm220_ra", line_name: "RA" },
//     // { pm_type: "PM_220V", line_table: "tb_pm220_ret", line_name: "RET" },
//     // { pm_type: "PM_220V", line_table: "tb_pm200_chsab", line_name: "CHSAB" },
//     // { pm_type: "PM_200V", line_table: "tb_pm220_chsab", line_name: "CHSAB" },

//     // { pm_type: "DA_30", line_table: "tb_kub1_active_power", line_name: "kubikal_1" },
//     { pm_type: "DA_01", line_table: "tb_kub1_total_kwh", line_name: "kubikal_1" },
// ];






const pool = require("../../config/db_core");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta");

const lineTables = [
    { pm_type: "DA_01", line_table: "tb_kub1_total_kwh", line_name: "kubikal_1" },
];

async function fixDataWithPrecision() {
    const connection = await pool.getConnection();
    
    try {
        console.log("🔧 MEMPERBAIKI DATA DENGAN PRESISI PENUH...\n");
        
        // 1. Hapus semua data yang sudah ada untuk tabel ini
        console.log("🧹 Membersihkan data lama yang salah...");
        await connection.query(`
            DELETE FROM tb_pm_daily_report 
            WHERE pm_type = 'DA_01' 
            AND line_table = 'tb_kub1_total_kwh';
        `);
        console.log("✅ Data lama berhasil dihapus\n");
        
        // 2. Query langsung dengan presisi integer 100%
        console.log("📊 Mengambil data dengan akurasi maksimal...");
        const [dataHarian] = await connection.query(`
            SELECT 
                DATE(date_time) as tanggal,
                MIN(date_time) as start_time,
                MAX(date_time) as end_time,
                -- Ambil nilai awal sebagai INTEGER murni
                (SELECT CAST(TRIM(value) AS UNSIGNED INTEGER)
                 FROM tb_kub1_total_kwh t2
                 WHERE DATE(t2.date_time) = DATE(t1.date_time)
                 AND t2.value IS NOT NULL
                 AND t2.value != ''
                 AND t2.value != 'NULL'
                 AND TRIM(t2.value) REGEXP '^[0-9]+$'
                 ORDER BY t2.date_time ASC
                 LIMIT 1) as nilai_awal,
                -- Ambil nilai akhir sebagai INTEGER murni
                (SELECT CAST(TRIM(value) AS UNSIGNED INTEGER)
                 FROM tb_kub1_total_kwh t3
                 WHERE DATE(t3.date_time) = DATE(t1.date_time)
                 AND t3.value IS NOT NULL
                 AND t3.value != ''
                 AND t3.value != 'NULL'
                 AND TRIM(t3.value) REGEXP '^[0-9]+$'
                 ORDER BY t3.date_time DESC
                 LIMIT 1) as nilai_akhir,
                YEAR(date_time) as year,
                MONTH(date_time) as month,
                DAY(date_time) as day
            FROM tb_kub1_total_kwh t1
            WHERE date_time IS NOT NULL
            AND value IS NOT NULL
            AND value != ''
            AND value != 'NULL'
            GROUP BY DATE(date_time)
            HAVING nilai_awal IS NOT NULL 
               AND nilai_akhir IS NOT NULL
               AND nilai_awal <= nilai_akhir
            ORDER BY tanggal;
        `);
        
        console.log(`📅 Ditemukan ${dataHarian.length} hari data valid\n`);
        
        // 3. Insert data dengan presisi integer penuh
        let totalInserted = 0;
        
        for (const row of dataHarian) {
            const tanggalFormatted = moment(row.tanggal).format('YYYY-MM-DD');
            const namaHari = moment(row.tanggal).format('dddd');
            const namaBulan = moment(row.tanggal).format('MMMM');
            
            // Hitung total dengan integer murni
            const totalKonsumsi = row.nilai_akhir - row.nilai_awal;
            
            // Insert dengan nilai integer tepat
            await connection.query(`
                INSERT INTO tb_pm_daily_report (
                    pm_type, line_table, line_name,
                    start_datetime, end_datetime,
                    start_wh, last_wh, total_wh,
                    date, year, month, month_name, day, day_name, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW());
            `, [
                'DA_01',
                'tb_kub1_total_kwh',
                'kubikal_1',
                row.start_time,
                row.end_time,
                row.nilai_awal,     // INTEGER tepat
                row.nilai_akhir,    // INTEGER tepat
                totalKonsumsi,      // INTEGER tepat
                tanggalFormatted,
                row.year,
                row.month,
                namaBulan,
                row.day,
                namaHari
            ]);
            
            totalInserted++;
            
            // Tampilkan progress setiap 100 data
            if (totalInserted % 100 === 0) {
                console.log(`⏳ Diproses: ${totalInserted} data...`);
            }
        }
        
        console.log(`\n✅ ${totalInserted} data berhasil disimpan dengan presisi integer!\n`);
        
        // 4. VERIFIKASI - Ambil 5 data pertama dan terakhir
        console.log("🔍 VERIFIKASI DATA:");
        console.log("=================");
        
        // Data pertama
        const [dataPertama] = await connection.query(`
            SELECT date, start_wh, last_wh, total_wh
            FROM tb_pm_daily_report
            WHERE pm_type = 'DA_01'
            ORDER BY date ASC
            LIMIT 3;
        `);
        
        console.log("\n📊 3 Data Pertama:");
        dataPertama.forEach(row => {
            console.log(`   ${row.date}: ${row.start_wh} → ${row.last_wh} = ${row.total_wh}`);
        });
        
        // Data terakhir
        const [dataTerakhir] = await connection.query(`
            SELECT date, start_wh, last_wh, total_wh
            FROM tb_pm_daily_report
            WHERE pm_type = 'DA_01'
            ORDER BY date DESC
            LIMIT 3;
        `);
        
        console.log("\n📊 3 Data Terakhir:");
        dataTerakhir.forEach(row => {
            console.log(`   ${row.date}: ${row.start_wh} → ${row.last_wh} = ${row.total_wh}`);
        });
        
        // 5. VERIFIKASI INTEGRITAS - Pastikan tidak ada pembulatan
        console.log("\n🔬 VERIFIKASI INTEGRITAS:");
        
        const [verifikasi] = await connection.query(`
            SELECT 
                COUNT(*) as total_data,
                SUM(CASE WHEN total_wh != (last_wh - start_wh) THEN 1 ELSE 0 END) as data_tidak_konsisten,
                MIN(start_wh) as min_start,
                MAX(last_wh) as max_last,
                MIN(total_wh) as min_total,
                MAX(total_wh) as max_total
            FROM tb_pm_daily_report
            WHERE pm_type = 'DA_01';
        `);
        
        const stat = verifikasi[0];
        console.log(`   Total Data: ${stat.total_data}`);
        console.log(`   Data Tidak Konsisten: ${stat.data_tidak_konsisten}`);
        console.log(`   Nilai Start Minimum: ${stat.min_start}`);
        console.log(`   Nilai Last Maksimum: ${stat.max_last}`);
        console.log(`   Total Konsumsi Minimum: ${stat.min_total}`);
        console.log(`   Total Konsumsi Maksimum: ${stat.max_total}`);
        
        if (stat.data_tidak_konsisten === 0) {
            console.log("\n✅ SEMUA DATA KONSISTEN DAN AKURAT!");
        } else {
            console.log(`\n⚠️ Ada ${stat.data_tidak_konsisten} data tidak konsisten!`);
        }
        
        // 6. Contoh perbandingan sebelum dan sesudah
        console.log("\n📈 CONTOH DATA TANGGAL 2024-12-27:");
        
        const [contohData] = await connection.query(`
            -- Data dari sumber asli
            (SELECT 
                'Sumber Asli' as tipe,
                MIN(date_time) as start_time,
                MAX(date_time) as end_time,
                MIN(CAST(TRIM(value) AS UNSIGNED INTEGER)) as start_wh,
                MAX(CAST(TRIM(value) AS UNSIGNED INTEGER)) as last_wh,
                MAX(CAST(TRIM(value) AS UNSIGNED INTEGER)) - MIN(CAST(TRIM(value) AS UNSIGNED INTEGER)) as total_wh
            FROM tb_kub1_total_kwh
            WHERE DATE(date_time) = '2024-12-27'
            AND value IS NOT NULL
            AND value != ''
            AND value != 'NULL')
            
            UNION ALL
            
            -- Data dari report baru
            (SELECT 
                'Report Baru' as tipe,
                start_datetime as start_time,
                end_datetime as end_time,
                start_wh,
                last_wh,
                total_wh
            FROM tb_pm_daily_report
            WHERE pm_type = 'DA_01'
            AND date = '2024-12-27')
        `);
        
        contohData.forEach(row => {
            console.log(`\n   ${row.tipe}:`);
            console.log(`      Start: ${row.start_wh}`);
            console.log(`      Last:  ${row.last_wh}`);
            console.log(`      Total: ${row.total_wh}`);
        });
        
    } catch (err) {
        console.error("❌ Error:", err.message);
        if (err.sql) {
            console.error("SQL Error:", err.sql);
        }
    } finally {
        connection.release();
        console.log("\n🏁 PROSES SELESAI!");
    }
}

// Fungsi untuk memperbaiki data tanpa menghapus (update saja)
async function updateExistingData() {
    const connection = await pool.getConnection();
    
    try {
        console.log("🔄 Memperbarui data yang sudah ada...\n");
        
        // Ambil semua tanggal dari tabel sumber
        const [tanggalList] = await connection.query(`
            SELECT DISTINCT DATE(date_time) as tanggal
            FROM tb_kub1_total_kwh
            WHERE date_time IS NOT NULL
            AND value IS NOT NULL
            AND value != ''
            AND value != 'NULL'
            AND TRIM(value) REGEXP '^[0-9]+$'
            ORDER BY tanggal;
        `);
        
        console.log(`📅 Akan memperbarui ${tanggalList.length} hari data\n`);
        
        for (const { tanggal } of tanggalList) {
            const dateFormatted = moment(tanggal).format('YYYY-MM-DD');
            
            // Ambil data presisi tinggi dari sumber
            const [dataSumber] = await connection.query(`
                SELECT 
                    MIN(date_time) as start_time,
                    MAX(date_time) as end_time,
                    MIN(CAST(TRIM(value) AS UNSIGNED INTEGER)) as start_wh,
                    MAX(CAST(TRIM(value) AS UNSIGNED INTEGER)) as last_wh
                FROM tb_kub1_total_kwh
                WHERE DATE(date_time) = ?
                AND value IS NOT NULL
                AND value != ''
                AND value != 'NULL'
                AND TRIM(value) REGEXP '^[0-9]+$'
            `, [tanggal]);
            
            if (!dataSumber.length || !dataSumber[0].start_wh || !dataSumber[0].last_wh) {
                console.log(`⚠️ Data tidak valid untuk ${dateFormatted}`);
                continue;
            }
            
            const totalWh = dataSumber[0].last_wh - dataSumber[0].start_wh;
            
            // Update atau Insert
            const [existing] = await connection.query(`
                SELECT idPrimary FROM tb_pm_daily_report
                WHERE pm_type = 'DA_01' 
                AND line_table = 'tb_kub1_total_kwh'
                AND date = ?;
            `, [dateFormatted]);
            
            if (existing.length > 0) {
                // Update existing
                await connection.query(`
                    UPDATE tb_pm_daily_report
                    SET start_datetime = ?,
                        end_datetime = ?,
                        start_wh = ?,
                        last_wh = ?,
                        total_wh = ?,
                        created_at = NOW()
                    WHERE idPrimary = ?;
                `, [
                    dataSumber[0].start_time,
                    dataSumber[0].end_time,
                    dataSumber[0].start_wh,
                    dataSumber[0].last_wh,
                    totalWh,
                    existing[0].idPrimary
                ]);
                console.log(`♻️  Diperbarui: ${dateFormatted} = ${totalWh} Wh`);
            } else {
                // Insert baru
                const dayName = moment(tanggal).format('dddd');
                const monthName = moment(tanggal).format('MMMM');
                
                await connection.query(`
                    INSERT INTO tb_pm_daily_report (
                        pm_type, line_table, line_name,
                        start_datetime, end_datetime,
                        start_wh, last_wh, total_wh,
                        date, year, month, month_name, day, day_name, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW());
                `, [
                    'DA_01',
                    'tb_kub1_total_kwh',
                    'kubikal_1',
                    dataSumber[0].start_time,
                    dataSumber[0].end_time,
                    dataSumber[0].start_wh,
                    dataSumber[0].last_wh,
                    totalWh,
                    dateFormatted,
                    moment(tanggal).year(),
                    moment(tanggal).month() + 1,
                    monthName,
                    moment(tanggal).date(),
                    dayName,
                ]);
                console.log(`✅ Ditambahkan: ${dateFormatted} = ${totalWh} Wh`);
            }
        }
        
        console.log("\n✅ Update data selesai!");
        
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        connection.release();
    }
}

// Jalankan salah satu:
// fixDataWithPrecision();  // Untuk build ulang semua data dari nol
updateExistingData();       // Untuk update data yang sudah ada