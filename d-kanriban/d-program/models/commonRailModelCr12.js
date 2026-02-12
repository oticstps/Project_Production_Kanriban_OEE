const pool = require("../config/db_core");

// Untuk common_rail_12
const getAllCr12 = async () => {
  const [rows] = await pool.query("SELECT * FROM common_rail_12_core ORDER BY created_at DESC");
  return rows;
};

const getByIdCr12 = async (id) => {
  const [rows] = await pool.query("SELECT * FROM common_rail_12_core WHERE id_uuid = ?", [id]);
  return rows[0];
};

const getAllCr12Stop = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM common_rail_12_core WHERE status = 'STOP' ORDER BY created_at DESC"
  );
  return rows;
};

// CRUD Functions
const create = async (data) => {
  const [result] = await pool.query("INSERT INTO common_rail_12_core SET ?", data);
  return { id_uuid: result.insertId, ...data };
};

const update = async (id, data) => {
  await pool.query("UPDATE common_rail_12_core SET ? WHERE id_uuid = ?", [data, id]);
  const [rows] = await pool.query("SELECT * FROM common_rail_12_core WHERE id_uuid = ?", [id]);
  return rows[0]; // Return data yang diperbarui
};

const remove = async (id) => {
  const [rows] = await pool.query("SELECT * FROM common_rail_12_core WHERE id_uuid = ?", [id]);
  if (rows.length === 0) {
    throw new Error("Data not found");
  }
  await pool.query("DELETE FROM common_rail_12_core WHERE id_uuid = ?", [id]);
  return { message: "Deleted successfully" };
};

module.exports = {
  getAllCr12,
  getByIdCr12,
  getAllCr12Stop,
  create,
  update,
  remove
};