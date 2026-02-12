const pool = require("../../config/db_core");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta");

// Daftar tabel sumber
const lineTables = [

    { pm_type: "DA_01", line_table: "tb_kub1_total_kwh", line_name: "kubikal_1" },

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
          SELECT idPrimary FROM tb_pm_monthly_kub_report
          WHERE pm_type = ? AND line_table = ? AND month = ? AND year = ?;
        `, [line.pm_type, line.line_table, month, year]);

        if (cek.length === 0) {
          // INSERT jika belum ada
          await connection.query(`
            INSERT INTO tb_pm_monthly_kub_report (
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
            UPDATE tb_pm_monthly_kub_report
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
