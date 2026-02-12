// TRUNCATE TABLE common_rail_1_transit_manhour;

const pool = require('./config/db_core');
const MIN_ACTUAL_PCS = 5; // ✅ Threshold PCS
const HOLIDAYS = new Set([]); // Daftar hari libur (kosong untuk sekarang)




// ============== KONFIGURASI MANPOWER DAN setup_ct ==============
const PRODUCT_CONFIG = {
  /* =======================
     PG 2.2
  ======================= */
  "ASHOK H6A": { manpower: 3, setup_ct: 234, linegai: 124 },
  "P3263":     { manpower: 3, setup_ct: 406, linegai: 124 },
  "P3267":     { manpower: 0, setup_ct: 332, linegai: 124 },
  "MDE8":      { manpower: 0, setup_ct: 0,   linegai: 124 },
  "E494":      { manpower: 0, setup_ct: 0,   linegai: 124 },
  "902FA":     { manpower: 3, setup_ct: 91,  linegai: 124 },
  "4N13":      { manpower: 0, setup_ct: 104, linegai: 124 },
  "VM":        { manpower: 0, setup_ct: 65,  linegai: 124 },
  "VM USA":    { manpower: 0, setup_ct: 107, linegai: 124 },
  "RT56":      { manpower: 0, setup_ct: 65,  linegai: 124 },
  "JDE20":     { manpower: 0, setup_ct: 0,   linegai: 124 },
  "902F I":    { manpower: 4, setup_ct: 98,  linegai: 124 },
  "902F E":    { manpower: 0, setup_ct: 88,  linegai: 124 },
  "RT50":      { manpower: 0, setup_ct: 167, linegai: 124 },
  "Ashok N4":  { manpower: 4, setup_ct: 269, linegai: 124 },
  "Ashok N6":  { manpower: 3, setup_ct: 412, linegai: 124 },
  "N4":        { manpower: 0, setup_ct: 0,   linegai: 124 },
  "634F":      { manpower: 0, setup_ct: 0,   linegai: 124 },
  "RZ4E-B":    { manpower: 4, setup_ct: 94.5,linegai: 124 },

  /* =======================
     PG 2.1
  ======================= */
  "YD25":      { manpower: 0, setup_ct: 107, linegai: 124 },
  "YD2K3":     { manpower: 4, setup_ct: 104, linegai: 124 },
  "4N15 C":    { manpower: 0, setup_ct: 107, linegai: 124 },
  "4D56":      { manpower: 0, setup_ct: 0,   linegai: 124 },
  "CR22 B":    { manpower: 0, setup_ct: 94.8,linegai: 124 },
  "S320":      { manpower: 4, setup_ct: 92,  linegai: 124 },
  "902F C":    { manpower: 4, setup_ct: 80,  linegai: 124 },
  "415F":      { manpower: 0, setup_ct: 97,  linegai: 124 },
  "1KD":       { manpower: 0, setup_ct: 0,   linegai: 124 },
  "GD B":      { manpower: 4, setup_ct: 82,  linegai: 124 },
  "902F B":    { manpower: 4, setup_ct: 80.5,linegai: 124 },
  "902FG":     { manpower: 4, setup_ct: 80.4,linegai: 124 },
  "RG01 B":    { manpower: 4, setup_ct: 91.9,linegai: 124 },
  "902FD":     { manpower: 4, setup_ct: 86.4,linegai: 124 },
  "19MY":      { manpower: 0, setup_ct: 102, linegai: 124 },
  "RZ4E-A":    { manpower: 0, setup_ct: 102, linegai: 124 },
  "902F-F":    { manpower: 4, setup_ct: 88.4,linegai: 124 },
  "ES01-B":    { manpower: 0, setup_ct: 93.7,linegai: 124 },
};




// Fungsi untuk mendapatkan konfigurasi produk berdasarkan nama produk
function getProductConfig(productName) {
  if (!productName) return { manpower: '0', setup_ct: '0' };
  
  const cleanProductName = productName.trim();
  
  // Cari exact match
  if (PRODUCT_CONFIG[cleanProductName]) {
    return {
      manpower: PRODUCT_CONFIG[cleanProductName].manpower.toString(),
      setup_ct: PRODUCT_CONFIG[cleanProductName].setup_ct.toString()
    };
  }
  
  // Coba cari partial match (untuk handle kemungkinan format berbeda)
  const matchingKey = Object.keys(PRODUCT_CONFIG).find(key => {
    const searchKey = key.toLowerCase();
    const searchProduct = cleanProductName.toLowerCase();
    
    // Cek apakah nama produk mengandung key atau key mengandung nama produk
    return searchProduct.includes(searchKey) || searchKey.includes(searchProduct);
  });
  
  if (matchingKey) {
    return {
      manpower: PRODUCT_CONFIG[matchingKey].manpower.toString(),
      setup_ct: PRODUCT_CONFIG[matchingKey].setup_ct.toString()
    };
  }
  
  return { manpower: '0', setup_ct: '0' }; // Default jika tidak ditemukan
}






