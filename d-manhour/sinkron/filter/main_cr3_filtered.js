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

// Mapping name_product ke tabel tujuan (semua produk ke common_rail_3_filtered)
const productTableMap = {
  '4N13': 'common_rail_3_filtered',
  '902FI': 'common_rail_3_filtered',
  'JDE 20': 'common_rail_3_filtered',
  'RT56': 'common_rail_3_filtered',
  'VM': 'common_rail_3_filtered',
  'VM USA': 'common_rail_3_filtered'
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

  // Validasi actual
  if (!row.actual || row.actual === '' || row.actual === null || row.actual === undefined || row.actual === '-' || row.actual === '0') {
    logFilter(`❌ DIFILTER (actual invalid): idPrimary ${row.idPrimary} - actual: ${row.actual}`);
    return false;
  }

  const actualValue = parseInt(row.actual);
  if (actualValue <= 0) {
    logFilter(`❌ DIFILTER (actual <= 0): idPrimary ${row.idPrimary} - actual: ${actualValue}`);
    return false;
  }

  // Validasi target
  if (!row.target || row.target === '' || row.target === null || row.target === undefined || row.target === '-' || row.target === '0') {
    logFilter(`❌ DIFILTER (target invalid): idPrimary ${row.idPrimary} - target: ${row.target}`);
    return false;
  }

  const targetValue = parseInt(row.target);
  if (targetValue <= 0) {
    logFilter(`❌ DIFILTER (target <= 0): idPrimary ${row.idPrimary} - target: ${targetValue}`);
    return false;
  }

  // Parsing waktu dari created_at
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

  // Filter data antara jam 18:30:00 hingga 19:00:00
  if (timePart >= '18:30:00' && timePart <= '19:00:00') {
    logFilter(`⏭️  DILEWATI (jam 18:30 - 19:00): idPrimary ${row.idPrimary} - waktu: ${timePart}`);
    return false;
  }

  // Filter data pada jam 07:10 - 10:00 dengan actual > 100
  if (timePart >= '07:10:00' && timePart < '10:00:00' && actualValue > 100) {
    logFilter(`❌ DIFILTER (jam 7:10-10:00 & actual > 100): idPrimary ${row.idPrimary} - actual: ${actualValue}, waktu: ${timePart}`);
    return false;
  }

  logFilter(`✅ VALID: idPrimary ${row.idPrimary} - actual: ${actualValue}, target: ${targetValue}, waktu: ${timePart || fullTime}`);
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

      let insertedCount = 0;
      let skippedCount = 0;
      let errorCount = 0;

      const insertPromises = validData.map(row => {
        return new Promise((res, rej) => {
          // Pengecekan untuk menghindari duplikasi data
          const checkQuery = `SELECT idPrimary FROM common_rail_3_filtered WHERE idPrimary = ? OR (name_product = ? AND created_at = ?)`;

          db.query(checkQuery, [row.idPrimary, row.name_product, row.created_at], (err, checkResult) => {
            if (err) {
              logFilter(`❌ ERROR: Gagal mengecek data ${row.idPrimary} di common_rail_3_filtered - ${err.message}`);
              errorCount++;
              return rej(err);
            }

            if (checkResult.length > 0) {
              logFilter(`⏭️  DILEWATI (sudah ada): idPrimary ${row.idPrimary} atau data dengan waktu yang sama`);
              skippedCount++;
              return res();
            }

            const insertQuery = `
              INSERT INTO common_rail_3_filtered (
                idPrimary, line_id, pg, line_name, name_product,
                target, actual, loading_time, efficiency, delay,
                cycle_time, status, time_trouble, time_trouble_quality, andon, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
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
            ];

            db.query(insertQuery, values, (err) => {
              if (err) {
                logFilter(`❌ ERROR: Gagal insert idPrimary ${row.idPrimary} ke common_rail_3_filtered - ${err.message}`);
                errorCount++;
                return rej(err);
              }
              insertedCount++;
              logFilter(`✅ BERHASIL INSERT: idPrimary ${row.idPrimary} ke common_rail_3_filtered`);
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