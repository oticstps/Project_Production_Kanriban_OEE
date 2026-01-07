const pool = require("../config/db_core");

// Untuk common_rail_2
const getAllCr2 = async () => {
  const [rows] = await pool.query("SELECT * FROM common_rail_2_core ORDER BY created_at DESC");
  return rows;
};

const getByIdCr2 = async (id) => {
  const [rows] = await pool.query("SELECT * FROM common_rail_2_core WHERE id_uuid = ?", [id]);
  return rows[0];
};

const getAllCr2Stop = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM common_rail_2_core WHERE status = 'STOP' ORDER BY created_at DESC"
  );
  return rows;
};

// CRUD Functions
const create = async (data) => {
  const [result] = await pool.query("INSERT INTO common_rail_2_core SET ?", data);
  return { id_uuid: result.insertId, ...data };
};

const update = async (id, data) => {
  await pool.query("UPDATE common_rail_2_core SET ? WHERE id_uuid = ?", [data, id]);
  const [rows] = await pool.query("SELECT * FROM common_rail_2_core WHERE id_uuid = ?", [id]);
  return rows[0]; // Return data yang diperbarui
};

const remove = async (id) => {
  const [rows] = await pool.query("SELECT * FROM common_rail_2_core WHERE id_uuid = ?", [id]);
  if (rows.length === 0) {
    throw new Error("Data not found");
  }
  await pool.query("DELETE FROM common_rail_2_core WHERE id_uuid = ?", [id]);
  return { message: "Deleted successfully" };
};

module.exports = {
  getAllCr2,
  getByIdCr2,
  getAllCr2Stop,
  create,
  update,
  remove
};