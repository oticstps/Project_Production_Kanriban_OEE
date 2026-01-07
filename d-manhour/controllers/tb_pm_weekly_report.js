const TbWeeklyWh = require('../models/tb_pm_weekly_report');

const TbWeeklyWhController = {
  getAll: async (req, res) => {
    try {
      const data = await TbWeeklyWh.getAll();
      res.json({
        success: true,
        data: data,
        message: 'Data retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await TbWeeklyWh.getById(id);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: 'Data not found'
        });
      }
      res.json({
        success: true,
        data: data,
        message: 'Data retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  create: async (req, res) => {
    try {
      const data = req.body;
      const id = await TbWeeklyWh.create(data);
      res.status(201).json({
        success: true,
        data: { id },
        message: 'Data created successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const affectedRows = await TbWeeklyWh.update(id, data);
      if (affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Data not found'
        });
      }
      res.json({
        success: true,
        message: 'Data updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const affectedRows = await TbWeeklyWh.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Data not found'
        });
      }
      res.json({
        success: true,
        message: 'Data deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const data = await TbWeeklyWh.getByDateRange(startDate, endDate);
      res.json({
        success: true,
        data: data,
        message: 'Data retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getByShift: async (req, res) => {
    try {
      const { shift } = req.params;
      const data = await TbWeeklyWh.getByShift(shift);
      res.json({
        success: true,
        data: data,
        message: 'Data retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  getByPowerMeter: async (req, res) => {
    try {
      const { power_meter } = req.params;
      const data = await TbWeeklyWh.getByPowerMeter(power_meter);
      res.json({
        success: true,
        data: data,
        message: 'Data retrieved successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = TbWeeklyWhController;