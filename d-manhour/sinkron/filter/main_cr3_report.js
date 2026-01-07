const mysql = require('mysql2/promise');
const fs = require('fs').promises;

// Konfigurasi koneksi database
const dbConfig = {
  host: '169.254.33.24',
  user: 'otics_tps',
  password: 'sukatno_ali',
  database: 'database_tps_produksi',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Mapping produk ke tabel
const productTableMap = {
  '4N13': { data: 'common_rail_3_4n13', report: 'common_rail_3_4n13_report' },
  '902FI': { data: 'common_rail_3_902f_i', report: 'common_rail_3_902f_i_report' },
  'JDE 20': { data: 'common_rail_3_jde20', report: 'common_rail_3_jde20_report' },
  'RT56': { data: 'common_rail_3_rt56', report: 'common_rail_3_rt56_report' },
  'VM': { data: 'common_rail_3_vm', report: 'common_rail_3_vm_report' },
  'VM USA': { data: 'common_rail_3_vm_usa_a', report: 'common_rail_3_vm_usa_a_report' }
};

class ProductionCycleDetector {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection(dbConfig);
      console.log('✅ Berhasil terhubung ke database');
    } catch (error) {
      console.error('❌ Error koneksi database:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log('🔌 Koneksi database ditutup');
    }
  }

  // Fungsi untuk menentukan shift berdasarkan waktu
  getShift(time) {
    const hour = time.getHours();
    const minute = time.getMinutes();
    const totalMinutes = hour * 60 + minute;

    // Shift 1: 07.10 - 19.50
    const shift1Start = 7 * 60 + 10;  // 07:10
    const shift1End = 19 * 60 + 50;   // 19:50

    if (totalMinutes >= shift1Start && totalMinutes < shift1End) {
      return 'Shift 1';
    } else {
      return 'Shift 2';
    }
  }

  // Fungsi untuk menghitung durasi shift yang benar (maksimal 11 jam = 660 menit)
  calculateShiftDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // Hitung durasi sebenarnya dalam menit
    const actualDurationMinutes = Math.floor((end - start) / 60000);
    
    // Batasi maksimal 11 jam (660 menit) = 8 jam normal + 3 jam lembur
    const maxDurationMinutes = Math.min(actualDurationMinutes, 660);
    
    const hours = Math.floor(maxDurationMinutes / 60);
    const minutes = maxDurationMinutes % 60;
    
    return {
      minutes: maxDurationMinutes,
      formatted: `${hours}h ${minutes}m`
    };
  }

  async detectCyclesForProduct(productName, lineId = '3', startDate = null, endDate = null) {
    try {
      const tableInfo = productTableMap[productName];
      if (!tableInfo) {
        console.log(`⚠️ Tidak ada mapping tabel untuk produk: ${productName}`);
        return [];
      }

      console.log(`🔄 Mendeteksi siklus untuk produk: ${productName} (Tabel: ${tableInfo.data})`);

      let query = `
        SELECT 
          idPrimary,
          line_id,
          line_name,
          name_product,
          actual,
          target,
          delta_actual,
          efficiency,
          created_at
        FROM ${tableInfo.data}
        WHERE line_id = ?
      `;

      const queryParams = [lineId];

      if (startDate && endDate) {
        query += ` AND created_at BETWEEN ? AND ?`;
        queryParams.push(startDate, endDate);
      } else if (startDate) {
        query += ` AND created_at >= ?`;
        queryParams.push(startDate);
      } else if (endDate) {
        query += ` AND created_at <= ?`;
        queryParams.push(endDate);
      }

      query += ` ORDER BY created_at ASC`;

      const [rows] = await this.connection.execute(query, queryParams);

      if (rows.length === 0) {
        console.log(`⚠️ Tidak ada data ditemukan untuk ${productName}`);
        return [];
      }

      // Validasi: pastikan data diurutkan berdasarkan waktu
      rows.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      // Filter data berdasarkan delta_actual yang tidak ekstrem
      const filteredRows = this.filterExtremeDeltaActual(rows);
      console.log(`📊 ${productName} - Data awal: ${rows.length} record, Setelah filter: ${filteredRows.length} record`);

      const cycles = this.processCycles(filteredRows);
      return cycles;

    } catch (error) {
      console.error(`❌ Error saat mendeteksi siklus untuk ${productName}:`, error);
      throw error;
    }
  }

  filterExtremeDeltaActual(data) {
    const extremeThreshold = 100;
    return data.filter(record => {
      if (record.delta_actual === null || record.delta_actual === undefined || record.delta_actual === '') {
        return true;
      }
      
      const deltaActual = parseInt(record.delta_actual, 10);
      return !isNaN(deltaActual) && Math.abs(deltaActual) <= extremeThreshold;
    });
  }

  processCycles(data) {
    const cycles = [];
    let currentCycle = null;
    let previousActual = null;
    const threshold = 100;

    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      const actual = parseInt(record.actual, 10);
      const time = new Date(record.created_at);
      const shift = this.getShift(time);

      // Cek jika ini adalah reset (turun drastis)
      if (previousActual === null || actual < previousActual - threshold) {
        // Tutup siklus sebelumnya
        if (currentCycle !== null) {
          currentCycle.endRecord = data[i - 1];
          currentCycle.endActual = parseInt(data[i - 1].actual);
          currentCycle.endTime = data[i - 1].created_at;
          currentCycle.totalProduced = currentCycle.endActual - currentCycle.startActual;
          currentCycle.recordCount = currentCycle.records.length;
          
          // Hitung durasi shift yang benar
          const shiftDuration = this.calculateShiftDuration(
            currentCycle.startTime,
            currentCycle.endTime
          );
          currentCycle.duration = {
            minutes: shiftDuration.minutes,
            formatted: shiftDuration.formatted
          };
          
          cycles.push(currentCycle);
        }

        // Mulai siklus baru
        currentCycle = {
          cycleNumber: cycles.length + 1,
          startRecord: record,
          startActual: actual,
          startTime: record.created_at,
          endRecord: null,
          endActual: null,
          endTime: null,
          records: [record],
          lineId: record.line_id,
          lineName: record.line_name,
          product: record.name_product,
          shift: shift
        };
      } else {
        // Lanjutkan siklus
        if (currentCycle) {
          currentCycle.records.push(record);
        }
      }

      previousActual = actual;
    }

    // Tutup siklus terakhir
    if (currentCycle !== null) {
      currentCycle.endRecord = data[data.length - 1];
      currentCycle.endActual = parseInt(data[data.length - 1].actual);
      currentCycle.endTime = data[data.length - 1].created_at;
      currentCycle.totalProduced = currentCycle.endActual - currentCycle.startActual;
      currentCycle.recordCount = currentCycle.records.length;
      
      // Hitung durasi shift yang benar
      const shiftDuration = this.calculateShiftDuration(
        currentCycle.startTime,
        currentCycle.endTime
      );
      currentCycle.duration = {
        minutes: shiftDuration.minutes,
        formatted: shiftDuration.formatted
      };
      
      cycles.push(currentCycle);
    }

    return cycles;
  }

  displayCycleSummary(cycles, productName) {
    console.log(`\n📊 RINGKASAN SIKLUS PRODUKSI - ${productName}`);
    console.log('=' .repeat(80));
    
    cycles.forEach(cycle => {
      console.log(`\n🔄 Siklus #${cycle.cycleNumber}`);
      console.log(`   Line: ${cycle.lineName} (ID: ${cycle.lineId})`);
      console.log(`   Produk: ${cycle.product}`);
      console.log(`   Shift: ${cycle.shift}`);
      console.log(`   Waktu Mulai: ${new Date(cycle.startTime).toLocaleString('id-ID')}`);
      console.log(`   Waktu Selesai: ${new Date(cycle.endTime).toLocaleString('id-ID')}`);
      console.log(`   Durasi: ${cycle.duration.formatted} (${cycle.duration.minutes} menit)`);
      console.log(`   Actual Awal: ${cycle.startActual}`);
      console.log(`   Actual Akhir: ${cycle.endActual}`);
      console.log(`   Total Produksi: ${cycle.totalProduced} unit`);
      console.log(`   Jumlah Record: ${cycle.recordCount}`);
      console.log('-'.repeat(80));
    });

    const totalProduction = cycles.reduce((sum, c) => sum + c.totalProduced, 0);
    const avgProduction = cycles.length > 0 ? totalProduction / cycles.length : 0;

    console.log(`\n📈 STATISTIK KESELURUHAN - ${productName}`);
    console.log(`   Total Siklus: ${cycles.length}`);
    console.log(`   Total Produksi: ${totalProduction} unit`);
    console.log(`   Rata-rata Produksi per Siklus: ${avgProduction.toFixed(2)} unit`);
    console.log('=' .repeat(80));
  }

  async exportToJSON(cycles, productName, filename = null) {
    try {
      const defaultFilename = `production_cycles_${productName.replace(/\s+/g, '_')}.json`;
      const exportFilename = filename || defaultFilename;
      
      const exportData = {
        exportDate: new Date().toISOString(),
        productName: productName,
        totalCycles: cycles.length,
        cycles: cycles.map(cycle => ({
          cycleNumber: cycle.cycleNumber,
          lineId: cycle.lineId,
          lineName: cycle.lineName,
          product: cycle.product,
          shift: cycle.shift,
          startTime: cycle.startTime,
          endTime: cycle.endTime,
          duration: cycle.duration.formatted,
          durationMinutes: cycle.duration.minutes,
          startActual: cycle.startActual,
          endActual: cycle.endActual,
          totalProduced: cycle.totalProduced,
          recordCount: cycle.recordCount
        }))
      };

      await fs.writeFile(exportFilename, JSON.stringify(exportData, null, 2));
      console.log(`\n✅ Data ${productName} berhasil diekspor ke ${exportFilename}`);
      
    } catch (error) {
      console.error('❌ Error saat mengekspor data:', error);
    }
  }

  async getNextId(tableName) {
    try {
      const query = `SELECT MAX(idPrimary) as maxId FROM ${tableName}`;
      const [rows] = await this.connection.execute(query);
      return rows[0].maxId ? rows[0].maxId + 1 : 1;
    } catch (error) {
      console.error('❌ Error mendapatkan ID berikutnya:', error);
      return 1;
    }
  }

  async saveCycleSummaryToDatabase(cycles, productName, lineId = '3') {
    try {
      const tableInfo = productTableMap[productName];
      if (!tableInfo) {
        console.log(`⚠️ Tidak ada mapping tabel report untuk produk: ${productName}`);
        return;
      }

      // Dapatkan ID berikutnya
      let nextId = await this.getNextId(tableInfo.report);

      // Query untuk insert data
      const insertQuery = `
        INSERT INTO ${tableInfo.report} 
        (idPrimary, cycle_number, line_id, line_name, product_name, shift, start_time, end_time, 
         duration_minutes, start_actual, end_actual, total_produced, record_count, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      let insertedCount = 0;
      
      for (const cycle of cycles) {
        try {
          await this.connection.execute(insertQuery, [
            nextId,
            cycle.cycleNumber,
            cycle.lineId,
            cycle.lineName,
            cycle.product,
            cycle.shift,
            cycle.startTime,
            cycle.endTime,
            cycle.duration.minutes, // Gunakan durasi yang sudah dikoreksi
            cycle.startActual,
            cycle.endActual,
            cycle.totalProduced,
            cycle.recordCount
          ]);

          insertedCount++;
          nextId++;
        } catch (error) {
          console.error(`❌ Error menyimpan siklus ${productName}:`, error);
        }
      }

      console.log(`\n✅ ${insertedCount} siklus ${productName} disimpan ke database`);
      
    } catch (error) {
      console.error(`❌ Error saat menyimpan ${productName} ke database:`, error);
      throw error;
    }
  }

  async viewExistingReports(productName) {
    try {
      const tableInfo = productTableMap[productName];
      if (!tableInfo) {
        console.log(`⚠️ Tidak ada mapping tabel report untuk produk: ${productName}`);
        return [];
      }

      const query = `
        SELECT 
          idPrimary as 'ID',
          cycle_number as 'Cycle Number',
          line_id as 'Line ID',
          line_name as 'Line Name',
          product_name as 'Product',
          shift as 'Shift',
          start_time as 'Start Time',
          end_time as 'End Time',
          duration_minutes as 'Duration (min)',
          start_actual as 'Start Actual',
          end_actual as 'End Actual',
          total_produced as 'Total Produced',
          record_count as 'Record Count',
          created_at as 'Created At'
        FROM ${tableInfo.report} 
        ORDER BY start_time DESC 
        LIMIT 10
      `;
      
      const [rows] = await this.connection.execute(query);
      
      console.log(`\n📋 10 Data Terakhir di Report Table - ${productName}:`);
      console.table(rows);
      return rows;
    } catch (error) {
      console.error(`❌ Error saat membaca report ${productName}:`, error);
      throw error;
    }
  }

  async clearExistingCycles(productName, lineId = '3') {
    try {
      const tableInfo = productTableMap[productName];
      if (!tableInfo) {
        console.log(`⚠️ Tidak ada mapping tabel report untuk produk: ${productName}`);
        return 0;
      }

      const query = `DELETE FROM ${tableInfo.report} WHERE line_id = ?`;
      const [result] = await this.connection.execute(query, [lineId]);
      console.log(`\n🗑️ ${result.affectedRows} data siklus lama dihapus untuk ${productName} line ${lineId}`);
      return result.affectedRows;
    } catch (error) {
      console.error(`❌ Error saat menghapus data lama ${productName}:`, error);
      throw error;
    }
  }

  async processAllProducts(lineId = '3', startDate = null, endDate = null) {
    console.log('🚀 Memulai proses deteksi siklus untuk semua produk...\n');
    
    const products = Object.keys(productTableMap);
    let totalCyclesProcessed = 0;

    for (const product of products) {
      try {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📝 Memproses produk: ${product}`);
        console.log(`${'='.repeat(60)}`);

        // Hapus data lama sebelum menyimpan yang baru
        await this.clearExistingCycles(product, lineId);
        
        // Deteksi siklus
        const cycles = await this.detectCyclesForProduct(product, lineId, startDate, endDate);

        if (cycles.length > 0) {
          // Tampilkan ringkasan
          this.displayCycleSummary(cycles, product);
          
          // Ekspor ke JSON
          await this.exportToJSON(cycles, product);
          
          // Simpan ke database
          await this.saveCycleSummaryToDatabase(cycles, product, lineId);
          
          // Tampilkan report terakhir
          await this.viewExistingReports(product);
          
          totalCyclesProcessed += cycles.length;
        } else {
          console.log(`ℹ️ Tidak ada siklus yang terdeteksi untuk ${product}`);
        }

      } catch (error) {
        console.error(`❌ Error memproses produk ${product}:`, error);
      }
    }

    console.log(`\n🎉 PROSES SELESAI!`);
    console.log(`📊 Total siklus yang diproses: ${totalCyclesProcessed}`);
  }
}

async function main() {
  const detector = new ProductionCycleDetector();

  try {
    await detector.connect();
    
    // Proses semua produk
    await detector.processAllProducts('3');
    
  } catch (error) {
    console.error('Error dalam proses:', error);
  } finally {
    await detector.disconnect();
  }
}

// Jalankan program
if (require.main === module) {
  main().catch(console.error);
}
