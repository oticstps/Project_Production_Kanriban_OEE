const CommonRail10Filtered = require('../models/commonRail10FilteredModel');

// Helper function to validate datetime format
const isValidDateTime = (datetime) => {
  const regex = /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/;
  return regex.test(datetime);
};

// Helper function to format datetime
const formatDateTime = (dateTimeStr) => {
  // If already has time, return as is
  if (dateTimeStr.includes(' ')) {
    return dateTimeStr;
  }
  // If only date, add default time
  return dateTimeStr;
};

const commonRail10FilteredController = {
  // Get all data
  getAll: async (req, res) => {
    try {
      const data = await CommonRail10Filtered.getAll();
      res.json({
        status: 'success',
        data: data,
        total: data.length,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error fetching common rail 10 filtered data:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch data',
        error: error.message
      });
    }
  },

  // Get data by datetime range (YYYY-MM-DD HH:MM:SS)
  getByDateTimeRange: async (req, res) => {
    try {
      let { startDateTime, endDateTime } = req.query;
      
      if (!startDateTime || !endDateTime) {
        return res.status(400).json({
          status: 'error',
          message: 'startDateTime and endDateTime query parameters are required'
        });
      }

      // Validate datetime format
      if (!isValidDateTime(startDateTime) || !isValidDateTime(endDateTime)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid datetime format. Use YYYY-MM-DD HH:MM:SS or YYYY-MM-DD'
        });
      }

      // Format datetime
      startDateTime = formatDateTime(startDateTime);
      endDateTime = formatDateTime(endDateTime);

      // If only date provided, add time
      if (!startDateTime.includes(':')) {
        startDateTime += ' 00:00:00';
      }
      if (!endDateTime.includes(':')) {
        endDateTime += ' 23:59:59';
      }

      const data = await CommonRail10Filtered.getByDateTimeRange(startDateTime, endDateTime);
      
      res.json({
        status: 'success',
        data: data,
        total: data.length,
        filters: {
          startDateTime,
          endDateTime
        },
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error fetching data by datetime range:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch data',
        error: error.message
      });
    }
  },

  // Get data by specific date (YYYY-MM-DD)
  getByDate: async (req, res) => {
    try {
      const { date } = req.params;
      
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
          status: 'error',
          message: 'Valid date parameter is required (YYYY-MM-DD)'
        });
      }

      const data = await CommonRail10Filtered.getByDate(date);
      
      res.json({
        status: 'success',
        data: data,
        total: data.length,
        date: date,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error fetching data by date:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch data',
        error: error.message
      });
    }
  },

  // Get data by time range within a specific date
  getByTimeRange: async (req, res) => {
    try {
      const { date, startTime, endTime } = req.query;
      
      if (!date || !startTime || !endTime) {
        return res.status(400).json({
          status: 'error',
          message: 'date, startTime, and endTime query parameters are required'
        });
      }

      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid date format. Use YYYY-MM-DD'
        });
      }

      // Validate time format
      const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;
      if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid time format. Use HH:MM or HH:MM:SS'
        });
      }

      const data = await CommonRail10Filtered.getByTimeRange(date, startTime, endTime);
      
      res.json({
        status: 'success',
        data: data,
        total: data.length,
        filters: {
          date,
          startTime,
          endTime
        },
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error fetching data by time range:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch data',
        error: error.message
      });
    }
  },

  // Get data by multiple days with time range
  getByMultipleDaysTimeRange: async (req, res) => {
    try {
      const { startDate, endDate, startTime, endTime } = req.query;
      
      if (!startDate || !endDate || !startTime || !endTime) {
        return res.status(400).json({
          status: 'error',
          message: 'startDate, endDate, startTime, and endTime query parameters are required'
        });
      }

      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid date format. Use YYYY-MM-DD'
        });
      }

      // Validate time format
      const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/;
      if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid time format. Use HH:MM or HH:MM:SS'
        });
      }

      const data = await CommonRail10Filtered.getByMultipleDaysTimeRange(startDate, endDate, startTime, endTime);
      
      res.json({
        status: 'success',
        data: data,
        total: data.length,
        filters: {
          startDate,
          endDate,
          startTime,
          endTime
        },
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error fetching data by multiple days time range:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch data',
        error: error.message
      });
    }
  },

  // Get data with advanced filter (all parameters)
  getWithFilter: async (req, res) => {
    try {
      const { 
        startDateTime, 
        endDateTime, 
        date,
        status, 
        line_id, 
        pg,
        name_product,
        limit = 100,
        page = 1
      } = req.query;

      // Build filters object
      const filters = {};

      if (startDateTime) {
        if (!isValidDateTime(startDateTime)) {
          return res.status(400).json({
            status: 'error',
            message: 'Invalid startDateTime format'
          });
        }
        filters.startDateTime = formatDateTime(startDateTime);
        if (!filters.startDateTime.includes(':')) {
          filters.startDateTime += ' 00:00:00';
        }
      }

      if (endDateTime) {
        if (!isValidDateTime(endDateTime)) {
          return res.status(400).json({
            status: 'error',
            message: 'Invalid endDateTime format'
          });
        }
        filters.endDateTime = formatDateTime(endDateTime);
        if (!filters.endDateTime.includes(':')) {
          filters.endDateTime += ' 23:59:59';
        }
      }

      if (date) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return res.status(400).json({
            status: 'error',
            message: 'Invalid date format'
          });
        }
        filters.date = date;
      }

      if (status) filters.status = status;
      if (line_id) filters.line_id = line_id;
      if (pg) filters.pg = pg;
      if (name_product) filters.name_product = name_product;
      if (limit) filters.limit = parseInt(limit);

      const data = await CommonRail10Filtered.getByCustomFilter(filters);
      
      res.json({
        status: 'success',
        data: data,
        total: data.length,
        filters: filters,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error fetching filtered data:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch data',
        error: error.message
      });
    }
  },

  // Get data with pagination
  getWithPagination: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      
      const { startDateTime, endDateTime, status } = req.query;
      const filters = {};

      if (startDateTime && endDateTime) {
        if (!isValidDateTime(startDateTime) || !isValidDateTime(endDateTime)) {
          return res.status(400).json({
            status: 'error',
            message: 'Invalid datetime format'
          });
        }
        filters.startDateTime = formatDateTime(startDateTime);
        filters.endDateTime = formatDateTime(endDateTime);
        
        if (!filters.startDateTime.includes(':')) {
          filters.startDateTime += ' 00:00:00';
        }
        if (!filters.endDateTime.includes(':')) {
          filters.endDateTime += ' 23:59:59';
        }
      }

      if (status) filters.status = status;

      const result = await CommonRail10Filtered.getWithPagination(page, limit, filters);
      
      res.json({
        status: 'success',
        data: result.data,
        pagination: result.pagination,
        filters: filters,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error fetching data with pagination:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch data',
        error: error.message
      });
    }
  },

  // Get hourly statistics
  getHourlyStats: async (req, res) => {
    try {
      const { date } = req.params;
      
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({
          status: 'error',
          message: 'Valid date parameter is required (YYYY-MM-DD)'
        });
      }

      const stats = await CommonRail10Filtered.getHourlyStats(date);
      
      res.json({
        status: 'success',
        data: stats,
        date: date,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error fetching hourly statistics:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch statistics',
        error: error.message
      });
    }
  },

  // Get latest data
  getLatest: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const data = await CommonRail10Filtered.getAll();
      
      // Get latest based on limit
      const latestData = data.slice(0, limit);
      
      res.json({
        status: 'success',
        data: latestData,
        total: latestData.length,
        limit: limit,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error fetching latest data:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch data',
        error: error.message
      });
    }
  }
};

module.exports = commonRail10FilteredController;