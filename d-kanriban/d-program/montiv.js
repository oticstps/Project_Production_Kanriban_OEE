const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

// Konfigurasi koneksi database
const db = mysql.createConnection({
  host: '169.254.33.24',
  user: 'otics_tps',
  password: 'sukatno_ali',
  database: 'database_tps_core',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Mapping name_product ke tabel tujuan filtered untuk Common Rail 1-12
const productTableMapFiltered = {
  // Common Rail 1
  'ASHOK H6A': 'common_rail_1_filtered',
  'MDE8': 'common_rail_1_filtered',
  'P3267': 'common_rail_1_filtered',
  'E494 (B20)': 'common_rail_1_filtered',
  'P3263': 'common_rail_1_filtered',
  
  // Common Rail 2
  '902FA': 'common_rail_2_filtered',
  '902FA-PTJ': 'common_rail_2_filtered',
  
  
  // Common Rail 3
  '4N13': 'common_rail_3_filtered',
  'VM': 'common_rail_3_filtered',
  'VM USA': 'common_rail_3_filtered',
  'RT56': 'common_rail_3_filtered',
  'JDE20': 'common_rail_3_filtered',
  '902FI': 'common_rail_3_filtered',
  '902F I' : 'common_rail_3_filtered',
  
  // Common Rail 4
  '4N16': 'common_rail_4_filtered',
  '4N16-B': 'common_rail_4_filtered',
  'MDE5': 'common_rail_4_filtered',
  
  
  // Common Rail 5
  '902FE': 'common_rail_5_filtered',
  '902FE-SGI167': 'common_rail_5_filtered',
  '902FE-PTJ': 'common_rail_5_filtered',
  'RT-50': 'common_rail_5_filtered',
  'ASHOK N4': 'common_rail_5_filtered',
  'ASHOK N6': 'common_rail_5_filtered',
  '634F': 'common_rail_5_filtered',
  
  
  // Common Rail 6
  'RZ4E': 'common_rail_6_filtered',
  'RZE4 B': 'common_rail_6_filtered',
  
  
  // Common Rail 7
  '4N15': 'common_rail_7_filtered',
  'YD2K3': 'common_rail_7_filtered',
  'S320': 'common_rail_7_filtered',
  'YD25': 'common_rail_7_filtered',
  'CR22 B': 'common_rail_7_filtered',
  
  
  // Common Rail 8
  '415F': 'common_rail_8_filtered',
  '902FC': 'common_rail_8_filtered',
  '902fc': 'common_rail_8_filtered',
  '902F C' : 'common_rail_8_filtered',
  
  // Common Rail 9GD B
  'GD B': 'common_rail_9_filtered',
  '902FB': 'common_rail_9_filtered',
  '902F-B': 'common_rail_9_filtered',
  '902F B': 'common_rail_9_filtered',
  
  
  // Common Rail 10
  '902FG': 'common_rail_10_filtered',
  'RG01 B': 'common_rail_10_filtered',
  'RG01' : 'common_rail_10_filtered',
  
  // Common Rail 11
  '902FD': 'common_rail_11_filtered',
  '19MY': 'common_rail_11_filtered',
  'RZ4E A': 'common_rail_11_filtered',
  
  
  // Common Rail 12
  '902F-F': 'common_rail_12_filtered',
  'ES01-B': 'common_rail_12_filtered',
  'ES01B': 'common_rail_12_filtered',
  '902F F' : 'common_rail_12_filtered'
  
};

// Mapping name_product ke tabel tujuan hourly untuk Common Rail 1-12
const productTableMapHourly = {
  // Common Rail 1
  'ASHOK H6A': 'common_rail_1_hourly',
  'MDE8': 'common_rail_1_hourly',
  'P3267': 'common_rail_1_hourly',
  'E494 (B20)': 'common_rail_1_hourly',
  'P3263': 'common_rail_1_hourly',
  
  // Common Rail 2
  '902FA': 'common_rail_2_hourly',
  '902FA-PTJ': 'common_rail_2_hourly',
  
  // Common Rail 3
  '4N13': 'common_rail_3_hourly',
  'VM': 'common_rail_3_hourly',
  'VM USA': 'common_rail_3_hourly',
  'RT56': 'common_rail_3_hourly',
  'JDE20': 'common_rail_3_hourly',
  '902FI': 'common_rail_3_hourly',
  
  // Common Rail 4
  '4N16': 'common_rail_4_hourly',
  '4N16-B': 'common_rail_4_hourly',
  'MDE5': 'common_rail_4_hourly',
  
  // Common Rail 5
  '902FE': 'common_rail_5_hourly',
  '902FE-SGI167': 'common_rail_5_hourly',
  '902FE-PTJ': 'common_rail_5_hourly',
  'RT-50': 'common_rail_5_hourly',
  'ASHOK N4': 'common_rail_5_hourly',
  'ASHOK N6': 'common_rail_5_hourly',
  '634F': 'common_rail_5_hourly',
  
  // Common Rail 6
  'RZ4E': 'common_rail_6_hourly',
  'RZE4 B': 'common_rail_6_hourly',
  
  // Common Rail 7
  '4N15': 'common_rail_7_hourly',
  'YD2K3': 'common_rail_7_hourly',
  'S320': 'common_rail_7_hourly',
  'YD25': 'common_rail_7_hourly',
  'CR22 B': 'common_rail_7_hourly',
  
  // Common Rail 8
  '415F': 'common_rail_8_hourly',
  '902FC': 'common_rail_8_hourly',
  '902fc': 'common_rail_8_hourly',
  
  // Common Rail 9
  'GD B': 'common_rail_9_hourly',
  '902FB': 'common_rail_9_hourly',
  '902F-B': 'common_rail_9_hourly',
  
  // Common Rail 10
  '902FG': 'common_rail_10_hourly',
  'RG01 B': 'common_rail_10_hourly',
  
  // Common Rail 11
  '902FD': 'common_rail_11_hourly',
  '19MY': 'common_rail_11_hourly',
  'RZ4E A': 'common_rail_11_hourly',
  
  // Common Rail 12
  '902F-F': 'common_rail_12_hourly',
  'ES01-B': 'common_rail_12_hourly',
  'ES01B': 'common_rail_12_hourly'
};

// Mapping tabel source berdasarkan Common Rail
const sourceTableMap = {
  'common_rail_1_filtered': 'common_rail_1',
  'common_rail_2_filtered': 'common_rail_2',
  'common_rail_3_filtered': 'common_rail_3',
  'common_rail_4_filtered': 'common_rail_4',
  'common_rail_5_filtered': 'common_rail_5',
  'common_rail_6_filtered': 'common_rail_6',
  'common_rail_7_filtered': 'common_rail_7',
  'common_rail_8_filtered': 'common_rail_8',
  'common_rail_9_filtered': 'common_rail_9',
  'common_rail_10_filtered': 'common_rail_10',
  'common_rail_11_filtered': 'common_rail_11',
  'common_rail_12_filtered': 'common_rail_12'
};

// SHIFT 1 SCHEDULE & OVERTIME
const shift1Slots = [
  { start: 7 * 60 + 10, end: 8 * 60 + 10, label: '07:10 - 08:10', theme: 'Schedule' },
  { start: 8 * 60 + 10, end: 9 * 60 + 10, label: '08:10 - 09:10', theme: 'Schedule' },
  { start: 9 * 60 + 30, end: 10 * 60 + 20, label: '09:30 - 10:20', theme: 'Schedule' },
  { start: 10 * 60 + 20, end: 11 * 60 + 20, label: '10:20 - 11:20', theme: 'Schedule' },
  { start: 12 * 60 + 40, end: 13 * 60 + 0, label: '12:40 - 13:00', theme: 'Schedule' },
  { start: 13 * 60 + 0, end: 14 * 60 + 0, label: '13:00 - 14:00', theme: 'Schedule' },
  { start: 14 * 60 + 30, end: 15 * 60 + 10, label: '14:30 - 15:10', theme: 'Schedule' },
  { start: 15 * 60 + 10, end: 16 * 60 + 10, label: '15:10 - 16:10', theme: 'Schedule' },
  { start: 16 * 60 + 30, end: 17 * 60 + 30, label: '16:30 - 17:30', theme: 'Overtime' },
  { start: 17 * 60 + 30, end: 18 * 60 + 30, label: '17:30 - 18:30', theme: 'Overtime' },
  { start: 19 * 60 + 0, end: 20 * 60 + 0, label: '19:00 - 20:00', theme: 'Overtime' },
];

// SHIFT 2 SCHEDULE & OVERTIME
const shift2Slots = [
  { start: 19 * 60 + 50, end: 20 * 60 + 50, label: '19:50 - 20:50', theme: 'Schedule' },
  { start: 20 * 60 + 50, end: 21 * 60 + 50, label: '20:50 - 21:50', theme: 'Schedule' },
  { start: 22 * 60 + 0, end: 23 * 60 + 0, label: '22:00 - 23:00', theme: 'Schedule' },
  { start: 23 * 60 + 0, end: 24 * 60 + 0, label: '23:00 - 00:00', theme: 'Schedule' },
  { start: 10, end: 70, label: '00:10 - 01:10', theme: 'Schedule' },
  { start: 70, end: 130, label: '01:10 - 02:10', theme: 'Schedule' },
  { start: 170, end: 230, label: '02:50 - 03:50', theme: 'Schedule' },
  { start: 230, end: 290, label: '03:50 - 04:50', theme: 'Schedule' },
  { start: 310, end: 370, label: '05:10 - 06:10', theme: 'Overtime' },
  { start: 370, end: 430, label: '06:10 - 07:10', theme: 'Overtime' },
];

const allScheduleSlots = [...shift1Slots, ...shift2Slots];

// Fungsi untuk mencatat log filter ke file
function logFilter(message) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());

  const logFile = path.join(__dirname, 'filter_log.txt');

  if (!global.logFilterInitialized) {
    fs.writeFileSync(logFile, `=== FILTER LOG - ${new Date().toISOString().split('T')[0]} ===\n${logMessage}`);
    global.logFilterInitialized = true;
  } else {
    fs.appendFileSync(logFile, logMessage);
  }
}

