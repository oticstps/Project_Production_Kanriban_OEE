const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  // Create new user
  create: async (username, name, pin) => {
    try {
      // Hash PIN
      const salt = await bcrypt.genSalt(12);
      const hashedPin = await bcrypt.hash(pin, salt);

      const [result] = await pool.execute(
        'INSERT INTO users (username, name, pin, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [username, name, hashedPin]
      );

      return {
        id: result.insertId,
        username,
        name,
        created_at: new Date()
      };
    } catch (error) {
      throw error;
    }
  },

  // Find user by username
  findByUsername: async (username) => {
    try {
      const [rows] = await pool.execute(
        'SELECT id, username, name, pin, created_at, updated_at FROM users WHERE username = ?',
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Find user by ID
  findById: async (id) => {
    try {
      const [rows] = await pool.execute(
        'SELECT id, username, name, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },

  // Compare PIN
  comparePin: async (enteredPin, storedHash) => {
    try {
      return await bcrypt.compare(enteredPin, storedHash);
    } catch (error) {
      throw new Error('PIN comparison failed');
    }
  }
};

module.exports = User;