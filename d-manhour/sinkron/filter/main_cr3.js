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
  '4N13': 'common_rail_3_4n13',
  '902FI': 'common_rail_3_902f_i',
  'JDE 20': 'common_rail_3_jde20',
  'RT56': 'common_rail_3_rt56',
  'VM': 'common_rail_3_vm',
  'VM USA': 'common_rail_3_vm_usa_a'
};

// Fungsi untuk mencatat log filter ke file (overwrite mode)
function logFilter(message) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());

  const logFile = path.join(__dirname, 'filter_log.txt');

  if (!global.logInitialized) {
    fs.writeFileSync(logFile, `=== FILTER LOG - ${new Date().toISOString().split('T')[0]} ===\n${logMessage}`);
    global.logInitialized = true;
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

  if (row.created_at) {
    let timePart = '';
    let fullTime = '';

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

    if (timePart >= '07:10:00' && timePart < '10:00:00' && actualValue > 100) {
      logFilter(`❌ DIFILTER (jam 7:10-10:00 & actual > 100): idPrimary ${row.idPrimary} - actual: ${actualValue}, waktu: ${timePart}`);
      return false;
    }

    logFilter(`✅ VALID: idPrimary ${row.idPrimary} - actual: ${actualValue}, target: ${targetValue}, waktu: ${timePart || fullTime}`);
    return true;
  }

  logFilter(`✅ VALID (tanpa waktu): idPrimary ${row.idPrimary} - actual: ${actualValue}, target: ${targetValue}`);
  return true;
}

function syncDataByProduct(nameProduct) {
  const tableName = productTableMap[nameProduct];
  if (!tableName) {
    logFilter(`❌ Tidak ada mapping tabel untuk produk: ${nameProduct}`);
    return Promise.resolve();
  }

  logFilter(`🔄 MEMULAI SINKRONISASI UNTUK PRODUK: ${nameProduct} → TABEL: ${tableName}`);

  return new Promise((resolve, reject) => {
    const selectQuery = `
      SELECT * FROM common_rail_3 
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

      let prevActual = null;
      let insertedCount = 0;
      let skippedCount = 0;
      let errorCount = 0;

      const insertPromises = validData.map(row => {
        return new Promise((res, rej) => {
          const checkQuery = `SELECT idPrimary FROM ${tableName} WHERE idPrimary = ?`;

          db.query(checkQuery, [row.idPrimary], (err, checkResult) => {
            if (err) {
              logFilter(`❌ ERROR: Gagal mengecek idPrimary ${row.idPrimary} di ${tableName} - ${err.message}`);
              errorCount++;
              return rej(err);
            }

            if (checkResult.length > 0) {
              logFilter(`⏭️  DILEWATI (sudah ada): idPrimary ${row.idPrimary}`);
              skippedCount++;
              return res();
            }

            if (!isDataValid(row)) {
              logFilter(`⏭️  DILEWATI (tidak valid): idPrimary ${row.idPrimary}`);
              skippedCount++;
              return res();
            }

            const currentActual = parseInt(row.actual);
            let delta_actual = null;

            if (prevActual !== null) {
              delta_actual = currentActual - prevActual;
              logFilter(`🔢 MENGHITUNG DELTA: current(${currentActual}) - previous(${prevActual}) = ${delta_actual} untuk idPrimary ${row.idPrimary}`);
            } else {
              logFilter(`🔢 DELTA PERTAMA: ${currentActual} untuk idPrimary ${row.idPrimary}`);
            }

            prevActual = currentActual;

            const insertQuery = `
              INSERT INTO ${tableName} (
                idPrimary, line_id, pg, line_name, name_product,
                target, actual, delta_actual, loading_time, efficiency, delay,
                cycle_time, status, time_trouble, time_trouble_quality, andon, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
              row.idPrimary,
              row.line_id,
              row.pg,
              row.line_name,
              row.name_product,
              row.target,
              row.actual,
              delta_actual !== null ? delta_actual.toString() : null,
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
                logFilter(`❌ ERROR: Gagal insert idPrimary ${row.idPrimary} ke ${tableName} - ${err.message}`);
                errorCount++;
                return rej(err);
              }
              insertedCount++;
              logFilter(`✅ BERHASIL INSERT: idPrimary ${row.idPrimary} ke ${tableName} dengan delta_actual = ${delta_actual}`);
              res();
            });
          });
        });
      });

      Promise.all(insertPromises)
        .then(() => {
          logFilter(`🎉 STATISTIK AKHIR (${nameProduct}): Inserted = ${insertedCount}, Skipped = ${skippedCount}, Error = ${errorCount}`);
          resolve();
        })
        .catch(reject);
    });
  });
}

// Fungsi utama sinkronisasi semua produk
function syncAllProducts() {
  global.logInitialized = false;

  const products = Object.keys(productTableMap);

  const syncPromises = products.map(product => syncDataByProduct(product));

  Promise.all(syncPromises)
    .then(() => {
      logFilter(`✅ SEMUA SINKRONISASI SELESAI.`);
      console.log('✅ Semua sinkronisasi selesai.');
      db.end();
    })
    .catch(err => {
      logFilter(`❌ ERROR FATAL: ${err.message}`);
      console.error('❌ Error saat sinkronisasi:', err);
      db.end();
    });
}

// Koneksi ke database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    logFilter(`❌ ERROR KONEKSI DATABASE: ${err.message}`);
    return;
  }
  logFilter('🔌 CONNECTED TO DATABASE');
  console.log('Connected to database.');
  syncAllProducts();
});