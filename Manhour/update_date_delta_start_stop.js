const pool = require('./config/db');

const MIN_ACTUAL_PCS = 100; // ✅ Threshold PCS

// --- Konfigurasi Hari Libur ---
// Daftar tanggal libur dalam format YYYY-MM-DD
// Harap diperbarui sesuai kebutuhan perusahaan atau kalender nasional
const HOLIDAYS = new Set([
  // Contoh: '2025-01-01', // Tahun Baru
  // '2025-05-01', // Hari Buruh
  // Tambahkan tanggal libur lainnya sesuai kebutuhan
]);

// Helper: konversi hari ke Bahasa Indonesia
function getDayName(date) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[date.getDay()];
}

// Helper: Membuat objek Date untuk waktu tertentu pada tanggal tertentu (dalam WIB)
function createTimeForDate(baseDate, hour, minute, second = 0) {
    const date = new Date(baseDate);
    date.setHours(hour, minute, second, 0);
    return date;
}

// Helper: Periksa apakah suatu tanggal adalah hari libur
function isHoliday(date) {
  const dateStr = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
  return HOLIDAYS.has(dateStr);
}

// Fungsi untuk mendapatkan JADWAL ISTIRAHAT harian untuk satu tanggal
// Input: Tanggal (tanpa waktu) - merepresentasikan hari dimulainya shift 1 dan shift 2
// Output: Array objek { start: Date, end: Date } untuk semua istirahat yang terjadi
// selama shift 1 dan shift 2 yang dimulai pada tanggal tersebut.
// Jika tanggal adalah hari libur, kembalikan array kosong.
function getDailyBreakSchedulesForDate(dateInput) {
  // Jika tanggal adalah hari libur, tidak ada jadwal istirahat harian
  if (isHoliday(dateInput)) {
    return [];
  }

  const dayName = getDayName(dateInput);
  const isFriday = dayName === 'Jumat';
  const schedules = [];

  // Jadwal Istirahat Shift 1 (terjadi pada hari yang sama dengan dateInput)
  if (isFriday) {
    schedules.push(
      { start: createTimeForDate(dateInput, 9, 20), end: createTimeForDate(dateInput, 9, 30) }, // 09:20 - 09:30
      { start: createTimeForDate(dateInput, 11, 40), end: createTimeForDate(dateInput, 12, 50) }, // 11:40 - 12:50
      { start: createTimeForDate(dateInput, 14, 50), end: createTimeForDate(dateInput, 15, 0) },  // 14:50 - 15:00
      { start: createTimeForDate(dateInput, 16, 30), end: createTimeForDate(dateInput, 16, 40) }  // 16:30 - 16:40
    );
    // Overtime 1 & Istirahat OT 2 (Jika terjadi setelah 16:30)
    schedules.push(
      { start: createTimeForDate(dateInput, 16, 40), end: createTimeForDate(dateInput, 17, 0) }, // 16:40 - 17:00
      { start: createTimeForDate(dateInput, 18, 0), end: createTimeForDate(dateInput, 18, 30) }  // 18:00 - 18:30
    );
  } else {
    schedules.push(
      { start: createTimeForDate(dateInput, 9, 20), end: createTimeForDate(dateInput, 9, 30) }, // 09:20 - 09:30
      { start: createTimeForDate(dateInput, 12, 0), end: createTimeForDate(dateInput, 12, 40) }, // 12:00 - 12:40
      { start: createTimeForDate(dateInput, 14, 20), end: createTimeForDate(dateInput, 14, 30) }, // 14:20 - 14:30
      { start: createTimeForDate(dateInput, 16, 0), end: createTimeForDate(dateInput, 16, 10) }  // 16:00 - 16:10
    );
    // Istirahat OT 1 & Istirahat OT 2 (Jika terjadi setelah 16:00)
    schedules.push(
      { start: createTimeForDate(dateInput, 16, 10), end: createTimeForDate(dateInput, 16, 30) }, // 16:10 - 16:30
      { start: createTimeForDate(dateInput, 18, 30), end: createTimeForDate(dateInput, 19, 0) }  // 18:30 - 19:00
    );
  }

  // Jadwal Istirahat Shift 2 (dimulai pada dateInput, bisa melewati tengah malam)
  // 19:50 - 21:50 -> Jadwal Kerja
  // 21:50 - 22:00
  schedules.push({ start: createTimeForDate(dateInput, 21, 50), end: createTimeForDate(dateInput, 22, 0) });
  // 22:00 - 00:00 -> Jadwal Kerja (pada hari dateInput)
  // 00:00 - 00:10 (ini tanggal berikutnya, tetapi jadwalnya terjadi setelah tengah malam dateInput)
  schedules.push({ start: createTimeForDate(dateInput, 0, 0), end: createTimeForDate(dateInput, 0, 10) });
  // 00:10 - 02:10 -> Jadwal Kerja (pada hari dateInput, meskipun waktunya < 24:00)
  // 02:10 - 02:50
  schedules.push({ start: createTimeForDate(dateInput, 2, 10), end: createTimeForDate(dateInput, 2, 50) });
  // 02:50 - 04:40 -> Jadwal Kerja (pada hari dateInput, meskipun waktunya < 24:00)
  // 04:40 - 04:50
  schedules.push({ start: createTimeForDate(dateInput, 4, 40), end: createTimeForDate(dateInput, 4, 50) });
  // 04:50 - 05:10 (Subuh / OT1 besoknya - ini terjadi pada hari berikutnya, bagian dari shift malam dateInput)
  const nextDay = new Date(dateInput);
  nextDay.setDate(dateInput.getDate() + 1);
  schedules.push({ start: createTimeForDate(nextDay, 4, 50), end: createTimeForDate(nextDay, 5, 10) });

  return schedules;
}

