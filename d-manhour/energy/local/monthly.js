const pool = require("../../config/db_core");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta");

// Daftar tabel sumber
const lineTables = [

    // PM 200
    { pm_type: "PM 200", line_table: "tb_pm200_bs1", line_name: "BS1" },
    { pm_type: "PM 200", line_table: "tb_pm200_bs2", line_name: "BS2" },
    { pm_type: "PM 200", line_table: "tb_pm200_cc1", line_name: "CC1" },
    { pm_type: "PM_200V", line_table: "tb_pm200_cc234", line_name: "CC234" },
    { pm_type: "PM-200V", line_table: "tb_pm200_chab", line_name: "CHAB" },
    { pm_type: "PM-3F", line_table: "tb_pm200_chcd", line_name: "CHCD" },
    { pm_type: "PM_200V", line_table: "tb_pm200_chef", line_name: "CHEF" },
    { pm_type: "PM_200V", line_table: "tb_pm200_chsaa", line_name: "CHSAA" },
    { pm_type: "PM_200V", line_table: "tb_pm200_chsac", line_name: "CHSAC" },
    { pm_type: "PM 200", line_table: "tb_pm200_conn", line_name: "CONN" },
    { pm_type: "PM 200", line_table: "tb_pm200_cr1", line_name: "CR1" },
    { pm_type: "PM 200", line_table: "tb_pm200_cr2", line_name: "CR2" },
    { pm_type: "PM 200", line_table: "tb_pm200_cr3", line_name: "CR3" },
    { pm_type: "PM 200", line_table: "tb_pm200_cr4", line_name: "CR4" },
    { pm_type: "PM 200", line_table: "tb_pm200_cr5", line_name: "CR5" },
    { pm_type: "PM 200", line_table: "tb_pm200_cr6", line_name: "CR6" },
    { pm_type: "PM 200", line_table: "tb_pm200_cr7", line_name: "CR7" },
    { pm_type: "PM 200", line_table: "tb_pm200_cr8", line_name: "CR8" },
    { pm_type: "PM 200", line_table: "tb_pm200_cr9", line_name: "CR9" },
    { pm_type: "PM 200", line_table: "tb_pm200_cr10", line_name: "CR10" },
    { pm_type: "PM 200", line_table: "tb_pm200_cr11", line_name: "CR11" },
    { pm_type: "PM 200", line_table: "tb_pm200_cr12", line_name: "CR12" },
    // { pm_type: "PM_200V", line_table: "tb_pm200_ct", line_name: "CT" },
    { pm_type: "PM_200V", line_table: "tb_pm200_hla", line_name: "HLA" },
    { pm_type: "PM 200", line_table: "tb_pm200_ra", line_name: "RA" },
    { pm_type: "PM_200V", line_table: "tb_pm200_ret", line_name: "RET" },
    // { pm_type: "PM_200_2", line_table: "tb_pm200_weng", line_name: "WENG" },
    // { pm_type: "PM_200_1", line_table: "tb_pm200_weng", line_name: "WENG" },


    // PM 220
    { pm_type: "PM 220", line_table: "tb_pm220_bs1", line_name: "BS1" },
    { pm_type: "PM 220", line_table: "tb_pm220_bs2", line_name: "BS2" },
    { pm_type: "PM 220", line_table: "tb_pm220_cc1", line_name: "CC1" },
    { pm_type: "PM_220V", line_table: "tb_pm220_cc234", line_name: "CC234" },
    { pm_type: "PM-220V", line_table: "tb_pm220_chab", line_name: "CHAB" },
    { pm_type: "PM-1F", line_table: "tb_pm220_chcd", line_name: "CHCD" },
    { pm_type: "PM_220V", line_table: "tb_pm220_chef", line_name: "CHEF" },
    { pm_type: "PM_220V", line_table: "tb_pm220_chsaa", line_name: "CHSAA" },
    { pm_type: "PM_220V", line_table: "tb_pm220_chsac", line_name: "CHSAC" },
    { pm_type: "PM 220", line_table: "tb_pm220_conn", line_name: "CONN" },
    { pm_type: "PM 220", line_table: "tb_pm220_cr1", line_name: "CR1" },
    { pm_type: "PM 220", line_table: "tb_pm220_cr2", line_name: "CR2" },
    { pm_type: "PM 220", line_table: "tb_pm220_cr3", line_name: "CR3" },
    { pm_type: "PM 220", line_table: "tb_pm220_cr4", line_name: "CR4" },
    { pm_type: "PM 220", line_table: "tb_pm220_cr5", line_name: "CR5" },
    { pm_type: "PM 220", line_table: "tb_pm220_cr6", line_name: "CR6" },
    { pm_type: "PM 220", line_table: "tb_pm220_cr7", line_name: "CR7" },
    { pm_type: "PM 220", line_table: "tb_pm220_cr8", line_name: "CR8" },
    { pm_type: "PM 220", line_table: "tb_pm220_cr9", line_name: "CR9" },
    { pm_type: "PM 220", line_table: "tb_pm220_cr10", line_name: "CR10" },
    { pm_type: "PM 220", line_table: "tb_pm220_cr11", line_name: "CR11" },
    { pm_type: "PM 220", line_table: "tb_pm220_cr12", line_name: "CR12" },
    // { pm_type: "PM_220V", line_table: "tb_pm220_ct", line_name: "CT" },
    { pm_type: "PM 220", line_table: "tb_pm220_hla", line_name: "HLA" },
    // { pm_type: "PM 220", line_table: "tb_pm220_lpf3", line_name: "LPF3" },
    { pm_type: "PM 220", line_table: "tb_pm220_ra", line_name: "RA" },
    { pm_type: "PM_220V", line_table: "tb_pm220_ret", line_name: "RET" },
    { pm_type: "PM_220V", line_table: "tb_pm200_chsab", line_name: "CHSAB" },
    { pm_type: "PM_200V", line_table: "tb_pm220_chsab", line_name: "CHSAB" },

    // { pm_type: "DA_30", line_table: "tb_kub1_active_power", line_name: "kubikal_1" },
    // { pm_type: "DA_01", line_table: "tb_kub1_total_kwh", line_name: "kubikal_1" },


    

];



