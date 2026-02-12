const pool = require('../config/db_core');

const CommonRail3Filtered = {
  // Get all data
  getAll: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM common_rail_3_filtered ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get data by date range dengan waktu (YYYY-MM-DD HH:MM:SS)
  getByDateTimeRange: async (startDateTime, endDateTime) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM common_rail_3_filtered WHERE created_at BETWEEN ? AND ? ORDER BY created_at DESC',
        [startDateTime, endDateTime]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get data by specific date (YYYY-MM-DD)
  getByDate: async (date) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM common_rail_3_filtered WHERE DATE(created_at) = ? ORDER BY created_at DESC',
        [date]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get data by hour range
  getByHourRange: async (date, startHour, endHour) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM common_rail_3_filtered WHERE DATE(created_at) = ? AND TIME(created_at) BETWEEN ? AND ? ORDER BY created_at DESC',
        [date, startHour, endHour]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get data by exact datetime
  getByExactDateTime: async (dateTime) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM common_rail_3_filtered WHERE created_at = ? ORDER BY created_at DESC',
        [dateTime]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get data by custom filter (multi-parameter)
  getByCustomFilter: async (filters) => {
    try {
      let query = 'SELECT * FROM common_rail_3_filtered WHERE 1=1';
      const params = [];

      // Date range filter
      if (filters.startDateTime && filters.endDateTime) {
        query += ' AND created_at BETWEEN ? AND ?';
        params.push(filters.startDateTime, filters.endDateTime);
      } else if (filters.startDateTime) {
        query += ' AND created_at >= ?';
        params.push(filters.startDateTime);
      } else if (filters.endDateTime) {
        query += ' AND created_at <= ?';
        params.push(filters.endDateTime);
      }

      // Specific date filter
      if (filters.date) {
        query += ' AND DATE(created_at) = ?';
        params.push(filters.date);
      }

      // Status filter
      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }

      // Line ID filter
      if (filters.line_id) {
        query += ' AND line_id = ?';
        params.push(filters.line_id);
      }

      // PG filter
      if (filters.pg) {
        query += ' AND pg = ?';
        params.push(filters.pg);
      }

      // Product name filter
      if (filters.name_product) {
        query += ' AND name_product = ?';
        params.push(filters.name_product);
      }

      // Add ordering
      query += ' ORDER BY created_at DESC';

      // Limit
      if (filters.limit) {
        query += ' LIMIT ?';
        params.push(parseInt(filters.limit));
      }

      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get data by time range only (within a specific day)
  getByTimeRange: async (date, startTime, endTime) => {
    try {
      const startDateTime = `${date} ${startTime}`;
      const endDateTime = `${date} ${endTime}`;
      
      const [rows] = await pool.query(
        'SELECT * FROM common_rail_3_filtered WHERE created_at BETWEEN ? AND ? ORDER BY created_at DESC',
        [startDateTime, endDateTime]
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get data with pagination
  getWithPagination: async (page = 1, limit = 50, filters = {}) => {
    try {
      let query = 'SELECT * FROM common_rail_3_filtered WHERE 1=1';
      let countQuery = 'SELECT COUNT(*) as total FROM common_rail_3_filtered WHERE 1=1';
      const params = [];
      const countParams = [];

      // Apply filters
      if (filters.startDateTime && filters.endDateTime) {
        query += ' AND created_at BETWEEN ? AND ?';
        countQuery += ' AND created_at BETWEEN ? AND ?';
        params.push(filters.startDateTime, filters.endDateTime);
        countParams.push(filters.startDateTime, filters.endDateTime);
      }

      if (filters.status) {
        query += ' AND status = ?';
        countQuery += ' AND status = ?';
        params.push(filters.status);
        countParams.push(filters.status);
      }

      // Add ordering
      query += ' ORDER BY created_at DESC';

      // Calculate offset
      const offset = (page - 1) * limit;
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);

      // Get total count
      const [countResult] = await pool.query(countQuery, countParams);
      const total = countResult[0].total;

      // Get data
      const [rows] = await pool.query(query, params);

      return {
        data: rows,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // Get data by multiple days with time range
  getByMultipleDaysTimeRange: async (startDate, endDate, startTime, endTime) => {
    try {
      const [rows] = await pool.query(`
        SELECT * FROM common_rail_3_filtered 
        WHERE 
          DATE(created_at) BETWEEN ? AND ?
          AND TIME(created_at) BETWEEN ? AND ?
        ORDER BY created_at DESC
      `, [startDate, endDate, startTime, endTime]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Get hourly statistics for a specific date
  getHourlyStats: async (date) => {
    try {
      const [rows] = await pool.query(`
        SELECT 
          HOUR(created_at) as hour,
          COUNT(*) as records,
          AVG(CAST(actual AS DECIMAL(10,2))) as avg_actual,
          AVG(CAST(target AS DECIMAL(10,2))) as avg_target,
          SUM(CASE WHEN status = 'STOP' THEN 1 ELSE 0 END) as stop_count,
          SUM(CASE WHEN status = 'RUN' THEN 1 ELSE 0 END) as run_count
        FROM common_rail_3_filtered 
        WHERE DATE(created_at) = ?
        GROUP BY HOUR(created_at)
        ORDER BY hour
      `, [date]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = CommonRail3Filtered;