// ============== FUNGSI HELPER (DIPERBARUI) ==============
function getDayName(date) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[date.getDay()];
}





function createTimeForDate(baseDate, hour, minute, second = 0) {
  const date = new Date(baseDate);
  date.setHours(hour, minute, second, 0);
  return date;
}




function isHoliday(date) {
  const dateStr = date.toISOString().split('T')[0];
  return HOLIDAYS.has(dateStr);
}





// ============== FUNGSI BARU: DETERMINASI SHIFT ==============
function getShiftFromTime(dateTime) {
  const hour = dateTime.getHours();
  const minute = dateTime.getMinutes();
  const totalMinutes = hour * 60 + minute;
  
  // Shift 1: 07:10 - 20:10
  const shift1Start = 7 * 60 + 10; // 07:10
  const shift1End = 20 * 60 + 10;  // 20:10
  
  // Shift 2: 20:10 - 07:10 (hari berikutnya)
  if (totalMinutes >= shift1Start && totalMinutes < shift1End) {
    return 'Shift 1';
  } else {
    return 'Shift 2';
  }
}








function getDailyBreakSchedulesForDate(dateInput) {
  if (isHoliday(dateInput)) return [];
  
  const dayName = getDayName(dateInput);
  const isFriday = dayName === 'Jumat';
  const schedules = [];






  if (isFriday) {
    schedules.push(
      { start: createTimeForDate(dateInput, 9, 20), end: createTimeForDate(dateInput, 9, 30) },
      { start: createTimeForDate(dateInput, 11, 40), end: createTimeForDate(dateInput, 12, 50) },
      { start: createTimeForDate(dateInput, 14, 50), end: createTimeForDate(dateInput, 15, 0) },
      { start: createTimeForDate(dateInput, 16, 30), end: createTimeForDate(dateInput, 16, 40) },
      { start: createTimeForDate(dateInput, 16, 40), end: createTimeForDate(dateInput, 17, 0) },
      { start: createTimeForDate(dateInput, 18, 0), end: createTimeForDate(dateInput, 18, 30) }
    );
  } else {
    schedules.push(
      { start: createTimeForDate(dateInput, 9, 20), end: createTimeForDate(dateInput, 9, 30) },
      { start: createTimeForDate(dateInput, 12, 0), end: createTimeForDate(dateInput, 12, 40) },
      { start: createTimeForDate(dateInput, 14, 20), end: createTimeForDate(dateInput, 14, 30) },
      { start: createTimeForDate(dateInput, 16, 0), end: createTimeForDate(dateInput, 16, 10) },
      { start: createTimeForDate(dateInput, 16, 10), end: createTimeForDate(dateInput, 16, 30) },
      { start: createTimeForDate(dateInput, 18, 30), end: createTimeForDate(dateInput, 19, 0) }
    );
  }




  // Jadwal Shift 2
  schedules.push(
    { start: createTimeForDate(dateInput, 21, 50), end: createTimeForDate(dateInput, 22, 0) },
    { start: createTimeForDate(dateInput, 0, 0), end: createTimeForDate(dateInput, 0, 10) },
    { start: createTimeForDate(dateInput, 2, 10), end: createTimeForDate(dateInput, 2, 50) },
    { start: createTimeForDate(dateInput, 4, 40), end: createTimeForDate(dateInput, 4, 50) }
  );





  const nextDay = new Date(dateInput);
  nextDay.setDate(dateInput.getDate() + 1);
  schedules.push({ start: createTimeForDate(nextDay, 4, 50), end: createTimeForDate(nextDay, 5, 10) });

  return schedules;
}




function getBreakSchedulesForDateRange(startDate, endDate) {
  const allSchedules = [];
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);
  const endLoopDate = new Date(endDate);
  endLoopDate.setHours(0, 0, 0, 0);

  while (currentDate <= endLoopDate) {
    const dailySchedules = getDailyBreakSchedulesForDate(currentDate);
    allSchedules.push(...dailySchedules);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return allSchedules;
}