// Fungsi untuk mencatat log hourly
function logHourly(message) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());

  const logFile = path.join(__dirname, 'hourly_log.txt');

  if (!global.logHourlyInitialized) {
    fs.writeFileSync(logFile, `=== HOURLY PROCESS LOG - ${new Date().toISOString().split('T')[0]} ===\n${logMessage}`);
    global.logHourlyInitialized = true;
  } else {
    fs.appendFileSync(logFile, logMessage);
  }
}

function isDataValid(row) {
  logFilter(`🔍 MEMERIKSA DATA - idPrimary: ${row.idPrimary}, actual: ${row.actual}, target: ${row.target}, created_at: ${row.created_at}`);

  if (!row.actual || row.actual === '' || row.actual === null || row.actual === undefined || row.actual === '-' || row.actual === '0') {
    logFilter(`❌ DIFILTER (actual invalid): idPrimary ${row.idPrimary} - actual: ${row.actual}`);
    return false;
  }

  const actualValue = parseInt(row.actual);
  if (actualValue <= 0) {
    logFilter(`❌ DIFILTER (actual <= 0): idPrimary ${row.idPrimary} - actual: ${actualValue}`);
    return false;
  }

  if (!row.target || row.target === '' || row.target === null || row.target === undefined || row.target === '-' || row.target === '0') {
    logFilter(`❌ DIFILTER (target invalid): idPrimary ${row.idPrimary} - target: ${row.target}`);
    return false;
  }

  const targetValue = parseInt(row.target);
  if (targetValue <= 0) {
    logFilter(`❌ DIFILTER (target <= 0): idPrimary ${row.idPrimary} - target: ${targetValue}`);
    return false;
  }

  let fullTime = '';
  let timePart = '';

  if (row.created_at instanceof Date) {
    const hours = row.created_at.getHours().toString().padStart(2, '0');
    const minutes = row.created_at.getMinutes().toString().padStart(2, '0');
    const seconds = row.created_at.getSeconds().toString().padStart(2, '0');
    timePart = `${hours}:${minutes}:${seconds}`;
    fullTime = row.created_at.toISOString().replace('T', ' ').substring(0, 19);
  } else if (typeof row.created_at === 'string') {
    fullTime = row.created_at;
    if (row.created_at.includes(' ')) {
      timePart = row.created_at.split(' ')[1];
    }
  } else if (typeof row.created_at === 'object' && row.created_at !== null) {
    const dateString = row.created_at.toString();
    fullTime = dateString;
    if (dateString.includes(' ')) {
      timePart = dateString.split(' ')[1];
    }
  }

  if (timePart >= '18:30:00' && timePart <= '19:00:00') {
    logFilter(`⏭️  DILEWATI (jam 18:30 - 19:00): idPrimary ${row.idPrimary} - waktu: ${timePart}`);
    return false;
  }

  if (timePart >= '07:10:00' && timePart < '10:00:00' && actualValue > 100) {
    logFilter(`❌ DIFILTER (jam 7:10-10:00 & actual > 100): idPrimary ${row.idPrimary} - actual: ${actualValue}, waktu: ${timePart}`);
    return false;
  }

  logFilter(`✅ VALID: idPrimary ${row.idPrimary} - actual: ${actualValue}, target: ${targetValue}, waktu: ${timePart || fullTime}`);
  return true;
}

