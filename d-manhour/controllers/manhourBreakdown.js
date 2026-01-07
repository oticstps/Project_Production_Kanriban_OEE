const pool = require('../config/db_core');
const ShiftService = require('../services/shiftService');

class manhourBreakdown {
  /**
   * Mendapatkan semua data dari tabel common_rail_12_filtered
   */
  static async getAllData(req, res) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          idPrimary, 
          line_id, 
          pg, 
          line_name, 
          name_product, 
          target, 
          actual, 
          loading_time, 
          efficiency, 
          delay, 
          cycle_time, 
          status, 
          time_trouble, 
          time_trouble_quality, 
          andon, 
          created_at,
          DATE(created_at) as date_only,
          TIME(created_at) as time_only
        FROM common_rail_12_filtered 
        ORDER BY created_at DESC
      `);
      
      // Tambahkan informasi shift ke setiap row
      const dataWithShift = rows.map(row => ({
        ...row,
        shift: ShiftService.getShiftFromTime(row.created_at)
      }));
      
      res.json({
        success: true,
        data: dataWithShift,
        total: rows.length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching data',
        error: error.message
      });
    }
  }

  /**
   * Mendapatkan data berdasarkan shift 1 untuk tanggal tertentu
   */
  static async getShift1Data(req, res) {
    try {
      let { date } = req.query;
      
      // Jika tidak ada tanggal yang diberikan, gunakan tanggal hari ini
      if (!date) {
        const today = new Date();
        date = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      }
      
      // Dapatkan rentang waktu untuk shift 1 pada tanggal tersebut
      const shiftRange = ShiftService.getShiftTimeRange(date, 1);
      
      console.log('Fetching Shift 1 data from:', shiftRange.start, 'to:', shiftRange.end);
      
      const [rows] = await pool.query(`
        SELECT 
          idPrimary, 
          line_id, 
          pg, 
          line_name, 
          name_product, 
          target, 
          actual, 
          loading_time, 
          efficiency, 
          delay, 
          cycle_time, 
          status, 
          time_trouble, 
          time_trouble_quality, 
          andon, 
          created_at,
          DATE(created_at) as date_only,
          TIME(created_at) as time_only
        FROM common_rail_12_filtered 
        WHERE created_at BETWEEN ? AND ?
        ORDER BY created_at ASC
      `, [shiftRange.start, shiftRange.end]);
      
      res.json({
        success: true,
        data: rows,
        total: rows.length,
        shift: 1,
        date: date,
        timeRange: {
          start: shiftRange.start,
          end: shiftRange.end
        }
      });
    } catch (error) {
      console.error('Error fetching shift 1 data:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching shift 1 data',
        error: error.message
      });
    }
  }

  /**
   * Mendapatkan data berdasarkan shift 2 untuk tanggal tertentu
   */
  static async getShift2Data(req, res) {
    try {
      let { date } = req.query;
      
      if (!date) {
        const today = new Date();
        date = today.toISOString().split('T')[0];
      }
      
      const shiftRange = ShiftService.getShiftTimeRange(date, 2);
      
      console.log('Fetching Shift 2 data from:', shiftRange.start, 'to:', shiftRange.end);
      
      const [rows] = await pool.query(`
        SELECT 
          idPrimary, 
          line_id, 
          pg, 
          line_name, 
          name_product, 
          target, 
          actual, 
          loading_time, 
          efficiency, 
          delay, 
          cycle_time, 
          status, 
          time_trouble, 
          time_trouble_quality, 
          andon, 
          created_at,
          DATE(created_at) as date_only,
          TIME(created_at) as time_only
        FROM common_rail_12_filtered 
        WHERE created_at BETWEEN ? AND ?
        ORDER BY created_at ASC
      `, [shiftRange.start, shiftRange.end]);
      
      res.json({
        success: true,
        data: rows,
        total: rows.length,
        shift: 2,
        date: date,
        timeRange: {
          start: shiftRange.start,
          end: shiftRange.end
        }
      });
    } catch (error) {
      console.error('Error fetching shift 2 data:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching shift 2 data',
        error: error.message
      });
    }
  }

  /**
   * Mendapatkan data berdasarkan rentang tanggal
   */
  static async getDataByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'startDate and endDate are required'
        });
      }
      
      // Konversi ke format datetime MySQL
      const startDateTime = `${startDate} 00:00:00`;
      const endDateTime = `${endDate} 23:59:59`;
      
      const [rows] = await pool.query(`
        SELECT 
          *,
          DATE(created_at) as date_only,
          TIME(created_at) as time_only
        FROM common_rail_12_filtered 
        WHERE created_at BETWEEN ? AND ?
        ORDER BY created_at ASC
      `, [startDateTime, endDateTime]);
      
      // Tambahkan informasi shift
      const dataWithShift = rows.map(row => ({
        ...row,
        shift: ShiftService.getShiftFromTime(row.created_at)
      }));
      
      res.json({
        success: true,
        data: dataWithShift,
        total: rows.length,
        dateRange: {
          start: startDate,
          end: endDate
        }
      });
    } catch (error) {
      console.error('Error fetching data by date range:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching data by date range',
        error: error.message
      });
    }
  }

  /**
   * Mendapatkan statistik data
   */
  static async getStatistics(req, res) {
    try {
      let { date } = req.query;
      
      if (!date) {
        const today = new Date();
        date = today.toISOString().split('T')[0];
      }
      
      // Statistik untuk hari tertentu
      const startDateTime = `${date} 00:00:00`;
      const endDateTime = `${date} 23:59:59`;
      
      const [rows] = await pool.query(`
        SELECT 
          COUNT(*) as total_records,
          SUM(CAST(actual AS UNSIGNED)) as total_actual,
          SUM(CAST(target AS UNSIGNED)) as total_target,
          AVG(CAST(efficiency AS DECIMAL(10,2))) as avg_efficiency,
          SUM(CAST(time_trouble AS UNSIGNED)) as total_trouble_time,
          SUM(CAST(time_trouble_quality AS UNSIGNED)) as total_quality_trouble_time,
          MIN(created_at) as first_record,
          MAX(created_at) as last_record
        FROM common_rail_12_filtered 
        WHERE DATE(created_at) = ?
      `, [date]);
      
      // Data per shift
      const shift1Range = ShiftService.getShiftTimeRange(date, 1);
      const shift2Range = ShiftService.getShiftTimeRange(date, 2);
      
      const [shift1Stats] = await pool.query(`
        SELECT 
          COUNT(*) as records,
          SUM(CAST(actual AS UNSIGNED)) as actual_sum,
          AVG(CAST(efficiency AS DECIMAL(10,2))) as avg_efficiency
        FROM common_rail_12_filtered 
        WHERE created_at BETWEEN ? AND ?
      `, [shift1Range.start, shift1Range.end]);
      
      const [shift2Stats] = await pool.query(`
        SELECT 
          COUNT(*) as records,
          SUM(CAST(actual AS UNSIGNED)) as actual_sum,
          AVG(CAST(efficiency AS DECIMAL(10,2))) as avg_efficiency
        FROM common_rail_12_filtered 
        WHERE created_at BETWEEN ? AND ?
      `, [shift2Range.start, shift2Range.end]);
      
      res.json({
        success: true,
        statistics: {
          date: date,
          overall: rows[0],
          shift1: {
            ...shift1Stats[0],
            timeRange: shift1Range
          },
          shift2: {
            ...shift2Stats[0],
            timeRange: shift2Range
          }
        }
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching statistics',
        error: error.message
      });
    }
  }
}

module.exports = manhourBreakdown;