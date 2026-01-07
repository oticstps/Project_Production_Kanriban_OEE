
// TRUNCATE TABLE common_rail_1_transit_manhour;
// TRUNCATE TABLE common_rail_2_transit_manhour;
// TRUNCATE TABLE common_rail_3_transit_manhour;
// TRUNCATE TABLE common_rail_4_transit_manhour;
// TRUNCATE TABLE common_rail_5_transit_manhour;
// TRUNCATE TABLE common_rail_6_transit_manhour;
// TRUNCATE TABLE common_rail_7_transit_manhour;
// TRUNCATE TABLE common_rail_8_transit_manhour;
// TRUNCATE TABLE common_rail_9_transit_manhour;
// TRUNCATE TABLE common_rail_10_transit_manhour;
// TRUNCATE TABLE common_rail_11_transit_manhour;
// TRUNCATE TABLE common_rail_12_transit_manhour;

// TRUNCATE TABLE common_rail_1_core;
// TRUNCATE TABLE common_rail_2_core;
// TRUNCATE TABLE common_rail_3_core;
// TRUNCATE TABLE common_rail_4_core;
// TRUNCATE TABLE common_rail_5_core;
// TRUNCATE TABLE common_rail_6_core;
// TRUNCATE TABLE common_rail_7_core;
// TRUNCATE TABLE common_rail_8_core;
// TRUNCATE TABLE common_rail_9_core;
// TRUNCATE TABLE common_rail_10_core;
// TRUNCATE TABLE common_rail_11_core;
// TRUNCATE TABLE common_rail_12_core;

const pool = require('./config/db_core');

const MIN_ACTUAL_PCS = 5;
const HOLIDAYS = new Set([]);

// ============== KONFIGURASI PRODUK ==============
const PRODUCT_CONFIG = {
  // PG2.2
  "ASHOK H6A": { manpower: 3, setup_ct: 234 },
  "P3263": { manpower: 3, setup_ct: 406 },
  "P3267": { manpower: 0, setup_ct: 332 },
  "MDE8": { manpower: 0, setup_ct: 0 },
  "E494": { manpower: 0, setup_ct: 0 },
  "902FA": { manpower: 3, setup_ct: 91 },
  "4N13": { manpower: 0, setup_ct: 104 },
  "VM": { manpower: 0, setup_ct: 65 },
  "VM USA": { manpower: 0, setup_ct: 107 },
  "RT56": { manpower: 0, setup_ct: 65 },
  "JDE20": { manpower: 0, setup_ct: 0 },
  "902F I": { manpower: 4, setup_ct: 98 },
  "902F E": { manpower: 0, setup_ct: 88 },
  "RT50": { manpower: 0, setup_ct: 167 },
  "Ashok N4": { manpower: 4, setup_ct: 269 },
  "Ashok N6": { manpower: 3, setup_ct: 412 },
  "N4": { manpower: 0, setup_ct: 0 },
  "634F": { manpower: 0, setup_ct: 0 },
  "RZ4E-B": { manpower: 4, setup_ct: 94.5 },
  
  // PG2.1
  "YD25": { manpower: 0, setup_ct: 107 },
  "YD2K3": { manpower: 4, setup_ct: 104 },
  "4N15 C": { manpower: 0, setup_ct: 107 },
  "4D56": { manpower: 0, setup_ct: 0 },
  "CR22 B": { manpower: 0, setup_ct: 94.8 },
  "S320": { manpower: 4, setup_ct: 92 },
  "902F C": { manpower: 4, setup_ct: 80 },
  "415F": { manpower: 0, setup_ct: 97 },
  "1KD": { manpower: 0, setup_ct: 0 },
  "GD B": { manpower: 4, setup_ct: 82 },
  "902F B": { manpower: 4, setup_ct: 80.5 },
  "902FG": { manpower: 4, setup_ct: 80.4 },
  "RG01 B": { manpower: 4, setup_ct: 91.9 },
  "902FD": { manpower: 4, setup_ct: 86.4 },
  "19MY": { manpower: 0, setup_ct: 102 },
  "RZ4E-A": { manpower: 0, setup_ct: 102 },
  "902F-F": { manpower: 4, setup_ct: 88.4 },
  "ES01-B": { manpower: 0, setup_ct: 93.7 }
};

function getProductConfig(productName) {
  if (!productName) return { manpower: '0', setup_ct: '0' };
  
  const cleanProductName = productName.trim();
  
  if (PRODUCT_CONFIG[cleanProductName]) {
    return {
      manpower: PRODUCT_CONFIG[cleanProductName].manpower.toString(),
      setup_ct: PRODUCT_CONFIG[cleanProductName].setup_ct.toString()
    };
  }
  
  const matchingKey = Object.keys(PRODUCT_CONFIG).find(key => {
    const searchKey = key.toLowerCase();
    const searchProduct = cleanProductName.toLowerCase();
    return searchProduct.includes(searchKey) || searchKey.includes(searchProduct);
  });
  
  if (matchingKey) {
    return {
      manpower: PRODUCT_CONFIG[matchingKey].manpower.toString(),
      setup_ct: PRODUCT_CONFIG[matchingKey].setup_ct.toString()
    };
  }
  
  return { manpower: '0', setup_ct: '0' };
}

