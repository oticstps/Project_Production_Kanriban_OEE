const db = require('../config/database');

class User {
  static async findAll() {
    const [rows] = await db.execute('SELECT id, username, email, role FROM users');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT id, username, email, role FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await db.execute('SELECT id, username, email, password, role FROM users WHERE username = ?', [username]);
    return rows[0];
  }

  static async create(userData) {
    const { username, email, password, role } = userData;
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, password, role]
    );
    return result.insertId;
  }

  static async update(id, userData) {
    const { username, email, role } = userData;
    await db.execute(
      'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
      [username, email, role, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
  }
}

module.exports = User;