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

  async detectCycles(lineId = '3', startDate = null, endDate = null) {
    try {
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
        FROM common_rail_3_4n13
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
        console.log('⚠️ Tidak ada data ditemukan');
        return [];
      }

      // Validasi: pastikan data diurutkan berdasarkan waktu
      rows.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      // Filter data berdasarkan delta_actual yang tidak ekstrem
      const filteredRows = this.filterExtremeDeltaActual(rows);
      console.log(`📊 Data awal: ${rows.length} record, Setelah filter: ${filteredRows.length} record`);

      const cycles = this.processCycles(filteredRows);
      return cycles;

    } catch (error) {
      console.error('❌ Error saat mendeteksi siklus:', error);
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
          currentCycle.duration = this.calculateDuration(
            currentCycle.startTime,
            currentCycle.endTime
          );
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
      currentCycle.duration = this.calculateDuration(
        currentCycle.startTime,
        currentCycle.endTime
      );
      cycles.push(currentCycle);
    }

    return cycles;
  }

  calculateDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;

    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);

    return {
      milliseconds: diffMs,
      formatted: `${hours}h ${minutes}m ${seconds}s`
    };
  }

  displayCycleSummary(cycles) {
    console.log('\n📊 RINGKASAN SIKLUS PRODUKSI');
    console.log('=' .repeat(80));
    
    cycles.forEach(cycle => {
      console.log(`\n🔄 Siklus #${cycle.cycleNumber}`);
      console.log(`   Line: ${cycle.lineName} (ID: ${cycle.lineId})`);
      console.log(`   Produk: ${cycle.product}`);
      console.log(`   Shift: ${cycle.shift}`);
      console.log(`   Waktu Mulai: ${new Date(cycle.startTime).toLocaleString('id-ID')}`);
      console.log(`   Waktu Selesai: ${new Date(cycle.endTime).toLocaleString('id-ID')}`);
      console.log(`   Durasi: ${cycle.duration.formatted}`);
      console.log(`   Actual Awal: ${cycle.startActual}`);
      console.log(`   Actual Akhir: ${cycle.endActual}`);
      console.log(`   Total Produksi: ${cycle.totalProduced} unit`);
      console.log(`   Jumlah Record: ${cycle.recordCount}`);
      console.log('-'.repeat(80));
    });

    const totalProduction = cycles.reduce((sum, c) => sum + c.totalProduced, 0);
    const avgProduction = cycles.length > 0 ? totalProduction / cycles.length : 0;

    console.log('\n📈 STATISTIK KESELURUHAN');
    console.log(`   Total Siklus: ${cycles.length}`);
    console.log(`   Total Produksi: ${totalProduction} unit`);
    console.log(`   Rata-rata Produksi per Siklus: ${avgProduction.toFixed(2)} unit`);
    console.log('=' .repeat(80));
  }

  async exportToJSON(cycles, filename = 'production_cycles.json') {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
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
          durationMs: cycle.duration.milliseconds,
          startActual: cycle.startActual,
          endActual: cycle.endActual,
          totalProduced: cycle.totalProduced,
          recordCount: cycle.recordCount
        }))
      };

      await fs.writeFile(filename, JSON.stringify(exportData, null, 2));
      console.log(`\n✅ Data berhasil diekspor ke ${filename}`);
      
    } catch (error) {
      console.error('❌ Error saat mengekspor data:', error);
    }
  }

  async getNextId(tableName) {
    try {
      const query = `SELECT MAX(id) as maxId FROM ${tableName}`;
      const [rows] = await this.connection.execute(query);
      return rows[0].maxId ? rows[0].maxId + 1 : 1;
    } catch (error) {
      console.error('❌ Error mendapatkan ID berikutnya:', error);
      return 1;
    }
  }

  async saveCycleSummaryToDatabase(cycles, tableName = 'common_rail_3_4n13_report') {
    try {
      // Dapatkan ID berikutnya
      let nextId = await this.getNextId(tableName);

      // Query untuk insert data
      const insertQuery = `
        INSERT INTO ${tableName} 
        (idPrimary, cycle_number, line_id, line_name, product_name, shift, start_time, end_time, 
         duration_minutes, start_actual, end_actual, total_produced, record_count, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;

      let insertedCount = 0;
      
      for (const cycle of cycles) {
        const durationMinutes = Math.floor(cycle.duration.milliseconds / 60000);
        
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
            durationMinutes,
            cycle.startActual,
            cycle.endActual,
            cycle.totalProduced,
            cycle.recordCount
          ]);

          insertedCount++;
          nextId++;
        } catch (error) {
          console.error('❌ Error menyimpan siklus:', error);
        }
      }

      console.log(`\n✅ ${insertedCount} siklus disimpan ke database`);
      
    } catch (error) {
      console.error('❌ Error saat menyimpan ke database:', error);
      throw error;
    }
  }

  async viewExistingReports(tableName = 'common_rail_3_4n13_report') {
    try {
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
        FROM ${tableName} 
        ORDER BY start_time DESC 
        LIMIT 10
      `;
      
      const [rows] = await this.connection.execute(query);
      
      console.log('\n📋 10 Data Terakhir di Report Table:');
      console.table(rows);
      return rows;
    } catch (error) {
      console.error('❌ Error saat membaca report:', error);
      throw error;
    }
  }

  async clearExistingCycles(tableName = 'common_rail_3_4n13_report', lineId = '3') {
    try {
      const query = `DELETE FROM ${tableName} WHERE line_id = ?`;
      const [result] = await this.connection.execute(query, [lineId]);
      console.log(`\n🗑️ ${result.affectedRows} data siklus lama dihapus untuk line ${lineId}`);
      return result.affectedRows;
    } catch (error) {
      console.error('❌ Error saat menghapus data lama:', error);
      throw error;
    }
  }
}

async function main() {
  const detector = new ProductionCycleDetector();

  try {
    await detector.connect();
    
    // Hapus data lama sebelum menyimpan yang baru
    await detector.clearExistingCycles('common_rail_3_4n13_report', '3');
    
    const cycles = await detector.detectCycles('3');

    if (cycles.length > 0) {
      detector.displayCycleSummary(cycles);
      await detector.exportToJSON(cycles, 'production_cycles.json');
      await detector.saveCycleSummaryToDatabase(cycles, 'common_rail_3_4n13_report');
      await detector.viewExistingReports('common_rail_3_4n13_report');
    } else {
      console.log('Tidak ada siklus yang terdeteksi');
    }

  } catch (error) {
    console.error('Error dalam proses:', error);
  } finally {
    await detector.disconnect();
  }
}

// Jalankan program
main().catch(console.error);

module.exports = ProductionCycleDetector;