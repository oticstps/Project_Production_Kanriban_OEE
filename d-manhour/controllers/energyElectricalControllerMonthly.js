const energyElectricalModelMonthly = require('../models/energyElectricalModelMonthly');
const { success, error } = require('../utils/response');

const energyElectricalControllerMonthly = {
  getAllPmMonthlyReport: async (req, res) => {
    try {
      console.log('📥 GET /api/energy/pm-monthly-report called');
      const data = await energyElectricalModelMonthly.getAllPmMonthlyReport();
      console.log(`📤 Sending ${data.length} records`);
      res.status(200).json(success('PM monthly report data retrieved successfully', data));
    } catch (err) {
      console.error('❌ Error in getAllPmMonthlyReport:', err.message);
      res.status(500).json(error(err.message));
    }
  },

  getPmMonthlyReportById: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await energyElectricalModelMonthly.getPmMonthlyReportById(id);
      
      if (!data) {
        return res.status(404).json(error('PM monthly report not found'));
      }
      
      res.status(200).json(success('PM monthly report data retrieved successfully', data));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  },

  getPmMonthlyReportByType: async (req, res) => {
    try {
      const { type } = req.params;
      const data = await energyElectricalModelMonthly.getPmMonthlyReportByType(type);
      res.status(200).json(success(`PM monthly report data for type ${type} retrieved successfully`, data));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  },

  getPmMonthlyReportByLine: async (req, res) => {
    try {
      const { line } = req.params;
      const data = await energyElectricalModelMonthly.getPmMonthlyReportByLine(line);
      res.status(200).json(success(`PM monthly report data for line ${line} retrieved successfully`, data));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  },

  getPmMonthlyReportByMonthYear: async (req, res) => {
    try {
      const { month, year } = req.params;
      const data = await energyElectricalModelMonthly.getPmMonthlyReportByMonthYear(month, year);
      res.status(200).json(success(`PM monthly report data for ${month} ${year} retrieved successfully`, data));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  },

  getPmMonthlyReportByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json(error('Start date and end date are required'));
      }

      const data = await energyElectricalModelMonthly.getPmMonthlyReportByDateRange(startDate, endDate);
      res.status(200).json(success(`PM monthly report data from ${startDate} to ${endDate} retrieved successfully`, data));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  }
};
















module.exports = energyElectricalControllerMonthly;



























// // controllers/energyController.js

// const energyModel = require("../models/energyModel");
// const { success, error } = require("../utils/response");

// const getMonthly = async (req, res) => {
//   try {
//     const data = await energyModel.getMonthly();
//     res.json(success("Get all data", data));
//   } catch (err) {
//     res.status(500).json(error(err.message));
//   }
// };


// const getIdMonthly = async (req, res) => {
//   try {
//     const data = await energyModel.getIdMonthly(req.params.id);
//     if (!data) return res.status(404).json(error("Data not found"));
//     res.json(success("Get data by id", data));
//   } catch (err) {
//     res.status(500).json(error(err.message));
//   }
// };









// // CRUD Controller Functions
// const create = async (req, res) => {
//   try {
//     const data = await energyModel.create(req.body);
//     res.status(201).json(success("Data created successfully", data));
//   } catch (err) {
//     res.status(500).json(error(err.message));
//   }
// };

// const update = async (req, res) => {
//   try {
//     const data = await energyModel.update(req.params.id, req.body);
//     res.json(success("Data updated successfully", data));
//   } catch (err) {
//     if (err.message === "Data not found") {
//       res.status(404).json(error(err.message));
//     } else {
//       res.status(500).json(error(err.message));
//     }
//   }
// };

// const remove = async (req, res) => {
//   try {
//     const result = await energyModel.remove(req.params.id);
//     res.json(success(result.message));
//   } catch (err) {
//     if (err.message === "Data not found") {
//       res.status(404).json(error(err.message));
//     } else {
//       res.status(500).json(error(err.message));
//     }
//   }
// };

// module.exports = {
//   getMonthly,
//   getIdMonthly,

  
//   create,
//   update,
//   remove,
// };