// ============== HELPER FUNCTIONS ==============
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

function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// ============== SHIFT DETERMINATION ==============
function getShiftFromTime(dateTime) {
  const hour = dateTime.getHours();
  const minute = dateTime.getMinutes();
  const totalMinutes = hour * 60 + minute;
  
  // Shift 1: 07:10 - 20:10
  const shift1Start = 7 * 60 + 10;
  const shift1End = 20 * 60 + 10;
  
  if (totalMinutes >= shift1Start && totalMinutes < shift1End) {
    return 'Shift 1';
  } else {
    return 'Shift 2';
  }
}

// ============== FUNGSI LOADING TIME START ==============
function getLoadingTimeStart(startDateTime) {
  const shift = getShiftFromTime(startDateTime);
  const date = new Date(startDateTime);
  
  if (shift === 'Shift 1') {
    // Shift 1: loading time mulai 07:10
    date.setHours(7, 10, 0, 0);
  } else {
    // Shift 2: loading time mulai 20:00
    const hour = startDateTime.getHours();
    
    if (hour >= 20) {
      date.setHours(20, 0, 0, 0);
    } else {
      date.setDate(date.getDate() - 1);
      date.setHours(20, 0, 0, 0);
    }
  }
  
  return date;
}

// ============== FUNGSI DETAIL LOADING TIME ==============
function getLoadingTimeDetail(startDateTime, stopDateTime) {
  const loadingStart = getLoadingTimeStart(startDateTime);
  const formattedStart = formatDateTime(loadingStart);
  const formattedStop = formatDateTime(stopDateTime);
  
  return `${formattedStart} - ${formattedStop}`;
}

// ============== BREAK TIME CALCULATION ==============
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