function calculateBreakTime(startTime, stopTime) {
  if (startTime >= stopTime) return 0;

  const startDay = new Date(startTime);
  startDay.setHours(0, 0, 0, 0);
  const endDay = new Date(stopTime);
  endDay.setHours(0, 0, 0, 0);

  const allSchedules = getBreakSchedulesForDateRange(startDay, endDay);
  let totalBreakSeconds = 0;

  for (const { start, end } of allSchedules) {
    const overlapStart = new Date(Math.max(start.getTime(), startTime.getTime()));
    const overlapEnd = new Date(Math.min(end.getTime(), stopTime.getTime()));

    if (overlapStart < overlapEnd) {
      totalBreakSeconds += (overlapEnd - overlapStart) / 1000;
    }
  }
  return totalBreakSeconds;
}





// ============== LAYER 1: Sinkronisasi Source -> Transit ==============
async function syncOneTable(sourceTable) {
  const targetTable = `${sourceTable}_transit_manhour`;
  const connection = await pool.getConnection();

  try {
    console.log(`\n🚀 Mulai sinkronisasi data dari ${sourceTable}...`);
    const [rows] = await connection.query(`
      SELECT *
      FROM ${sourceTable}
      WHERE status IN ('START', 'STOP')
    `);

    if (rows.length === 0) {
      console.log(`✅ Tidak ada data START/STOP pada ${sourceTable}.`);
      return;
    }

    console.log(`📦 ${sourceTable}: ditemukan ${rows.length} data.`);

    // Pastikan unique index ada untuk keperluan upsert
    await connection.query(`
      ALTER TABLE ${targetTable}
      ADD UNIQUE INDEX IF NOT EXISTS uniq_transit (line_id, status, created_at)
    `).catch(() => {});

    let processed = 0;

    for (const row of rows) {
      // UPSERT: Insert baru atau update jika sudah ada
      await connection.query(
        `
        INSERT INTO ${targetTable} (
          line_id, pg, line_name, name_product, target, actual,
          loading_time, efficiency, delay, cycle_time, status,
          time_trouble, time_trouble_quality, andon, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          pg = VALUES(pg),
          line_name = VALUES(line_name),
          name_product = VALUES(name_product),
          target = VALUES(target),
          actual = VALUES(actual),
          loading_time = VALUES(loading_time),
          efficiency = VALUES(efficiency),
          delay = VALUES(delay),
          cycle_time = VALUES(cycle_time),
          time_trouble = VALUES(time_trouble),
          time_trouble_quality = VALUES(time_trouble_quality),
          andon = VALUES(andon)
        `,
        [
          row.line_id,
          row.pg,
          row.line_name,
          row.name_product,
          row.target,
          row.actual,
          row.loading_time,
          row.efficiency,
          row.delay,
          row.cycle_time,
          row.status,
          row.time_trouble,
          row.time_trouble_quality,
          row.andon,
          row.created_at,
        ]
      );
      processed++;
    }

    console.log(`✅ ${sourceTable} selesai — ${processed} data diproses (insert/update).`);
  } catch (err) {
    console.error(`❌ Gagal sinkronisasi ${sourceTable}:`, err.message);
  } finally {
    connection.release();
  }
}






// Sinkronisasi semua tabel dengan penamaan eksplisit
async function syncAllTables() {
  console.log("=== 🚀 Mulai sinkronisasi semua common_rail_X ke transit ===");

  await syncOneTable("common_rail_1");
  await syncOneTable("common_rail_2");
  await syncOneTable("common_rail_3");
  await syncOneTable("common_rail_4");
  await syncOneTable("common_rail_5");
  await syncOneTable("common_rail_6");
  await syncOneTable("common_rail_7");
  await syncOneTable("common_rail_8");
  await syncOneTable("common_rail_9");
  await syncOneTable("common_rail_10");
  await syncOneTable("common_rail_11");
  await syncOneTable("common_rail_12");

  console.log("\n✅ Semua tabel source -> transit sudah disinkronisasi.");
}








// ============== LAYER 2: Pemrosesan Transit -> Core ==============

// ============== FUNGSI BARU: Tentukan waktu mulai berdasarkan shift ==============
function getShiftStartTime(stopTime) {
  const hour = stopTime.getHours();
  const minute = stopTime.getMinutes();
  
  // Buat tanggal baru berdasarkan stopTime
  const shiftStart = new Date(stopTime);
  
  // Tentukan waktu mulai berdasarkan shift
  if (getShiftFromTime(stopTime) === 'Shift 1') {
    // Shift 1: mulai dari 07:10 hari yang sama
    shiftStart.setHours(7, 10, 0, 0);
  } else {
    // Shift 2: mulai dari 19:50 
    // Periksa apakah stopTime setelah 19:50 hari yang sama atau sebelum 07:10 hari berikutnya
    if (hour > 19 || (hour === 19 && minute >= 50)) {
      // Jika stopTime setelah 19:50 hari yang sama
      shiftStart.setHours(19, 50, 0, 0);
    } else {
      // Jika stopTime sebelum 07:10 hari berikutnya (masih shift 2)
      shiftStart.setDate(shiftStart.getDate() - 1);
      shiftStart.setHours(19, 50, 0, 0);
    }
  }
  
  return shiftStart;
}






