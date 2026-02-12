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

// Fungsi untuk mencatat log filter ke file (overwrite mode)
function logFilter(message) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());
  
  // Simpan ke file log (overwrite mode - file baru setiap kali program dijalankan)
  const logFile = path.join(__dirname, 'filter_log.txt');
  
  // Jika file belum ada atau ini adalah pesan pertama, buat file baru
  if (!global.logInitialized) {
    fs.writeFileSync(logFile, `=== FILTER LOG - ${new Date().toISOString().split('T')[0]} ===\n${logMessage}`);
    global.logInitialized = true;
  } else {
    // Tambahkan ke file yang sudah ada
    fs.appendFileSync(logFile, logMessage);
  }
}

function isDataValid(row) {
  // Log semua data yang masuk untuk debugging
  logFilter(`🔍 MEMERIKSA DATA - idPrimary: ${row.idPrimary}, actual: ${row.actual}, target: ${row.target}, created_at: ${row.created_at}`);
  
  // Cek apakah data memiliki nilai yang valid (bukan kosong/null/invalid)
  
  // Cek actual
  if (!row.actual || 
      row.actual === '' || 
      row.actual === null || 
      row.actual === undefined || 
      row.actual === '-' || 
      row.actual === '0') {
    logFilter(`❌ DIFILTER (actual invalid): idPrimary ${row.idPrimary} - actual: ${row.actual}`);
    return false;
  }
  
  const actualValue = parseInt(row.actual);
  if (actualValue <= 0) {
    logFilter(`❌ DIFILTER (actual <= 0): idPrimary ${row.idPrimary} - actual: ${actualValue}`);
    return false;
  }
  
  // Cek target
  if (!row.target || 
      row.target === '' || 
      row.target === null || 
      row.target === undefined || 
      row.target === '-' || 
      row.target === '0') {
    logFilter(`❌ DIFILTER (target invalid): idPrimary ${row.idPrimary} - target: ${row.target}`);
    return false;
  }
  
  const targetValue = parseInt(row.target);
  if (targetValue <= 0) {
    logFilter(`❌ DIFILTER (target <= 0): idPrimary ${row.idPrimary} - target: ${targetValue}`);
    return false;
  }
  
  // VALIDASI KHUSUS: Abaikan jika pada jam 7:10 lebih dan dibawah jam 10:00 
  // ada nilai actual yang lebih dari 100
  if (row.created_at) {
    let timePart = '';
    let fullTime = '';
    
    // Handle jika created_at adalah objek Date
    if (row.created_at instanceof Date) {
      const hours = row.created_at.getHours().toString().padStart(2, '0');
      const minutes = row.created_at.getMinutes().toString().padStart(2, '0');
      const seconds = row.created_at.getSeconds().toString().padStart(2, '0');
      timePart = `${hours}:${minutes}:${seconds}`;
      fullTime = row.created_at.toISOString().replace('T', ' ').substring(0, 19);
    }
    // Handle jika created_at adalah string
    else if (typeof row.created_at === 'string') {
      fullTime = row.created_at;
      if (row.created_at.includes(' ')) {
        timePart = row.created_at.split(' ')[1]; // Ambil bagian waktu (HH:MM:SS)
      }
    }
    // Handle jika created_at adalah objek timestamp dari MySQL
    else if (typeof row.created_at === 'object' && row.created_at !== null) {
      // Konversi ke string dan ambil waktu
      const dateString = row.created_at.toString();
      fullTime = dateString;
      if (dateString.includes(' ')) {
        timePart = dateString.split(' ')[1];
      }
    }
    
    // Cek jika waktu antara 07:10:00 - 10:00:00 dan actual > 100
    if (timePart >= '07:10:00' && timePart < '10:00:00' && actualValue > 100) {
      logFilter(`❌ DIFILTER (jam 7:10-10:00 & actual > 100): idPrimary ${row.idPrimary} - actual: ${actualValue}, waktu: ${timePart}`);
      return false;
    }
    
    // Log data yang lolos semua filter
    logFilter(`✅ VALID: idPrimary ${row.idPrimary} - actual: ${actualValue}, target: ${targetValue}, waktu: ${timePart || fullTime}`);
    return true;
  }
  
  logFilter(`✅ VALID (tanpa waktu): idPrimary ${row.idPrimary} - actual: ${actualValue}, target: ${targetValue}`);
  return true;
}

