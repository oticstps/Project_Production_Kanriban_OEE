// Project_Dashboard_TPS\D-Kanriban\D-program\models\productionModel.js
const pool = require("../config/db");

const createProduction = async (data) => {
  const query = `
    INSERT INTO common_rail_3_manhour (
      tanggal, total_produksi, total_op, duration, loading_time,
      help_op, loading_time_help_op, mc_fault_duration, mc_fault_freq,
      dangae, quality_check, other, kaizen, five_s,
      detail_mh_inline, detail_mh_bantuan, detail_mh_5s,
      total_manhour, manhour_minutes_per_pcs, pe
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.tanggal,
    data.total_produksi,
    data.total_op,
    data.duration,
    data.loading_time,
    data.help_op || 0,
    data.loading_time_help_op || 0,
    data.mc_fault_duration || 0,
    data.mc_fault_freq || 0,
    data.dangae || 0,
    data.quality_check || 0,
    data.other || 0,
    data.kaizen || 0,
    data.five_s || 0,
    data.detail_mh_inline || 0,
    data.detail_mh_bantuan || 0,
    data.detail_mh_5s || 0,
    data.total_manhour || 0,
    data.manhour_minutes_per_pcs || 0,
    data.pe || 0,
  ];
  const [result] = await pool.execute(query, values);
  return result.insertId;
};

const getAllProductions = async () => {
  const [rows] = await pool.execute("SELECT * FROM common_rail_3_manhour ORDER BY tanggal DESC");
  return rows;
};

const getProductionById = async (id) => {
  const [rows] = await pool.execute("SELECT * FROM common_rail_3_manhour WHERE id = ?", [id]);
  return rows[0];
};

const updateProduction = async (id, data) => {
  const query = `
    UPDATE common_rail_3_manhour SET
      tanggal = ?, total_produksi = ?, total_op = ?, duration = ?, loading_time = ?,
      help_op = ?, loading_time_help_op = ?, mc_fault_duration = ?, mc_fault_freq = ?,
      dangae = ?, quality_check = ?, other = ?, kaizen = ?, five_s = ?,
      detail_mh_inline = ?, detail_mh_bantuan = ?, detail_mh_5s = ?,
      total_manhour = ?, manhour_minutes_per_pcs = ?, pe = ?
    WHERE id = ?
  `;
  const values = [
    data.tanggal,
    data.total_produksi,
    data.total_op,
    data.duration,
    data.loading_time,
    data.help_op || 0,
    data.loading_time_help_op || 0,
    data.mc_fault_duration || 0,
    data.mc_fault_freq || 0,
    data.dangae || 0,
    data.quality_check || 0,
    data.other || 0,
    data.kaizen || 0,
    data.five_s || 0,
    data.detail_mh_inline || 0,
    data.detail_mh_bantuan || 0,
    data.detail_mh_5s || 0,
    data.total_manhour || 0,
    data.manhour_minutes_per_pcs || 0,
    data.pe || 0,
    id
  ];
  const [result] = await pool.execute(query, values);
  return result.affectedRows > 0;
};

const deleteProduction = async (id) => {
  const [result] = await pool.execute("DELETE FROM common_rail_3_manhour WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = {
  createProduction,
  getAllProductions,
  getProductionById,
  updateProduction,
  deleteProduction,
};