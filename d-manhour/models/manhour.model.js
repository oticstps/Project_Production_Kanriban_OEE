// models/manhour.model.js
const pool = require('../config/db');

const Manhour = {
  // Get All
  getAll: async () => {
    const [rows] = await pool.execute(
      'SELECT * FROM common_rail_3_manhour ORDER BY start_time DESC'
    );
    return rows;
  },

  // Get By ID
  getById: async (id) => {
    const [rows] = await pool.execute(
      'SELECT * FROM common_rail_3_manhour WHERE idPrimary = ?',
      [id]
    );
    return rows[0];
  },

  // Create
  create: async (newManhour) => {
    const {
      cycle_number, line_id, pg, line_name, product_name, target, actual, loading_time, efficiency, delay, cycle_time, status,
      time_trouble, time_trouble_quality, andon, delta_time, shift, start_time, end_time, start_actual, end_actual,
      total_produced, record_count, year, month, day, time_only, loading_time_server, total_break,
      manpower, manpower_help, loading_time_manpower_help, machine_fault_preq, machine_fault_duration,
      quality_check, another, kaizen, five_s, manhour_in_line, manhour_helper, manhour_five_s,
      total_manhour, manhour_man_minutes_per_pcs, PE, bottle_neck_process, bottle_neck_process_duration,
      bottle_neck_mct, bottle_neck_mct_duration, setup_manpower, setup_ct, dangae
    } = newManhour;
    const [result] = await pool.execute(
      `INSERT INTO common_rail_3_manhour (
        cycle_number, line_id, pg, line_name, product_name, target, actual, loading_time, efficiency, delay, cycle_time, status,
        time_trouble, time_trouble_quality, andon, delta_time, shift, start_time, end_time, start_actual, end_actual,
        total_produced, record_count, year, month, day, time_only, loading_time_server, total_break,
        manpower, manpower_help, loading_time_manpower_help, machine_fault_preq, machine_fault_duration,
        quality_check, another, kaizen, five_s, manhour_in_line, manhour_helper, manhour_five_s,
        total_manhour, manhour_man_minutes_per_pcs, PE, bottle_neck_process, bottle_neck_process_duration,
        bottle_neck_mct, bottle_neck_mct_duration, setup_manpower, setup_ct, dangae
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cycle_number, line_id, pg, line_name, product_name, target, actual, loading_time, efficiency, delay, cycle_time, status,
        time_trouble, time_trouble_quality, andon, delta_time, shift, start_time, end_time, start_actual, end_actual,
        total_produced, record_count, year, month, day, time_only, loading_time_server, total_break,
        manpower, manpower_help, loading_time_manpower_help, machine_fault_preq, machine_fault_duration,
        quality_check, another, kaizen, five_s, manhour_in_line, manhour_helper, manhour_five_s,
        total_manhour, manhour_man_minutes_per_pcs, PE, bottle_neck_process, bottle_neck_process_duration,
        bottle_neck_mct, bottle_neck_mct_duration, setup_manpower, setup_ct, dangae
      ]
    );
    return { idPrimary: result.insertId, ...newManhour };
  },

  // Update By ID
  updateById: async (id, manhourData) => {
    const {
      cycle_number, line_id, pg, line_name, product_name, target, actual, loading_time, efficiency, delay, cycle_time, status,
      time_trouble, time_trouble_quality, andon, delta_time, shift, start_time, end_time, start_actual, end_actual,
      total_produced, record_count, year, month, day, time_only, loading_time_server, total_break,
      manpower, manpower_help, loading_time_manpower_help, machine_fault_preq, machine_fault_duration,
      quality_check, another, kaizen, five_s, manhour_in_line, manhour_helper, manhour_five_s,
      total_manhour, manhour_man_minutes_per_pcs, PE, bottle_neck_process, bottle_neck_process_duration,
      bottle_neck_mct, bottle_neck_mct_duration, setup_manpower, setup_ct, dangae
    } = manhourData;
    const [result] = await pool.execute(
      `UPDATE common_rail_3_manhour SET
        cycle_number = ?, line_id = ?, pg = ?, line_name = ?, product_name = ?, target = ?, actual = ?, loading_time = ?, efficiency = ?, delay = ?, cycle_time = ?, status = ?,
        time_trouble = ?, time_trouble_quality = ?, andon = ?, delta_time = ?, shift = ?, start_time = ?, end_time = ?, start_actual = ?, end_actual = ?,
        total_produced = ?, record_count = ?, year = ?, month = ?, day = ?, time_only = ?, loading_time_server = ?, total_break = ?,
        manpower = ?, manpower_help = ?, loading_time_manpower_help = ?, machine_fault_preq = ?, machine_fault_duration = ?,
        quality_check = ?, another = ?, kaizen = ?, five_s = ?, manhour_in_line = ?, manhour_helper = ?, manhour_five_s = ?,
        total_manhour = ?, manhour_man_minutes_per_pcs = ?, PE = ?, bottle_neck_process = ?, bottle_neck_process_duration = ?,
        bottle_neck_mct = ?, bottle_neck_mct_duration = ?, setup_manpower = ?, setup_ct = ?, dangae = ?
       WHERE idPrimary = ?`,
      [
        cycle_number, line_id, pg, line_name, product_name, target, actual, loading_time, efficiency, delay, cycle_time, status,
        time_trouble, time_trouble_quality, andon, delta_time, shift, start_time, end_time, start_actual, end_actual,
        total_produced, record_count, year, month, day, time_only, loading_time_server, total_break,
        manpower, manpower_help, loading_time_manpower_help, machine_fault_preq, machine_fault_duration,
        quality_check, another, kaizen, five_s, manhour_in_line, manhour_helper, manhour_five_s,
        total_manhour, manhour_man_minutes_per_pcs, PE, bottle_neck_process, bottle_neck_process_duration,
        bottle_neck_mct, bottle_neck_mct_duration, setup_manpower, setup_ct, dangae,
        id
      ]
    );
    if (result.affectedRows === 0) {
      return null; // Indicate that no rows were updated (e.g., ID not found)
    }
    return { idPrimary: parseInt(id), ...manhourData };
  },

  // Delete By ID
  deleteById: async (id) => {
    const [result] = await pool.execute(
      'DELETE FROM common_rail_3_manhour WHERE idPrimary = ?',
      [id]
    );
    return result.affectedRows > 0; // Return true if a row was deleted
  }
};

module.exports = Manhour;