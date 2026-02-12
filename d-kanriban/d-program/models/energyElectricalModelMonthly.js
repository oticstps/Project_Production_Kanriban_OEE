const pool = require('../config/db_core');

const energyElectricalModelMonthly = {
  getAllPmMonthlyReport: async () => {
    try {
      const [rows] = await pool.execute('SELECT * FROM tb_pm_monthly_report ORDER BY idPrimary DESC');
      return rows;
    } catch (error) {
      throw new Error(`Error fetching PM monthly report: ${error.message}`);
    }
  },

  getPmMonthlyReportById: async (id) => {
    try {
      const [rows] = await pool.execute('SELECT * FROM tb_pm_monthly_report WHERE idPrimary = ?', [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error fetching PM monthly report by ID: ${error.message}`);
    }
  },

  getPmMonthlyReportByType: async (pmType) => {
    try {
      const [rows] = await pool.execute('SELECT * FROM tb_pm_monthly_report WHERE pm_type = ? ORDER BY idPrimary DESC', [pmType]);
      return rows;
    } catch (error) {
      throw new Error(`Error fetching PM monthly report by type: ${error.message}`);
    }
  },

  getPmMonthlyReportByLine: async (lineName) => {
    try {
      const [rows] = await pool.execute('SELECT * FROM tb_pm_monthly_report WHERE line_name = ? ORDER BY idPrimary DESC', [lineName]);
      return rows;
    } catch (error) {
      throw new Error(`Error fetching PM monthly report by line: ${error.message}`);
    }
  },

  getPmMonthlyReportByMonthYear: async (month, year) => {
    try {
      const [rows] = await pool.execute('SELECT * FROM tb_pm_monthly_report WHERE month = ? AND year = ? ORDER BY idPrimary DESC', [month, year]);
      return rows;
    } catch (error) {
      throw new Error(`Error fetching PM monthly report by month and year: ${error.message}`);
    }
  },

  getPmMonthlyReportByDateRange: async (startDate, endDate) => {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM tb_pm_monthly_report WHERE start_datetime >= ? AND end_datetime <= ? ORDER BY idPrimary DESC',
        [startDate, endDate]
      );
      return rows;
    } catch (error) {
      throw new Error(`Error fetching PM monthly report by date range: ${error.message}`);
    }
  }
};

module.exports = energyElectricalModelMonthly;











// // src/models/energyModel.js

// const poolEnergy = require("../config/db_energy");


// // Untuk tb_pm_monthly_report
// const getMonthly = async () => {
//   const [rows] = await poolEnergy.query("SELECT * FROM tb_pm_monthly_report ORDER BY idPrimary DESC");
//   return rows;
// };

// const getIdMonthly = async (id) => {
//   const [rows] = await poolEnergy.query("SELECT * FROM tb_pm_monthly_report WHERE idPrimary = ?", [id]);
//   return rows[0];
// };





// // CRUD Functions
// const create = async (data) => {
//   const [result] = await poolEnergy.query("INSERT INTO tb_pm_monthly_report SET ?", data);
//   return { id: result.insertId, ...data };
// };

// const update = async (id, data) => {
//   await poolEnergy.query("UPDATE tb_pm_monthly_report SET ? WHERE idPrimary = ?", [data, id]);
//   const [rows] = await poolEnergy.query("SELECT * FROM tb_pm_monthly_report WHERE idPrimary = ?", [id]);
//   return rows[0]; // Return data yang diperbarui
// };

// const remove = async (id) => {
//   const [rows] = await poolEnergy.query("SELECT * FROM tb_pm_monthly_report WHERE idPrimary = ?", [id]);
//   if (rows.length === 0) {
//     throw new Error("Data not found");
//   }
//   await poolEnergy.query("DELETE FROM tb_pm_monthly_report WHERE idPrimary = ?", [id]);
//   return { message: "Deleted successfully" };
// };

// module.exports = {
//   getMonthly,
//   getIdMonthly,
//   create,
//   update,
//   remove
// };