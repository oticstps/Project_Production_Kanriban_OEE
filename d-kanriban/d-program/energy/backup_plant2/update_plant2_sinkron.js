const mysql = require('mysql2/promise');

// === Konfigurasi Database ===
const dbConfig = {
    host: "169.254.33.24",
    user: "otics_tps",
    password: "sukatno_ali",
    database: "database_tps_plant_2",
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000
};

// Buat pool untuk koneksi database
const db = mysql.createPool(dbConfig);

// === Shift Plant 2 ===
const shifts = [
  { name: "Shift 1", start: "07:10:00", end: "19:50:00" },
  { name: "Shift 2", start: "19:50:00", end: "07:10:00" }, // melewati tengah malam
];

async function generateShiftReport() {
  try {
    // Ambil semua data
    const [rows] = await db.execute(`
      SELECT id, col1, power_meter, wh, col4, col5, created_at
      FROM tb_kub_plant2
      ORDER BY created_at ASC
    `);

    if (rows.length === 0) return console.log("Tidak ada data.");

    const today = new Date();
    const shiftDate = today.toISOString().split("T")[0];

    for (const shift of shifts) {
      let shiftStart = new Date(`${shiftDate} ${shift.start}`);
      let shiftEnd = new Date(`${shiftDate} ${shift.end}`);

      // Jika shift melewati tengah malam (Shift 2)
      if (shift.end < shift.start) {
        shiftEnd.setDate(shiftEnd.getDate() + 1);
      }

      // Filter data pada shift ini
      const shiftData = rows.filter(row => {
        const t = new Date(row.created_at);
        return t >= shiftStart && t <= shiftEnd;
      });

      if (shiftData.length === 0) {
        console.log(`${shift.name} tidak ada data.`);
        continue;
      }

      // Hitung nilai KWH
      const startKwh = parseFloat(shiftData[0].wh || 0);
      const endKwh = parseFloat(shiftData[shiftData.length - 1].wh || 0);
      const totalKwh = endKwh - startKwh;

      const month = today.getMonth() + 1;
      const year = today.getFullYear();
      const day = today.getDate();
      const monthName = today.toLocaleString("en-US", { month: "long" });
      const dayName = today.toLocaleString("en-US", { weekday: "long" });

      // Insert ke tabel report
      await db.execute(
        `
        INSERT INTO tb_pm_shiftly_kub_plant_2_report
        (
          pm_type,
          line_table,
          line_name,
          shift,
          shift_date,
          shift_start_datetime,
          shift_end_datetime,
          start_kwh,
          end_kwh,
          total_kwh,
          year,
          month,
          month_name,
          day,
          day_name
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          "KUB_PLANT2",
          "tb_kub_plant2",
          shiftData[0].power_meter,
          shift.name,
          shiftDate,
          shiftStart,
          shiftEnd,
          startKwh,
          endKwh,
          totalKwh,
          year,
          month,
          monthName,
          day,
          dayName
        ]
      );

      console.log(`${shift.name} berhasil diproses.`);
    }

    console.log("Selesai generate report.");
  } catch (err) {
    console.error("Error:", err);
  }
}

generateShiftReport();