function sync4N13Data() {
  // Inisialisasi log file baru
  global.logInitialized = false;
  
  // Ambil data dari common_rail_3 dengan name_product = '4N13' diurutkan berdasarkan created_at ASC
  const selectQuery = `
    SELECT * FROM common_rail_3 
    WHERE name_product = '4N13'
    ORDER BY created_at ASC
  `;

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error fetching data from common_rail_3:', err);
      logFilter(`ERROR: Gagal mengambil data dari common_rail_3 - ${err.message}`);
      db.end();
      return;
    }

    if (results.length === 0) {
      logFilter('INFO: Tidak ada data dengan name_product = 4N13 di common_rail_3');
      console.log('Tidak ada data dengan name_product = 4N13 di common_rail_3');
      db.end();
      return;
    }

    logFilter(`📊 STATISTIK AWAL: Total data ditemukan = ${results.length}`);

    // Filter hanya data yang valid
    const validData = results.filter(row => isDataValid(row));
    
    logFilter(`📊 STATISTIK AKHIR: Data valid = ${validData.length}, Data difilter = ${results.length - validData.length}`);

    if (validData.length === 0) {
      logFilter('INFO: Tidak ada data valid dengan name_product = 4N13 untuk disinkronkan');
      console.log('Tidak ada data valid dengan name_product = 4N13 untuk disinkronkan');
      db.end();
      return;
    }

    console.log(`Ditemukan ${results.length} total data, ${validData.length} data valid untuk disinkronkan`);

    // Variable untuk menyimpan actual sebelumnya (berdasarkan urutan waktu)
    let prevActual = null;
    let insertedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    const insertPromises = validData.map((row, index) => {
      return new Promise((resolve, reject) => {
        // Cek apakah data sudah ada berdasarkan idPrimary
        const checkQuery = `
          SELECT idPrimary FROM common_rail_3_4n13 WHERE idPrimary = ?
        `;

        db.query(checkQuery, [row.idPrimary], (err, checkResult) => {
          if (err) {
            logFilter(`ERROR: Gagal mengecek data idPrimary ${row.idPrimary} - ${err.message}`);
            errorCount++;
            return reject(err);
          }

          if (checkResult.length > 0) {
            logFilter(`⏭️  DILEWATI (sudah ada): idPrimary ${row.idPrimary}`);
            skippedCount++;
            console.log(`Data dengan idPrimary ${row.idPrimary} sudah ada di common_rail_3_4n13`);
            resolve();
          } else {
            // Double check validasi data
            if (!isDataValid(row)) {
              logFilter(`⏭️  DILEWATI (tidak valid): idPrimary ${row.idPrimary}`);
              skippedCount++;
              console.log(`Melewati idPrimary ${row.idPrimary} karena data tidak valid`);
              resolve();
              return;
            }

            // Hitung delta_actual berdasarkan actual sebelumnya (SELALU dihitung)
            const currentActual = parseInt(row.actual);
            let delta_actual = null;
            
            if (prevActual !== null) {
              delta_actual = currentActual - prevActual;
              logFilter(`🔢 MENGHITUNG DELTA: current(${currentActual}) - previous(${prevActual}) = ${delta_actual} untuk idPrimary ${row.idPrimary}`);
            } else {
              logFilter(`🔢 DELTA PERTAMA: ${currentActual} untuk idPrimary ${row.idPrimary} (tidak ada data sebelumnya)`);
            }
            
            // Update prevActual untuk iterasi berikutnya
            prevActual = currentActual;

            const insertQuery = `
              INSERT INTO common_rail_3_4n13 (
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
                logFilter(`ERROR: Gagal insert idPrimary ${row.idPrimary} - ${err.message}`);
                errorCount++;
                return reject(err);
              }
              insertedCount++;
              logFilter(`✅ BERHASIL INSERT: idPrimary ${row.idPrimary} dengan delta_actual = ${delta_actual}`);
              console.log(`✅ Berhasil menambahkan data idPrimary ${row.idPrimary} ke common_rail_3_4n13 dengan delta_actual = ${delta_actual}`);
              resolve();
            });
          }
        });
      });
    });

    Promise.all(insertPromises)
      .then(() => {
        logFilter(`🎉 STATISTIK AKHIR SINKRONISASI:`);
        logFilter(`   • Data berhasil diinsert: ${insertedCount}`);
        logFilter(`   • Data dilewati (sudah ada): ${skippedCount}`);
        logFilter(`   • Data error: ${errorCount}`);
        logFilter(`✅ Sinkronisasi selesai.`);
        console.log('✅ Sinkronisasi selesai.');
        db.end();
      })
      .catch(err => {
        logFilter(`❌ ERROR FATAL: ${err.message}`);
        console.error('❌ Error saat sinkronisasi:', err);
        db.end();
      });
  });
}

// Koneksi ke database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    logFilter(`ERROR KONEKSI DATABASE: ${err.message}`);
    return;
  }
  logFilter('🔌 CONNECTED TO DATABASE');
  console.log('Connected to database.');
  sync4N13Data();
});