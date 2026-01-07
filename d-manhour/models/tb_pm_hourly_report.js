const db = require('../config/db_core');

const TbHourlyWh = {




  getAll: async (limit = 500) => {
    const [rows] = await db.execute(
        'SELECT * FROM tb_pm_hourly_report ORDER BY idPrimary DESC LIMIT ?',
        [limit]
    );
    return rows;
  },


  getById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM tb_pm_hourly_report WHERE id = ?', [id]);
    return rows[0];
  },










  
  create: async (data) => {
    const { date_time, power_meter, value, shift, day, week, month, year } = data;
    const [result] = await db.execute(
      'INSERT INTO tb_pm_hourly_report (date_time, power_meter, value, shift, day, week, month, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [date_time, power_meter, value, shift, day, week, month, year]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { date_time, power_meter, value, shift, day, week, month, year } = data;
    const [result] = await db.execute(
      'UPDATE tb_pm_hourly_report SET date_time = ?, power_meter = ?, value = ?, shift = ?, day = ?, week = ?, month = ?, year = ? WHERE id = ?',
      [date_time, power_meter, value, shift, day, week, month, year, id]
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.execute('DELETE FROM tb_pm_hourly_report WHERE id = ?', [id]);
    return result.affectedRows;
  },

  getByDateRange: async (startDate, endDate) => {
    const [rows] = await db.execute(
      'SELECT * FROM tb_pm_hourly_report WHERE date_time BETWEEN ? AND ? ORDER BY date_time DESC',
      [startDate, endDate]
    );
    return rows;
  },

  getByShift: async (shift) => {
    const [rows] = await db.execute('SELECT * FROM tb_pm_hourly_report WHERE shift = ?', [shift]);
    return rows;
  },

  getByPowerMeter: async (power_meter) => {
    const [rows] = await db.execute('SELECT * FROM tb_pm_hourly_report WHERE power_meter = ?', [power_meter]);
    return rows;
  }
};

module.exports = TbHourlyWh;