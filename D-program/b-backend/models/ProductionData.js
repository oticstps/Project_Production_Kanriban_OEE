const db = require('../config/database');

class ProductionData {
  static async findAll() {
    const [rows] = await db.execute(`
      SELECT 
        id,
        date,
        name_product,
        shift_1,
        shift_2,
        duration_menit,
        lt_menit,
        created_at
      FROM production_data
      ORDER BY date DESC
    `);
    return rows;
  }

  static async findByDate(date) {
    const [rows] = await db.execute(`
      SELECT 
        id,
        date,
        name_product,
        shift_1,
        shift_2,
        duration_menit,
        lt_menit,
        created_at
      FROM production_data
      WHERE date = ?
      ORDER BY date DESC
    `, [date]);
    return rows;
  }

  static async findByProduct(productName) {
    const [rows] = await db.execute(`
      SELECT 
        id,
        date,
        name_product,
        shift_1,
        shift_2,
        duration_menit,
        lt_menit,
        created_at
      FROM production_data
      WHERE name_product LIKE ?
      ORDER BY date DESC
    `, [`%${productName}%`]);
    return rows;
  }

  static async create(data) {
    const { date, name_product, shift_1, shift_2, duration_menit, lt_menit } = data;
    const [result] = await db.execute(
      'INSERT INTO production_data (date, name_product, shift_1, shift_2, duration_menit, lt_menit) VALUES (?, ?, ?, ?, ?, ?)',
      [date, name_product, shift_1, shift_2, duration_menit, lt_menit]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { date, name_product, shift_1, shift_2, duration_menit, lt_menit } = data;
    await db.execute(
      'UPDATE production_data SET date = ?, name_product = ?, shift_1 = ?, shift_2 = ?, duration_menit = ?, lt_menit = ? WHERE id = ?',
      [date, name_product, shift_1, shift_2, duration_menit, lt_menit, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM production_data WHERE id = ?', [id]);
  }
}

module.exports = ProductionData;