// ============== FUNGSI BARU: Hitung loading time berdasarkan shift ==============
function calculateLoadingTimeByShift(stopTime) {
  const shiftStartTime = getShiftStartTime(stopTime);
  const stopTimeDate = new Date(stopTime);
  
  // Hitung total durasi dari shift start sampai stop
  const totalDurationSeconds = Math.floor((stopTimeDate - shiftStartTime) / 1000);
  
  // Hitung break time dalam rentang tersebut
  const breakTimeSeconds = calculateBreakTime(shiftStartTime, stopTimeDate);
  
  // Net duration = total duration - break time
  const netDurationSeconds = Math.max(0, totalDurationSeconds - breakTimeSeconds);
  const netDurationMinutes = (netDurationSeconds / 60).toFixed(2);
  
  return {
    totalSeconds: totalDurationSeconds,
    breakSeconds: breakTimeSeconds,
    netSeconds: netDurationSeconds,
    netMinutes: netDurationMinutes,
    loadingTimeText: `${netDurationMinutes} menit`,
    shiftStartTime: shiftStartTime
  };
}






// ============== PERBARUI FUNGSI calculateProductionMetrics ==============
function calculateProductionMetrics(cycles) {
  const processedRecords = [];

  for (const cycle of cycles) {
    const { start, stop } = cycle;
    
    // Hitung jumlah produksi
    const startActual = parseInt(start.actual) || 0;
    const stopActual = parseInt(stop.actual) || 0;
    const produced = stopActual - startActual;

    // Cek apakah memenuhi minimum produksi
    if (produced < MIN_ACTUAL_PCS) {
      continue; // Lewati jika produksi kurang dari minimum
    }

    // Waktu START dan STOP
    const startTime = new Date(start.created_at);
    const stopTime = new Date(stop.created_at);
    
    // Hitung total durasi START-STOP untuk delta_time
    const totalDurationSec = Math.floor((stopTime - startTime) / 1000);
    const breakTimeSec = calculateBreakTime(startTime, stopTime);
    const netDurationSec = Math.max(0, totalDurationSec - breakTimeSec);

    // Konversi ke menit untuk delta_time
    const totalDurationMin = (totalDurationSec / 60).toFixed(2);
    const breakTimeMin = (breakTimeSec / 60).toFixed(2);
    const netDurationMin = (netDurationSec / 60).toFixed(2);

    // HITUNG LOADING TIME BERDASARKAN SHIFT (PERUBAHAN DISINI!)
    const loadingTimeData = calculateLoadingTimeByShift(stopTime);
    
    // Dapatkan konfigurasi produk
    const productConfig = getProductConfig(start.name_product);

    // Siapkan record START
    const startRecord = prepareRecord(
      start, 
      startTime, 
      productConfig,
      produced,
      totalDurationMin,  // Untuk delta_time
      netDurationMin,    // Loading time lama (jika masih dibutuhkan)
      breakTimeMin,
      loadingTimeData.loadingTimeText  // Loading time baru berdasarkan shift
    );

    // Siapkan record STOP
    const stopRecord = prepareRecord(
      stop,
      stopTime,
      productConfig,
      produced,
      totalDurationMin,  // Untuk delta_time
      netDurationMin,    // Loading time lama (jika masih dibutuhkan)
      breakTimeMin,
      loadingTimeData.loadingTimeText  // Loading time baru berdasarkan shift
    );

    processedRecords.push(startRecord, stopRecord);
  }

  console.log(`📈 ${processedRecords.length} record memenuhi kriteria produksi (≥ ${MIN_ACTUAL_PCS} pcs)`);
  return processedRecords;
}




// ============== PERBARUI FUNGSI prepareRecord ==============
function prepareRecord(originalRecord, time, productConfig, produced, totalDuration, netDuration, breakTime, loadingTimeByShift) {
  const record = { ...originalRecord };
  
  // Tambahkan kolom waktu
  record.year = time.getFullYear();
  record.month = time.getMonth() + 1;
  record.day = getDayName(time);
  record.shift = getShiftFromTime(time);
  record.time_only = time.toTimeString().split(' ')[0];
  
  // Tambahkan metrik produksi
  record.delta_time = `${produced} pcs dalam ${totalDuration} menit`;
  record.loading_time_server = loadingTimeByShift;  // Gunakan loading time berdasarkan shift
  record.total_break = parseFloat(breakTime);
  
  // Tambahkan konfigurasi
  record.manpower = productConfig.manpower;
  record.setup_ct = productConfig.setup_ct;
  
  return record;
}