// ============== LAYER 1: SYNC SOURCE -> TRANSIT ==============
async function syncOneTable(sourceTable) {
  const targetTable = `${sourceTable}_transit_manhour`;
  const connection = await pool.getConnection();

  try {
    console.log(`\n🚀 Mulai sinkronisasi ${sourceTable}...`);
    const [rows] = await connection.query(`
      SELECT * FROM ${sourceTable}
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
        `INSERT INTO ${targetTable} (
          id_uuid, line_id, pg, line_name, name_product, target, actual,
          loading_time, efficiency, delay, cycle_time, status,
          time_trouble, time_trouble_quality, andon, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          id_uuid = VALUES(id_uuid),
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
          andon = VALUES(andon)`,
        [
          row.id_uuid, row.line_id, row.pg, row.line_name, row.name_product,
          row.target, row.actual, row.loading_time, row.efficiency,
          row.delay, row.cycle_time, row.status, row.time_trouble,
          row.time_trouble_quality, row.andon, row.created_at
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
  console.log("=== 🚀 LAYER 1: Sinkronisasi Source -> Transit ===");
  
  for (let i = 1; i <= 12; i++) {
    await syncOneTable(`common_rail_${i}`);
  }
  
  console.log("\n✅ Semua tabel source -> transit selesai.");
}

// ============== LAYER 2: PROCESS TRANSIT -> CORE ==============
async function processOneLine(sourceTable, targetTable) {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log(`\n🔄 Memproses ${sourceTable} -> ${targetTable}...`);

    const [maxCreatedResult] = await connection.query(`
      SELECT MAX(created_at) as latest_processed_created_at FROM ${targetTable}
    `);
    const latestProcessedCreatedAt = maxCreatedResult[0].latest_processed_created_at;
    console.log(`🔍 Waktu terakhir diproses: ${latestProcessedCreatedAt || 'NULL'}`);

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
      console.log(`✅ Tidak ada data baru di ${sourceTable}.`);
      return;
    }

    console.log(`📊 Ditemukan ${rows.length} record baru untuk diproses.`);

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

          // Gunakan loading time start yang benar
          const loadingTimeStartDate = getLoadingTimeStart(startTime);
          
          // Hitung durasi dari loading time start sampai STOP
          const totalDurationSeconds = Math.floor((stopTime - loadingTimeStartDate) / 1000);
          const totalBreakSeconds = calculateBreakTime(loadingTimeStartDate, stopTime);
          const netDurationSeconds = Math.max(0, totalDurationSeconds - totalBreakSeconds);

          const totalDurationMinutes = (totalDurationSeconds / 60).toFixed(2);
          const totalBreakMinutes = (totalBreakSeconds / 60).toFixed(2);
          const netDurationMinutes = (netDurationSeconds / 60).toFixed(2);

          const deltaTextBruto = `${produced} pcs dalam ${totalDurationMinutes} menit`;
          const loadingTimeText = `${netDurationMinutes} menit`;
          
          // Detail loading time: dari kapan sampai kapan
          const loadingTimeDetail = getLoadingTimeDetail(startTime, stopTime);

          const productConfig = getProductConfig(startRecord.name_product);

          // Process START record
          const startTimeObj = new Date(startRecord.created_at);
          const yearStart = startTimeObj.getFullYear();
          const monthStart = startTimeObj.getMonth() + 1;
          const dayNameStart = getDayName(startTimeObj);
          const shiftStart = getShiftFromTime(startTimeObj);
          const timeOnlyStart = startTimeObj.toTimeString().split(' ')[0];

          recordsToInsert.push({
            id_uuid: startRecord.id_uuid,
            line_id: startRecord.line_id,
            pg: startRecord.pg,
            line_name: startRecord.line_name,
            name_product: startRecord.name_product,
            target: startRecord.target,
            actual: startRecord.actual,
            loading_time: loadingTimeDetail, // Detail loading time
            efficiency: startRecord.efficiency,
            delay: startRecord.delay,
            cycle_time: startRecord.cycle_time,
            status: startRecord.status,
            time_trouble: startRecord.time_trouble,
            time_trouble_quality: startRecord.time_trouble_quality,
            andon: startRecord.andon,
            created_at: startRecord.created_at,
            year: yearStart,
            month: monthStart,
            day: dayNameStart,
            shift: shiftStart,
            time_only: timeOnlyStart,
            delta_time: deltaTextBruto,
            loading_time_server: loadingTimeText,
            total_break: parseFloat(totalBreakMinutes),
            manpower: productConfig.manpower,
            setup_ct: productConfig.setup_ct,
            setup_manpower: productConfig.manpower
          });

          // Process STOP record
          const stopTimeObj = new Date(row.created_at);
          const yearStop = stopTimeObj.getFullYear();
          const monthStop = stopTimeObj.getMonth() + 1;
          const dayNameStop = getDayName(stopTimeObj);
          const shiftStop = getShiftFromTime(stopTimeObj);
          const timeOnlyStop = stopTimeObj.toTimeString().split(' ')[0];

          recordsToInsert.push({
            id_uuid: row.id_uuid,
            line_id: row.line_id,
            pg: row.pg,
            line_name: row.line_name,
            name_product: row.name_product,
            target: row.target,
            actual: row.actual,
            loading_time: loadingTimeDetail, // Detail loading time (sama)
            efficiency: row.efficiency,
            delay: row.delay,
            cycle_time: row.cycle_time,
            status: row.status,
            time_trouble: row.time_trouble,
            time_trouble_quality: row.time_trouble_quality,
            andon: row.andon,
            created_at: row.created_at,
            year: yearStop,
            month: monthStop,
            day: dayNameStop,
            shift: shiftStop,
            time_only: timeOnlyStop,
            delta_time: deltaTextBruto,
            loading_time_server: loadingTimeText,
            total_break: parseFloat(totalBreakMinutes),
            manpower: productConfig.manpower,
            setup_ct: productConfig.setup_ct,
            setup_manpower: productConfig.manpower
          });
        }
        startRecord = null;
      }
    }

    if (recordsToInsert.length === 0) {
      console.log(`ℹ️ Tidak ada siklus ≥ ${MIN_ACTUAL_PCS} pcs.`);
      return;
    }

    const sample = recordsToInsert[0];
    const columns = Object.keys(sample).filter(col => col !== 'id' && col !== 'idPrimary');

    const query = `INSERT IGNORE INTO ${targetTable} (${columns.join(', ')}) VALUES ?`;
    const values = recordsToInsert.map(rec => columns.map(col => rec[col]));
    const [result] = await connection.query(query, [values]);

    console.log(`✅ ${targetTable}: ${result.affectedRows} record tersimpan`);
    
    // Log contoh loading time detail
    if (recordsToInsert.length > 0) {
      console.log(`📅 Contoh loading time: ${recordsToInsert[0].loading_time}`);
    }
  } catch (err) {
    console.error(`❌ Error memproses ${sourceTable}:`, err.message);
  } finally {
    if (connection) connection.release();
  }
}

async function processAllLines() {
  console.log("\n=== 🚀 LAYER 2: Pemrosesan Transit -> Core ===");
  
  for (let i = 1; i <= 12; i++) {
    await processOneLine(
      `common_rail_${i}_transit_manhour`,
      `common_rail_${i}_core`
    );
  }
  
  console.log(`\n✅ Semua line transit -> core selesai.`);
}

// ============== MAIN EXECUTION ==============
(async () => {
  console.log("🕗 Proses dimulai:", new Date().toLocaleString('id-ID'));
  
  await syncAllTables();
  await processAllLines();
  
  console.log("\n🎉 Seluruh proses selesai!");
  process.exit(0);
})();