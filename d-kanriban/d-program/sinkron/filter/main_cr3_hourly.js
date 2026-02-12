const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Konfigurasi koneksi database
const db = mysql.createConnection({
  host: '169.254.33.24',
  user: 'otics_tps',
  password: 'sukatno_ali',
  database: 'database_tps_produksi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Mapping name_product ke tabel tujuan
const productTableMap = {
  '4N13': 'common_rail_3_hourly',
  '902FI': 'common_rail_3_hourly',
  'JDE 20': 'common_rail_3_hourly',
  'RT56': 'common_rail_3_hourly',
  'VM': 'common_rail_3_hourly',
  'VM USA': 'common_rail_3_hourly'
};

// Fungsi untuk mencatat log
function logMessage(message) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());

  const logFile = path.join(__dirname, 'hourly_log.txt');

  if (!global.logInitialized) {
    fs.writeFileSync(logFile, `=== HOURLY PROCESS LOG - ${new Date().toISOString().split('T')[0]} ===\n${logMessage}`);
    global.logInitialized = true;
  } else {
    fs.appendFileSync(logFile, logMessage);
  }
}

// Fungsi untuk mendapatkan timestamp terakhir data yang sudah diproses
function getLastProcessedTimestamp(nameProduct) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT MAX(created_at) as last_processed 
      FROM common_rail_3_hourly 
      WHERE name_product = ?
    `;

    db.query(query, [nameProduct], (err, results) => {
      if (err) {
        logMessage(`❌ ERROR: Gagal mendapatkan timestamp terakhir untuk ${nameProduct} - ${err.message}`);
        return reject(err);
      }

      const lastProcessed = results[0]?.last_processed;
      logMessage(`🕒 Timestamp terakhir untuk ${nameProduct}: ${lastProcessed || 'Tidak ada data'}`);
      resolve(lastProcessed);
    });
  });
}

// Fungsi untuk mengurutkan data berdasarkan waktu
function sortDataByTime(data) {
  return data.sort((a, b) => {
    const timeA = a.created_at instanceof Date ? a.created_at : new Date(a.created_at);
    const timeB = b.created_at instanceof Date ? b.created_at : new Date(b.created_at);
    return timeA - timeB;
  });
}

// Fungsi untuk menghitung delta actual per jam (hanya untuk data baru)
function calculateHourlyDelta(data, lastProcessedTimestamp = null) {
  const sortedData = sortDataByTime(data);
  const hourlyMap = new Map();
  const hourlyDeltaMap = new Map();

  // Filter data hanya yang belum diproses
  let filteredData = sortedData;
  if (lastProcessedTimestamp) {
    filteredData = sortedData.filter(row => {
      const rowTime = row.created_at instanceof Date ? row.created_at : new Date(row.created_at);
      return rowTime > new Date(lastProcessedTimestamp);
    });
    logMessage(`📊 Data baru setelah ${lastProcessedTimestamp}: ${filteredData.length} records`);
  }

  if (filteredData.length === 0) {
    return [];
  }

  // Kelompokkan data per jam untuk data baru saja
  filteredData.forEach(row => {
    let createdAt;
    if (row.created_at instanceof Date) {
      createdAt = row.created_at;
    } else if (typeof row.created_at === 'string') {
      createdAt = new Date(row.created_at);
    } else {
      return;
    }

    const hourKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}-${String(createdAt.getDate()).padStart(2, '0')} ${String(createdAt.getHours()).padStart(2, '0')}`;
    const mapKey = `${row.name_product}_${row.line_id}_${hourKey}`;

    if (!hourlyMap.has(mapKey)) {
      hourlyMap.set(mapKey, []);
    }
    hourlyMap.get(mapKey).push({
      ...row,
      parsed_created_at: createdAt,
      hour_key: hourKey
    });
  });

  // Hitung delta actual untuk setiap jam
  hourlyMap.forEach((hourlyData, key) => {
    // Urutkan data dalam jam tersebut
    hourlyData.sort((a, b) => a.parsed_created_at - b.parsed_created_at);
    
    // Ambil data pertama dan terakhir dalam jam tersebut
    const firstData = hourlyData[0];
    const lastData = hourlyData[hourlyData.length - 1];
    
    // Hitung delta actual
    const firstActual = parseInt(firstData.actual) || 0;
    const lastActual = parseInt(lastData.actual) || 0;
    const deltaActual = lastActual - firstActual;

    // Simpan data dengan delta
    hourlyDeltaMap.set(key, {
      ...lastData, // Gunakan data terakhir
      delta_actual: deltaActual.toString()
    });

    logMessage(`📊 ${firstData.name_product} Line ${firstData.line_id} Jam ${firstData.hour_key}: First=${firstActual}, Last=${lastActual}, Delta=${deltaActual}`);
  });

  return Array.from(hourlyDeltaMap.values());
}

