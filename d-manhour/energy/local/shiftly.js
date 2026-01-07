const pool = require("../../config/db_core");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Jakarta");

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
    { pm_type: "PM 220", line_table: "tb_pm220_ra", line_name: "RA" },
    { pm_type: "PM_220V", line_table: "tb_pm220_ret", line_name: "RET" },
    { pm_type: "PM_220V", line_table: "tb_pm200_chsab", line_name: "CHSAB" },
    { pm_type: "PM_200V", line_table: "tb_pm220_chsab", line_name: "CHSAB" },
    { pm_type: "DA_01", line_table: "tb_kub1_total_kwh", line_name: "kubikal_1" },
];


async function rekapShiftly() {
  const connection = await pool.getConnection();
  try {
    for (const line of lineTables) {
      console.log(`\n🔍 Proses shiftly: ${line.line_table}`);

      // Ambil semua kombinasi tanggal unik dari tabel sumber
      const [periode] = await connection.query(`
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

        // Proses Shift 1
        const shift1Data = await getShiftData(connection, line.line_table, shift1Start, shift1End);
        if (shift1Data) {
            await upsertShiftReport(connection, {
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

        // Proses Shift 2
        const shift2Data = await getShiftData(connection, line.line_table, shift2Start, shift2End);
        if (shift2Data) {
            await upsertShiftReport(connection, {
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

    console.log("\n🎉 Rekap shiftly selesai.");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    connection.release();
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
async function upsertShiftReport(connection, data) {
    const [cek] = await connection.query(`
        SELECT idPrimary FROM tb_pm_shiftly_report
        WHERE pm_type = ? AND line_table = ? AND shift_date = ? AND shift = ?;
    `, [data.pm_type, data.line_table, data.shift_date, data.shift]);

    if (cek.length === 0) {
        // INSERT
        await connection.query(`
            INSERT INTO tb_pm_shiftly_report (
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
        await connection.query(`
            UPDATE tb_pm_shiftly_report
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

rekapShiftly();