function syncDataByProduct(nameProduct) {
  const tableName = productTableMapFiltered[nameProduct];
  if (!tableName) {
    logFilter(`❌ Tidak ada mapping tabel untuk produk: ${nameProduct}`);
    return Promise.resolve();
  }

  const sourceTable = sourceTableMap[tableName];
  logFilter(`🔄 MEMULAI SINKRONISASI UNTUK PRODUK: ${nameProduct} → SOURCE: ${sourceTable} → TARGET: ${tableName}`);

  return new Promise((resolve, reject) => {
    const selectQuery = `
      SELECT * FROM ${sourceTable}
      WHERE name_product = ?
      ORDER BY created_at ASC
    `;

    db.query(selectQuery, [nameProduct], (err, results) => {
      if (err) {
        logFilter(`❌ ERROR: Gagal mengambil data untuk produk ${nameProduct} - ${err.message}`);
        return reject(err);
      }

      if (results.length === 0) {
        logFilter(`ℹ️  INFO: Tidak ada data untuk produk ${nameProduct}`);
        return resolve();
      }

      logFilter(`📊 STATISTIK AWAL (${nameProduct}): Total data = ${results.length}`);

      const validData = results.filter(row => isDataValid(row));
      logFilter(`📊 STATISTIK AKHIR (${nameProduct}): Data valid = ${validData.length}, Difilter = ${results.length - validData.length}`);

      if (validData.length === 0) {
        logFilter(`ℹ️  INFO: Tidak ada data valid untuk produk ${nameProduct}`);
        return resolve();
      }

      const existingQuery = `
        SELECT idPrimary, name_product, created_at FROM ${tableName}
        WHERE name_product = ?
      `;

      db.query(existingQuery, [nameProduct], (err, existingResults) => {
        if (err) {
          logFilter(`❌ ERROR: Gagal mengambil data existing untuk produk ${nameProduct} - ${err.message}`);
          return reject(err);
        }

        const existingIdPrimaries = new Set(existingResults.map(row => row.idPrimary));
        const existingCombinations = new Set(existingResults.map(row => `${row.name_product}_${row.created_at}`));

        const newData = validData.filter(row => {
          const combination = `${row.name_product}_${row.created_at}`;
          return !existingIdPrimaries.has(row.idPrimary) && !existingCombinations.has(combination);
        });

        logFilter(`📊 DATA BARU (${nameProduct}): ${newData.length} records yang belum ada`);

        if (newData.length === 0) {
          logFilter(`ℹ️  INFO: Tidak ada data baru untuk produk ${nameProduct}`);
          return resolve();
        }

        const insertQuery = `
          INSERT INTO ${tableName} (
            idPrimary, line_id, pg, line_name, name_product,
            target, actual, loading_time, efficiency, delay,
            cycle_time, status, time_trouble, time_trouble_quality, andon, created_at
          ) VALUES ?
        `;

        const values = newData.map(row => [
          row.idPrimary,
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
          row.created_at
        ]);

        db.query(insertQuery, [values], (err, result) => {
          if (err) {
            logFilter(`❌ ERROR: Gagal bulk insert untuk produk ${nameProduct} - ${err.message}`);
            return reject(err);
          }

          const insertedCount = result.affectedRows;
          const skippedCount = validData.length - newData.length;
          logFilter(`🎉 STATISTIK AKHIR (${nameProduct}): Inserted = ${insertedCount}, Skipped = ${skippedCount}`);
          resolve();
        });
      });
    });
  });
}