function processHourlyDataByProduct(nameProduct) {
  const tableName = productTableMap[nameProduct];
  if (!tableName) {
    logMessage(`❌ Tidak ada mapping tabel untuk produk: ${nameProduct}`);
    return Promise.resolve();
  }

  logMessage(`🔄 MEMULAI PROSES HOURLY UNTUK PRODUK: ${nameProduct} → TABEL: ${tableName}`);

  return new Promise(async (resolve, reject) => {
    try {
      // Dapatkan timestamp terakhir yang sudah diproses
      const lastProcessedTimestamp = await getLastProcessedTimestamp(nameProduct);

      // Query untuk mengambil data dari common_rail_3_filtered (hanya data baru)
      let selectQuery;
      let queryParams;

      if (lastProcessedTimestamp) {
        selectQuery = `
          SELECT * FROM common_rail_3_filtered 
          WHERE name_product = ? AND created_at > ?
          ORDER BY created_at ASC
        `;
        queryParams = [nameProduct, lastProcessedTimestamp];
      } else {
        selectQuery = `
          SELECT * FROM common_rail_3_filtered 
          WHERE name_product = ?
          ORDER BY created_at ASC
        `;
        queryParams = [nameProduct];
      }

      db.query(selectQuery, queryParams, (err, results) => {
        if (err) {
          logMessage(`❌ ERROR: Gagal mengambil data untuk produk ${nameProduct} - ${err.message}`);
          return reject(err);
        }

        if (results.length === 0) {
          logMessage(`ℹ️  INFO: Tidak ada data baru untuk produk ${nameProduct}`);
          return resolve();
        }

        logMessage(`📊 STATISTIK AWAL (${nameProduct}): Total data baru = ${results.length}`);

        // Hitung delta actual per jam
        const hourlyDataWithDelta = calculateHourlyDelta(results, lastProcessedTimestamp);
        logMessage(`📊 STATISTIK HOURLY (${nameProduct}): Data per jam dengan delta = ${hourlyDataWithDelta.length}`);

        if (hourlyDataWithDelta.length === 0) {
          logMessage(`ℹ️  INFO: Tidak ada data hourly baru untuk produk ${nameProduct}`);
          return resolve();
        }

        let insertedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        const insertPromises = hourlyDataWithDelta.map(row => {
          return new Promise((res, rej) => {
            // Pengecekan untuk menghindari duplikasi data
            const checkQuery = `SELECT idPrimary FROM common_rail_3_hourly WHERE name_product = ? AND line_id = ? AND DATE_FORMAT(created_at, '%Y-%m-%d %H') = ?`;

            const createdAt = row.created_at instanceof Date ? row.created_at : new Date(row.created_at);
            const hourFormat = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}-${String(createdAt.getDate()).padStart(2, '0')} ${String(createdAt.getHours()).padStart(2, '0')}`;

            db.query(checkQuery, [row.name_product, row.line_id, hourFormat], (err, checkResult) => {
              if (err) {
                logMessage(`❌ ERROR: Gagal mengecek data hourly ${row.name_product} jam ${hourFormat} - ${err.message}`);
                errorCount++;
                return rej(err);
              }

              if (checkResult.length > 0) {
                logMessage(`⏭️  DILEWATI (sudah ada): ${row.name_product} jam ${hourFormat} untuk line ${row.line_id}`);
                skippedCount++;
                return res();
              }

              const insertQuery = `
                INSERT INTO common_rail_3_hourly (
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
                  logMessage(`❌ ERROR: Gagal insert data hourly ${row.name_product} jam ${hourFormat} - ${err.message}`);
                  errorCount++;
                  return rej(err);
                }
                insertedCount++;
                logMessage(`✅ BERHASIL INSERT: ${row.name_product} jam ${hourFormat} untuk line ${row.line_id} (Delta: ${row.delta_actual})`);
                res();
              });
            });
          });
        });

        Promise.all(insertPromises)
          .then(() => {
            logMessage(`🎉 STATISTIK AKHIR (${nameProduct}): Inserted = ${insertedCount}, Skipped = ${skippedCount}, Error = ${errorCount}`);
            resolve();
          })
          .catch(reject);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Fungsi utama proses semua produk
function processAllProducts() {
  global.logInitialized = false;

  const products = Object.keys(productTableMap);

  const processPromises = products.map(product => processHourlyDataByProduct(product));

  Promise.all(processPromises)
    .then(() => {
      logMessage(`✅ SEMUA PROSES HOURLY SELESAI.`);
      console.log('✅ Semua proses hourly selesai.');
      db.end();
    })
    .catch(err => {
      logMessage(`❌ ERROR FATAL: ${err.message}`);
      console.error('❌ Error saat proses hourly:', err);
      db.end();
    });
}

// Koneksi ke database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    logMessage(`❌ ERROR KONEKSI DATABASE: ${err.message}`);
    return;
  }
  logMessage('🔌 CONNECTED TO DATABASE');
  console.log('Connected to database.');
  processAllProducts();
});