// Fungsi untuk mendapatkan JADWAL ISTIRAHAT untuk rentang tanggal tertentu
// Input: Tanggal mulai dan selesai (tanpa waktu)
// Output: Array semua jadwal istirahat dari tanggal mulai hingga selesai
// (mengakomodasi shift malam yang melewati tengah malam)
function getBreakSchedulesForDateRange(startDate, endDate) {
  const allSchedules = [];
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0); // Reset ke awal hari
  const endLoopDate = new Date(endDate);
  endLoopDate.setHours(0, 0, 0, 0); // Reset ke awal hari

  while (currentDate <= endLoopDate) {
    // Ambil jadwal istirahat untuk shift 1 dan shift 2 yang *dimulai* pada currentDate
    const dailySchedules = getDailyBreakSchedulesForDate(currentDate);
    allSchedules.push(...dailySchedules);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return allSchedules;
}

// Fungsi untuk menghitung total waktu istirahat dalam rentang waktu tertentu
// Input: startTime (Date), stopTime (Date)
// Output: Total waktu istirahat dalam detik
function calculateBreakTime(startTime, stopTime) {
  if (startTime >= stopTime) return 0;

  // Ambil tanggal awal dan akhir
  const startDay = new Date(startTime);
  startDay.setHours(0, 0, 0, 0);
  const endDay = new Date(stopTime);
  endDay.setHours(0, 0, 0, 0);

  // Dapatkan semua jadwal istirahat dalam rentang tanggal ini
  // Ini akan mencakup jadwal shift malam yang dimulai pada tanggal di rentang
  // dan bisa berlanjut ke tanggal berikutnya.
  const allSchedules = getBreakSchedulesForDateRange(startDay, endDay);

  let totalBreakSeconds = 0;
  for (const { start, end } of allSchedules) {
    // Hitung overlap antara jadwal istirahat dan rentang [startTime, stopTime]
    const overlapStart = new Date(Math.max(start.getTime(), startTime.getTime()));
    const overlapEnd = new Date(Math.min(end.getTime(), stopTime.getTime()));

    if (overlapStart < overlapEnd) {
      // Ada overlap, tambahkan durasinya
      totalBreakSeconds += (overlapEnd - overlapStart) / 1000;
    }
  }
  return totalBreakSeconds;
}