// ============== FUNGSI UTAMA YANG DIPERBARUI ==============
async function processOneLine(sourceTable, targetTable) {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log(`\n🔄 Memproses ${sourceTable} -> ${targetTable}...`);

    // Cari created_at terakhir yang sudah diproses
    const [maxCreatedResult] = await connection.query(`
      SELECT MAX(created_at) as latest_processed_created_at FROM ${targetTable}
    `);
    const latestProcessedCreatedAt = maxCreatedResult[0].latest_processed_created_at;
    console.log(`🔍 Tabel ${targetTable}: Waktu terakhir diproses adalah ${latestProcessedCreatedAt || 'NULL'}`);

    // Ambil data baru dari tabel transit
    let sourceQuery = `
      SELECT * FROM ${sourceTable} 
      WHERE status IN ('START', 'STOP')
    `;
    let sourceParams = [];
    if (latestProcessedCreatedAt) {
      sourceQuery += ` AND created_at > ?`;
      sourceParams.push(latestProcessedCreatedAt);
    }
    sourceQuery += ` ORDER BY created_at ASC`;
    
    const [rows] = await connection.query(sourceQuery, sourceParams);
    
    if (rows.length === 0) {
      console.log(`✅ Tidak ada data baru di ${sourceTable} sejak ${latestProcessedCreatedAt || 'awal'}.`);
      return;
    }
    
    console.log(`📊 Ditemukan ${rows.length} record baru di ${sourceTable} untuk diproses.`);
    
    // Temukan pasangan START-STOP
    const cycles = findStartStopPairs(rows);
    
    if (cycles.length === 0) {
      console.log(`ℹ️ Tidak ada siklus START-STOP yang lengkap di ${sourceTable}.`);
      return;
    }
    
    // Hitung metrik produksi
    const processedRecords = calculateProductionMetrics(cycles);
    
    if (processedRecords.length === 0) {
      console.log(`ℹ️ Tidak ada siklus baru ≥ ${MIN_ACTUAL_PCS} pcs di ${sourceTable}.`);
      return;
    }

    // Simpan ke database
    const sample = processedRecords[0];
    const columns = Object.keys(sample).filter(col => col !== 'id');
    
    const query = `
      INSERT IGNORE INTO ${targetTable} (${columns.join(', ')})
      VALUES ?
    `;

    const values = processedRecords.map(rec => columns.map(col => rec[col]));
    const [result] = await connection.query(query, [values]);

    console.log(`✅ ${targetTable}: ${result.affectedRows} record baru tersimpan (≥ ${MIN_ACTUAL_PCS} pcs)`);
    
    // Tampilkan ringkasan loading time per shift
    const loadingTimeSummary = {};
    processedRecords.forEach(rec => {
      if (rec.shift && rec.loading_time_server) {
        if (!loadingTimeSummary[rec.shift]) {
          loadingTimeSummary[rec.shift] = {
            count: 0,
            loading_times: []
          };
        }
        loadingTimeSummary[rec.shift].count++;
        loadingTimeSummary[rec.shift].loading_times.push(rec.loading_time_server);
      }
    });
    
    console.log(`📋 Ringkasan loading time per shift:`);
    for (const [shift, data] of Object.entries(loadingTimeSummary)) {
      console.log(`   ${shift}: ${data.count} record`);
    }
    
  } catch (err) {
    console.error(`❌ Error memproses ${sourceTable}:`, err.message);
  } finally {
    if (connection) connection.release();
  }
}









// Pemrosesan semua line dengan penamaan eksplisit
async function processAllLines() {
  console.log("\n=== 🚀 Mulai pemrosesan semua transit -> core ===");

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

  console.log(`\n✅ Semua line transit -> core selesai diproses.`);
}




// ============== EKSEKUSI BERURUTAN ==============
(async () => {


  console.log("🕗 Proses dimulai pada:", new Date().toLocaleString('id-ID'));
  


  // Layer 1: Sinkronisasi source -> transit
  await syncAllTables();
  
  // Layer 2: Pemrosesan transit -> core
  await processAllLines();
  


  console.log("\n🎉 Seluruh proses sinkronisasi selesai!");



  process.exit(0);




})();