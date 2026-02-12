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
  if (!productName) return { manpower: '0', setup_ct: '0', linegai: '124' };
  
  const cleanProductName = productName.trim();
  
  // Cari exact match
  if (PRODUCT_CONFIG[cleanProductName]) {
    return {
      manpower: PRODUCT_CONFIG[cleanProductName].manpower.toString(),
      setup_ct: PRODUCT_CONFIG[cleanProductName].setup_ct.toString(),
      linegai: PRODUCT_CONFIG[cleanProductName].linegai.toString()
    };
  }
  
  // Coba cari partial match
  const matchingKey = Object.keys(PRODUCT_CONFIG).find(key => {
    const searchKey = key.toLowerCase();
    const searchProduct = cleanProductName.toLowerCase();
    return searchProduct.includes(searchKey) || searchKey.includes(searchProduct);
  });
  
  if (matchingKey) {
    return {
      manpower: PRODUCT_CONFIG[matchingKey].manpower.toString(),
      setup_ct: PRODUCT_CONFIG[matchingKey].setup_ct.toString(),
      linegai: PRODUCT_CONFIG[matchingKey].linegai.toString()
    };
  }
  
  return { manpower: '0', setup_ct: '0', linegai: '124' };
}

// ============== FUNGSI HELPER ==============
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

function getShiftFromTime(dateTime) {
  const hour = dateTime.getHours();
  const minute = dateTime.getMinutes();
  const totalMinutes = hour * 60 + minute;
  
  const shift1Start = 7 * 60 + 10;
  const shift1End = 20 * 60 + 10;
  
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

    await connection.query(`
      ALTER TABLE ${targetTable}
      ADD UNIQUE INDEX IF NOT EXISTS uniq_transit (line_id, status, created_at)
    `).catch(() => {});

    let processed = 0;

    for (const row of rows) {
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

    console.log(`✅ ${sourceTable} selesai — ${processed} data diproses.`);
  } catch (err) {
    console.error(`❌ Gagal sinkronisasi ${sourceTable}:`, err.message);
  } finally {
    connection.release();
  }
}

async function syncAllTables() {
  console.log("=== 🚀 Mulai sinkronisasi semua common_rail_X ke transit ===");

  const tables = [];
  for (let i = 1; i <= 12; i++) {
    tables.push(`common_rail_${i}`);
  }

  for (const table of tables) {
    await syncOneTable(table);
  }

  console.log("\n✅ Semua tabel source -> transit sudah disinkronisasi.");
}

// ============== LAYER 2: Pemrosesan Transit -> Core ==============
function getShiftStartTime(stopTime) {
  const hour = stopTime.getHours();
  const minute = stopTime.getMinutes();
  
  const shiftStart = new Date(stopTime);
  
  if (getShiftFromTime(stopTime) === 'Shift 1') {
    shiftStart.setHours(7, 10, 0, 0);
  } else {
    if (hour > 19 || (hour === 19 && minute >= 50)) {
      shiftStart.setHours(19, 50, 0, 0);
    } else {
      shiftStart.setDate(shiftStart.getDate() - 1);
      shiftStart.setHours(19, 50, 0, 0);
    }
  }
  
  return shiftStart;
}