// 🔁 Fungsi untuk satu line
async function processOneLine(sourceTable, targetTable) {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log(`\n🚀 Mulai sinkronisasi data dari ${sourceTable} ...`);

    // Langkah 1: Cari created_at terbaru yang sudah diproses di tabel target
    const [maxCreatedResult] = await connection.query(`
      SELECT MAX(created_at) as latest_processed_created_at FROM ${targetTable}
    `);
    const latestProcessedCreatedAt = maxCreatedResult[0].latest_processed_created_at;
    console.log(`🔍 Tabel ${targetTable}: Waktu terakhir diproses adalah ${latestProcessedCreatedAt || 'NULL'}`);

    // Langkah 2: Ambil data baru dari tabel sumber berdasarkan waktu terakhir diproses
    let sourceQuery = `SELECT * FROM ${sourceTable} WHERE status IN ('START', 'STOP')`;
    let sourceParams = [];

    if (latestProcessedCreatedAt) {
      // Jika ada data sebelumnya, ambil data yang lebih baru dari itu
      sourceQuery += ` AND created_at > ?`;
      sourceParams.push(latestProcessedCreatedAt);
    }
    sourceQuery += ` ORDER BY created_at ASC`;

    const [rows] = await connection.query(sourceQuery, sourceParams);

    if (rows.length === 0) {
        console.log(`✅ Tidak ada data baru di ${sourceTable} sejak ${latestProcessedCreatedAt || 'awal'}.`);
        return; // Tidak ada data baru untuk diproses
    }

    console.log(`📊 Ditemukan ${rows.length} record baru di ${sourceTable} untuk diproses.`);

    // Langkah 3: Proses data baru seperti sebelumnya
    let startRecord = null;
    const recordsToInsert = [];

    for (const row of rows) {
      if (row.status === 'START') {
        startRecord = row;
      } else if (row.status === 'STOP' && startRecord) {
        const actualStart = parseInt(startRecord.actual) || 0;
        const actualStop = parseInt(row.actual) || 0;
        const produced = actualStop - actualStart;

        if (produced >= MIN_ACTUAL_PCS) {
          const startTime = new Date(startRecord.created_at);
          const stopTime = new Date(row.created_at);

          const totalDurationSeconds = Math.floor((stopTime - startTime) / 1000);
          const totalBreakSeconds = calculateBreakTime(startTime, stopTime);
          const netDurationSeconds = Math.max(0, totalDurationSeconds - totalBreakSeconds); // Pastikan tidak negatif

          const totalDurationMinutes = (totalDurationSeconds / 60).toFixed(2);
          const totalBreakMinutes = (totalBreakSeconds / 60).toFixed(2);
          const netDurationMinutes = (netDurationSeconds / 60).toFixed(2);

          // Format delta_time: durasi bruto (sebelum pengurangan istirahat)
          const deltaTextBruto = `${produced} pcs dalam ${totalDurationMinutes} menit`;

          // Format loading_time_server: durasi net (setelah pengurangan istirahat)
          const loadingTimeText = `${netDurationMinutes} menit`;

          // Proses record START
          const startTimeObj = new Date(startRecord.created_at);
          const yearStart = startTimeObj.getFullYear();
          const monthStart = startTimeObj.getMonth() + 1;
          const dayNameStart = getDayName(startTimeObj);
          const shiftStart = startTimeObj.getHours() >= 7 && startTimeObj.getHours() < 19 ? 'Shift 1' : 'Shift 2';
          const timeOnlyStart = startTimeObj.toTimeString().split(' ')[0];

          recordsToInsert.push({
            ...startRecord,
            year: yearStart,
            month: monthStart,
            day: dayNameStart,
            shift: shiftStart,
            time_only: timeOnlyStart,
            delta_time: deltaTextBruto, // Gunakan delta_text bruto
            loading_time_server: loadingTimeText, // Gunakan loading_time_text net
            total_break: parseFloat(totalBreakMinutes), // Total durasi istirahat dalam siklus (menit)
          });

          // Proses record STOP
          const stopTimeObj = new Date(row.created_at);
          const yearStop = stopTimeObj.getFullYear();
          const monthStop = stopTimeObj.getMonth() + 1;
          const dayNameStop = getDayName(stopTimeObj);
          const shiftStop = stopTimeObj.getHours() >= 7 && stopTimeObj.getHours() < 19 ? 'Shift 1' : 'Shift 2';
          const timeOnlyStop = stopTimeObj.toTimeString().split(' ')[0];

          recordsToInsert.push({
            ...row,
            year: yearStop,
            month: monthStop,
            day: dayNameStop,
            shift: shiftStop,
            time_only: timeOnlyStop,
            delta_time: deltaTextBruto, // Gunakan delta_text bruto yang sama dari siklus
            loading_time_server: loadingTimeText, // Gunakan loading_time_text net yang sama dari siklus
            total_break: parseFloat(totalBreakMinutes), // Total durasi istirahat dalam siklus (menit)
          });
        }
        startRecord = null;
      }
    }

    if (recordsToInsert.length === 0) {
      console.log(`ℹ️ Tidak ada siklus baru ≥ ${MIN_ACTUAL_PCS} pcs di ${sourceTable} yang ditemukan dalam data baru.`);
      return;
    }

    const sample = recordsToInsert[0];
    const columns = Object.keys(sample);

    // Gunakan INSERT IGNORE untuk mencegah error jika primary key sudah ada
    const query = `
      INSERT IGNORE INTO ${targetTable} (${columns.join(', ')})
      VALUES ?
    `;

    const values = recordsToInsert.map(rec => columns.map(col => rec[col]));
    await connection.query(query, [values]);

    console.log(`✅ ${targetTable}: ${recordsToInsert.length} record baru tersimpan (≥ ${MIN_ACTUAL_PCS} pcs)`);

  } catch (err) {
    console.error(`❌ Error di ${sourceTable}:`, err.message);
  } finally {
    if (connection) connection.release();
  }
}

// 🧩 Jalankan semua line satu per satu (tertulis manual)
async function processAllLines() {
  console.log(`=== 🚀 Mulai sinkronisasi semua common_rail_X ===`);

  await processOneLine('common_rail_1_transit_manhour', 'common_rail_1_core');
  await processOneLine('common_rail_2_transit_manhour', 'common_rail_2_core');
  await processOneLine('common_rail_3_transit_manhour', 'common_rail_3_core');
  await processOneLine('common_rail_4_transit_manhour', 'common_rail_4_core');
  await processOneLine('common_rail_5_transit_manhour', 'common_rail_5_core');
  await processOneLine('common_rail_6_transit_manhour', 'common_rail_6_core');
  await processOneLine('common_rail_7_transit_manhour', 'common_rail_7_core');
  await processOneLine('common_rail_8_transit_manhour', 'common_rail_8_core');
  await processOneLine('common_rail_9_transit_manhour', 'common_rail_9_core');
  await processOneLine('common_rail_10_transit_manhour', 'common_rail_10_core');
  await processOneLine('common_rail_11_transit_manhour', 'common_rail_11_core');
  await processOneLine('common_rail_12_transit_manhour', 'common_rail_12_core');

  console.log(`\n✅ Semua line selesai disinkronisasi.`);
}

processAllLines();
