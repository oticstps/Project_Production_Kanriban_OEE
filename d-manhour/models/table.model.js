// src/models/table.model.js
const db = require('../config/db');

const TableModel = {
  getAllData: async (tableName, limit, offset) => {
    const [rows] = await db.query(
      `SELECT * FROM ?? ORDER BY idPrimary DESC LIMIT ? OFFSET ?`,
      [tableName, limit, offset]
    );
    return rows;
  },

  getTotalCount: async (tableName) => {
    const [[{ count }]] = await db.query(
      `SELECT COUNT(*) AS count FROM ??`,
      [tableName]
    );
    return count;
  }

};

module.exports = TableModel;