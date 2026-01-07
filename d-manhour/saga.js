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
