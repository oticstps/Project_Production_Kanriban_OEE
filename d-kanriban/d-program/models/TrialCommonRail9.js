// models/TrialCommonRail9.js

const pool = require("../config/db_core");

const getAllCr9 = async (start, stop) => {
  const query = `
    SELECT * FROM common_rail_9_filtered
    WHERE created_at BETWEEN ? AND ?
    ORDER BY idPrimary DESC
  `;
  const [rows] = await pool.query(query, [start, stop]);
  return rows;
};

module.exports = {
  getAllCr9
};


