// src/controllers/table.controller.js
const TableModel = require('../models/table.model');

const validTables = [
  "common_rail_1_filtered",
  "common_rail_2_filtered",
  "common_rail_3_filtered",
  "common_rail_4_filtered",
  "common_rail_5_filtered",
  "common_rail_6_filtered",
  "common_rail_7_filtered",
  "common_rail_8_filtered",
  "common_rail_9_filtered",
  "common_rail_10_filtered",
  "common_rail_11_filtered",
  "common_rail_12_filtered"
];


const getAllDataFromTable = async (req, res) => {
  const { table } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  if (!validTables.includes(table)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  try {
    const data = await TableModel.getAllData(table, limit, offset);
    const total = await TableModel.getTotalCount(table);

    res.json({
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database query failed' });
  }
};

module.exports = { getAllDataFromTable };