function syncAllProducts() {
  global.logFilterInitialized = false;

  const products = Object.keys(productTableMapFiltered);

  const syncPromises = products.map(product => syncDataByProduct(product));

  Promise.all(syncPromises)
    .then(() => {
      logFilter(`✅ SEMUA SINKRONISASI FILTER SELESAI.`);
      console.log('✅ Semua sinkronisasi filter selesai.');
    })
    .catch(err => {
      logFilter(`❌ ERROR FATAL FILTER: ${err.message}`);
      console.error('❌ Error saat sinkronisasi filter:', err);
    });
}

function getLastProcessedTimestamp(nameProduct, hourlyTable) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT MAX(created_at) as last_processed
      FROM ${hourlyTable}
      WHERE name_product = ?
    `;

    db.query(query, [nameProduct], (err, results) => {
      if (err) {
        logHourly(`❌ ERROR: Gagal mendapatkan timestamp terakhir untuk ${nameProduct} - ${err.message}`);
        return reject(err);
      }

      const lastProcessed = results[0]?.last_processed;
      logHourly(`🕒 Timestamp terakhir untuk ${nameProduct}: ${lastProcessed || 'Tidak ada data'}`);
      resolve(lastProcessed);
    });
  });
}

function sortDataByTime(data) {
  return data.sort((a, b) => {
    const timeA = a.created_at instanceof Date ? a.created_at : new Date(a.created_at);
    const timeB = b.created_at instanceof Date ? b.created_at : new Date(b.created_at);
    return timeA - timeB;
  });
}

function timeToMinutes(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return hours * 60 + minutes;
}

function getScheduleSlot(date) {
  const minutes = timeToMinutes(date);

  if (minutes >= 19 * 60 + 50) {
    for (let slot of shift2Slots) {
      if (slot.start <= minutes && minutes <= slot.end) {
        return slot;
      }
    }
  } else if (minutes <= 7 * 60 + 10) {
    for (let slot of shift2Slots) {
      if (slot.start <= minutes + 24 * 60 && minutes <= slot.end) {
        return slot;
      }
    }
  }

  for (let slot of allScheduleSlots) {
    if (slot.start <= minutes && minutes <= slot.end) {
      return slot;
    }
  }

  return null;
}

function getScheduleKey(date, nameProduct, lineId) {
  const slot = getScheduleSlot(date);
  if (!slot) return null;

  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return `${nameProduct}_${lineId}_${dateStr}_${slot.label}`;
}

function calculateScheduleDelta(data, lastProcessedTimestamp = null) {
  const sortedData = sortDataByTime(data);
  const scheduleMap = new Map();
  const scheduleDeltaMap = new Map();

  let filteredData = sortedData;
  if (lastProcessedTimestamp) {
    filteredData = sortedData.filter(row => {
      const rowTime = row.created_at instanceof Date ? row.created_at : new Date(row.created_at);
      return rowTime > new Date(lastProcessedTimestamp);
    });
    logHourly(`📊 Data baru setelah ${lastProcessedTimestamp}: ${filteredData.length} records`);
  }

  if (filteredData.length === 0) {
    return [];
  }

  filteredData.forEach(row => {
    let createdAt;
    if (row.created_at instanceof Date) {
      createdAt = row.created_at;
    } else if (typeof row.created_at === 'string') {
      createdAt = new Date(row.created_at);
    } else {
      return;
    }

    const scheduleKey = getScheduleKey(createdAt, row.name_product, row.line_id);
    if (!scheduleKey) {
      logHourly(`⚠️  WARNING: Tidak ada schedule slot untuk data ${row.name_product} pada ${createdAt}`);
      return;
    }

    if (!scheduleMap.has(scheduleKey)) {
      scheduleMap.set(scheduleKey, []);
    }
    scheduleMap.get(scheduleKey).push({
      ...row,
      parsed_created_at: createdAt,
      schedule_key: scheduleKey
    });
  });

  scheduleMap.forEach((scheduleData, key) => {
    scheduleData.sort((a, b) => a.parsed_created_at - b.parsed_created_at);

    const firstData = scheduleData[0];
    const lastData = scheduleData[scheduleData.length - 1];

    const firstActual = parseInt(firstData.actual) || 0;
    const lastActual = parseInt(lastData.actual) || 0;
    const deltaActual = Math.max(0, lastActual - firstActual);

    scheduleDeltaMap.set(key, {
      ...lastData,
      delta_actual: deltaActual.toString()
    });

    const slot = getScheduleSlot(firstData.parsed_created_at);
    logHourly(`📊 ${firstData.name_product} Line ${firstData.line_id} Schedule ${slot?.label || 'Unknown'}: First=${firstActual}, Last=${lastActual}, Delta=${deltaActual}`);
  });

  return Array.from(scheduleDeltaMap.values());
}

function processHourlyDataByProduct(nameProduct) {
  const hourlyTable = productTableMapHourly[nameProduct];
  if (!hourlyTable) {
    logHourly(`❌ Tidak ada mapping tabel untuk produk: ${nameProduct}`);
    return Promise.resolve();
  }

  const filteredTable = productTableMapFiltered[nameProduct];
  logHourly(`🔄 MEMULAI PROSES SCHEDULE UNTUK PRODUK: ${nameProduct} → SOURCE: ${filteredTable} → TARGET: ${hourlyTable}`);

  return new Promise(async (resolve, reject) => {
    try {
      const lastProcessedTimestamp = await getLastProcessedTimestamp(nameProduct, hourlyTable);

      let selectQuery;
      let queryParams;

      if (lastProcessedTimestamp) {
        selectQuery = `
          SELECT * FROM ${filteredTable}
          WHERE name_product = ? AND created_at > ?
          ORDER BY created_at ASC
        `;
        queryParams = [nameProduct, lastProcessedTimestamp];
      } else {
        selectQuery = `
          SELECT * FROM ${filteredTable}
          WHERE name_product = ?
          ORDER BY created_at ASC
        `;
        queryParams = [nameProduct];
      }

      db.query(selectQuery, queryParams, (err, results) => {
        if (err) {
          logHourly(`❌ ERROR: Gagal mengambil data untuk produk ${nameProduct} - ${err.message}`);
          return reject(err);
        }

        if (results.length === 0) {
          logHourly(`ℹ️  INFO: Tidak ada data baru untuk produk ${nameProduct}`);
          return resolve();
        }

        logHourly(`📊 STATISTIK AWAL (${nameProduct}): Total data baru = ${results.length}`);

        const scheduleDataWithDelta = calculateScheduleDelta(results, lastProcessedTimestamp);
        logHourly(`📊 STATISTIK SCHEDULE (${nameProduct}): Data per schedule dengan delta = ${scheduleDataWithDelta.length}`);

        if (scheduleDataWithDelta.length === 0) {
          logHourly(`ℹ️  INFO: Tidak ada data schedule baru untuk produk ${nameProduct}`);
          return resolve();
        }

        let insertedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        const insertPromises = scheduleDataWithDelta.map(row => {
          return new Promise((res, rej) => {
            const checkQuery = `
              SELECT idPrimary FROM ${hourlyTable}
              WHERE name_product = ? AND line_id = ? AND created_at >= ? AND created_at <= ?
            `;

            const createdAt = row.created_at instanceof Date ? row.created_at : new Date(row.created_at);
            const slot = getScheduleSlot(createdAt);

            if (!slot) {
              logHourly(`❌ ERROR: Tidak dapat menentukan schedule slot untuk ${row.name_product} pada ${createdAt}`);
              errorCount++;
              return rej(new Error('Schedule slot not found'));
            }

            let scheduleStart, scheduleEnd;

            if (slot.start > slot.end) {
              scheduleStart = new Date(createdAt);
              scheduleStart.setHours(Math.floor(slot.start / 60), slot.start % 60, 0, 0);

              scheduleEnd = new Date(createdAt);
              scheduleEnd.setDate(scheduleEnd.getDate() + 1);
              scheduleEnd.setHours(Math.floor(slot.end / 60), slot.end % 60, 59, 999);
            } else {
              scheduleStart = new Date(createdAt);
              scheduleStart.setHours(Math.floor(slot.start / 60), slot.start % 60, 0, 0);

              scheduleEnd = new Date(createdAt);
              scheduleEnd.setHours(Math.floor(slot.end / 60), slot.end % 60, 59, 999);
            }

            db.query(checkQuery, [row.name_product, row.line_id, scheduleStart, scheduleEnd], (err, checkResult) => {
              if (err) {
                logHourly(`❌ ERROR: Gagal mengecek data schedule ${row.name_product} schedule ${slot.label} - ${err.message}`);
                errorCount++;
                return rej(err);
              }

              if (checkResult.length > 0) {
                logHourly(`⏭️  DILEWATI (sudah ada): ${row.name_product} schedule ${slot.label} untuk line ${row.line_id}`);
                skippedCount++;
                return res();
              }

              const insertQuery = `
                INSERT INTO ${hourlyTable} (
                  line_id, pg, line_name, name_product,
                  target, actual, delta_actual, loading_time, efficiency, delay,
                  cycle_time, status, time_trouble, time_trouble_quality, andon, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `;

              const values = [
                row.line_id,
                row.pg,
                row.line_name,
                row.name_product,
                row.target,
                row.actual,
                row.delta_actual,
                row.loading_time,
                row.efficiency,
                row.delay,
                row.cycle_time,
                row.status,
                row.time_trouble,
                row.time_trouble_quality,
                row.andon,
                row.created_at
              ];

              db.query(insertQuery, values, (err) => {
                if (err) {
                  logHourly(`❌ ERROR: Gagal insert data schedule ${row.name_product} schedule ${slot.label} - ${err.message}`);
                  errorCount++;
                  return rej(err);
                }
                insertedCount++;
                const scheduleSlot = getScheduleSlot(new Date(row.created_at));
                logHourly(`✅ BERHASIL INSERT: ${row.name_product} schedule ${scheduleSlot?.label || 'Unknown'} untuk line ${row.line_id} (Delta: ${row.delta_actual})`);
                res();
              });
            });
          });
        });

        Promise.all(insertPromises)
          .then(() => {
            logHourly(`🎉 STATISTIK AKHIR (${nameProduct}): Inserted = ${insertedCount}, Skipped = ${skippedCount}, Error = ${errorCount}`);
            resolve();
          })
          .catch(reject);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function processAllProducts() {
  global.logHourlyInitialized = false;

  const products = Object.keys(productTableMapHourly);

  const processPromises = products.map(product => processHourlyDataByProduct(product));

  Promise.all(processPromises)
    .then(() => {
      logHourly(`✅ SEMUA PROSES SCHEDULE SELESAI.`);
      console.log('✅ Semua proses schedule selesai.');
    })
    .catch(err => {
      logHourly(`❌ ERROR FATAL: ${err.message}`);
      console.error('❌ Error saat proses schedule:', err);
    });
}

// Koneksi ke database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    logFilter(`❌ ERROR KONEKSI DATABASE: ${err.message}`);
    logHourly(`❌ ERROR KONEKSI DATABASE: ${err.message}`);
    return;
  }
  logFilter('🔌 CONNECTED TO DATABASE');
  logHourly('🔌 CONNECTED TO DATABASE');
  console.log('Connected to database.');

  // Run filter once immediately
  logFilter('🚀 Starting initial filtered sync...');
  syncAllProducts();

  // Run hourly once immediately after a short delay
  setTimeout(() => {
    logHourly('🚀 Starting initial hourly process...');
    processAllProducts();
  }, 5000);

  // Schedule the filter job to run every 30 minutes
  cron.schedule('*/30 * * * *', () => {
    logFilter('⏰ Starting scheduled filtered sync...');
    syncAllProducts();
  });

  // Schedule the hourly job to run every hour at minute 10
  cron.schedule('10 * * * *', () => {
    logHourly('⏰ Starting scheduled hourly process...');
    processAllProducts();
  });

  logFilter('⏰ Cron job scheduled to run every 30 minutes for filter');
  logHourly('⏰ Cron job scheduled to run every hour at :10 for hourly');
});