async function rekapBulanan() {
  const connection = await pool.getConnection();
  try {
    for (const line of lineTables) {
      console.log(`\n🔍 Proses: ${line.line_table}`);

      // Ambil semua kombinasi bulan dan tahun dari tabel sumber
      const [periode] = await connection.query(`
        SELECT DISTINCT month, year
        FROM ${line.line_table}
        WHERE month IS NOT NULL AND year IS NOT NULL
        ORDER BY year, FIELD(month,
          'January','February','March','April','May','June',
          'July','August','September','October','November','December'
        );
      `);

      for (const { month, year } of periode) {
        // Ambil nilai awal dan akhir bulan
        const [awal] = await connection.query(`
          SELECT date_time, value
          FROM ${line.line_table}
          WHERE month = ? AND year = ?
          ORDER BY date_time ASC
          LIMIT 1;
        `, [month, year]);

        const [akhir] = await connection.query(`
          SELECT date_time, value
          FROM ${line.line_table}
          WHERE month = ? AND year = ?
          ORDER BY date_time DESC
          LIMIT 1;
        `, [month, year]);

        if (!awal.length || !akhir.length) continue;

        const startDatetime = awal[0].date_time;
        const endDatetime = akhir[0].date_time;
        const startWh = parseFloat(awal[0].value);
        const lastWh = parseFloat(akhir[0].value);
        const totalWh = lastWh - startWh;

        // Cek apakah data sudah ada di tb_tujuan
        const [cek] = await connection.query(`
          SELECT idPrimary FROM tb_pm_monthly_report
          WHERE pm_type = ? AND line_table = ? AND month = ? AND year = ?;
        `, [line.pm_type, line.line_table, month, year]);

        if (cek.length === 0) {
          // INSERT jika belum ada
          await connection.query(`
            INSERT INTO tb_pm_monthly_report (
              pm_type, line_table, line_name,
              start_datetime, end_datetime,
              start_wh, last_wh, total_wh,
              month, year, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW());
          `, [
            line.pm_type,
            line.line_table,
            line.line_name,
            startDatetime,
            endDatetime,
            startWh,
            lastWh,
            totalWh,
            month,
            year,
          ]);
          console.log(`✅ Insert: ${month} ${year} (${totalWh} Wh)`);
        } else {
          // UPDATE jika sudah ada (agar tetap terbaru)
          await connection.query(`
            UPDATE tb_pm_monthly_report
            SET start_datetime = ?, end_datetime = ?, 
                start_wh = ?, last_wh = ?, total_wh = ?, 
                created_at = NOW()
            WHERE idPrimary = ?;
          `, [
            startDatetime,
            endDatetime,
            startWh,
            lastWh,
            totalWh,
            cek[0].idPrimary,
          ]);
          console.log(`♻️ Update: ${month} ${year} (${totalWh} Wh)`);
        }
      }
    }

    console.log("\n🎉 Rekap bulanan selesai tanpa duplikasi.");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    connection.release();
  }
}

rekapBulanan();