function calculateLoadingTimeByShift(stopTime) {
  const shiftStartTime = getShiftStartTime(stopTime);
  const stopTimeDate = new Date(stopTime);
  
  const totalDurationSeconds = Math.floor((stopTimeDate - shiftStartTime) / 1000);
  const breakTimeSeconds = calculateBreakTime(shiftStartTime, stopTimeDate);
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

function findStartStopPairs(rows) {
  const cycles = [];
  const startRecords = {};
  
  for (const row of rows) {
    if (row.status === 'START') {
      startRecords[row.line_id] = row;
    } else if (row.status === 'STOP' && startRecords[row.line_id]) {
      cycles.push({
        start: startRecords[row.line_id],
        stop: row
      });
      delete startRecords[row.line_id];
    }
  }
  
  return cycles;
}

function calculateProductionMetrics(cycles) {
  const processedRecords = [];

  for (const cycle of cycles) {
    const { start, stop } = cycle;
    
    const startActual = parseInt(start.actual) || 0;
    const stopActual = parseInt(stop.actual) || 0;
    const produced = stopActual - startActual;

    if (produced < MIN_ACTUAL_PCS) {
      continue;
    }

    const startTime = new Date(start.created_at);
    const stopTime = new Date(stop.created_at);
    
    const totalDurationSec = Math.floor((stopTime - startTime) / 1000);
    const breakTimeSec = calculateBreakTime(startTime, stopTime);
    const netDurationSec = Math.max(0, totalDurationSec - breakTimeSec);

    const totalDurationMin = (totalDurationSec / 60).toFixed(2);
    const breakTimeMin = (breakTimeSec / 60).toFixed(2);
    const netDurationMin = (netDurationSec / 60).toFixed(2);

    const loadingTimeData = calculateLoadingTimeByShift(stopTime);
    const productConfig = getProductConfig(start.name_product);

    // Parse nilai untuk perhitungan
    const manpower = parseFloat(productConfig.manpower) || 0;
    const loadingTimeMinutes = parseFloat(loadingTimeData.netMinutes) || 0;
    const linegai = parseFloat(productConfig.linegai) || 124;
    const cycleTime = parseFloat(start.cycle_time) / 10 || 0;
    
    // Default values berdasarkan analisa
    const five_s = 10; // menit
    const manpower_help = 0;
    const loading_time_manpower_help = 0;

    // Perhitungan berdasarkan analisa
    // ⑥ = ①*②
    const manhour_in_line = manpower * loadingTimeMinutes;
    
    // ⑦ = ③*④
    const manhour_helper = manpower_help * loading_time_manpower_help;
    
    // ⑧ = 10*①
    const manhour_five_s = manpower * five_s;
    
    // ⑩ = ⑥+⑦+⑧+⑨
    const total_manhour = manhour_in_line + manhour_helper + manhour_five_s + linegai;
    
    // ⑪ = ⑩/Ⓐ
    const manhour_man_minutes_per_pcs = produced > 0 ? (total_manhour / produced) : 0;
    
    // PE = ((Ⓐ*ⓐ)/60/②)*100
    const pe = loadingTimeMinutes > 0 ? ((produced * cycleTime) / 60 / loadingTimeMinutes) * 100 : 0;

    const metrics = {
      manhour_in_line: manhour_in_line.toFixed(2),
      manhour_helper: manhour_helper.toFixed(2),
      manhour_five_s: manhour_five_s.toFixed(2),
      total_manhour: total_manhour.toFixed(2),
      manhour_man_minutes_per_pcs: manhour_man_minutes_per_pcs.toFixed(2),
      pe: pe.toFixed(2)
    };

    const startRecord = prepareRecord(
      start, 
      startTime, 
      productConfig,
      produced,
      totalDurationMin,
      netDurationMin,
      breakTimeMin,
      loadingTimeData.loadingTimeText,
      metrics
    );

    const stopRecord = prepareRecord(
      stop,
      stopTime,
      productConfig,
      produced,
      totalDurationMin,
      netDurationMin,
      breakTimeMin,
      loadingTimeData.loadingTimeText,
      metrics
    );

    processedRecords.push(startRecord, stopRecord);
  }

  console.log(`📈 ${processedRecords.length} record memenuhi kriteria produksi (≥ ${MIN_ACTUAL_PCS} pcs)`);
  return processedRecords;
}

function prepareRecord(originalRecord, time, productConfig, produced, totalDuration, netDuration, breakTime, loadingTimeByShift, metrics) {
  const record = { ...originalRecord };
  
  // Tambahkan kolom waktu
  record.year = time.getFullYear();
  record.month = time.getMonth() + 1;
  record.day = getDayName(time);
  record.shift = getShiftFromTime(time);
  record.time_only = time.toTimeString().split(' ')[0];
  
  // Tambahkan metrik produksi
  record.delta_time = `${produced} pcs dalam ${totalDuration} menit`;
  record.loading_time_server = loadingTimeByShift;
  record.total_break = parseFloat(breakTime);
  
  // Tambahkan konfigurasi produk
  record.manpower = productConfig.manpower;
  record.setup_ct = productConfig.setup_ct;
  
  // Tambahkan kolom-kolom hasil perhitungan
  record.manpower_help = '0';
  record.loading_time_manpower_help = '0';
  record.machine_fault_preq = '';
  record.machine_fault_duration = '';
  record.quality_check = '';
  record.another = '';
  record.kaizen = '';
  record.five_s = '10';
  record.manhour_in_line = metrics.manhour_in_line;
  record.manhour_helper = metrics.manhour_helper;
  record.manhour_five_s = metrics.manhour_five_s;
  record.total_manhour = metrics.total_manhour;
  record.manhour_man_minutes_per_pcs = metrics.manhour_man_minutes_per_pcs;
  record.pe = metrics.pe;
  record.bottle_neck_process = '';
  record.bottle_neck_process_duration = '';
  record.bottle_neck_mct = '';
  record.bottle_neck_mct_duration = '';
  record.setup_manpower = productConfig.manpower;
  record.dangae = '';
  
  return record;
}

async function processOneLine(sourceTable, targetTable) {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log(`\n🔄 Memproses ${sourceTable} -> ${targetTable}...`);

    const [maxCreatedResult] = await connection.query(`
      SELECT MAX(created_at) as latest_processed_created_at FROM ${targetTable}
    `);
    const latestProcessedCreatedAt = maxCreatedResult[0].latest_processed_created_at;
    console.log(`🔍 Tabel ${targetTable}: Waktu terakhir diproses adalah ${latestProcessedCreatedAt || 'NULL'}`);

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
    
    const cycles = findStartStopPairs(rows);
    
    if (cycles.length === 0) {
      console.log(`ℹ️ Tidak ada siklus START-STOP yang lengkap di ${sourceTable}.`);
      return;
    }
    
    const processedRecords = calculateProductionMetrics(cycles);
    
    if (processedRecords.length === 0) {
      console.log(`ℹ️ Tidak ada siklus baru ≥ ${MIN_ACTUAL_PCS} pcs di ${sourceTable}.`);
      return;
    }

    // Generate UUID untuk setiap record
    const { v4: uuidv4 } = require('uuid');
    processedRecords.forEach(record => {
      record.id_uuid = uuidv4();
    });

    const sample = processedRecords[0];
    const columns = Object.keys(sample).filter(col => col !== 'id');
    
    const query = `
      INSERT IGNORE INTO ${targetTable} (${columns.join(', ')})
      VALUES ?
    `;

    const values = processedRecords.map(rec => columns.map(col => rec[col]));
    const [result] = await connection.query(query, [values]);

    console.log(`✅ ${targetTable}: ${result.affectedRows} record baru tersimpan (≥ ${MIN_ACTUAL_PCS} pcs)`);
    
  } catch (err) {
    console.error(`❌ Error memproses ${sourceTable}:`, err.message);
  } finally {
    if (connection) connection.release();
  }
}

async function processAllLines() {
  console.log("\n=== 🚀 Mulai pemrosesan semua transit -> core ===");

  const lines = [];
  for (let i = 1; i <= 12; i++) {
    lines.push({
      source: `common_rail_${i}_transit_manhour`,
      target: `common_rail_${i}_core`
    });
  }

  for (const line of lines) {
    await processOneLine(line.source, line.target);
  }

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