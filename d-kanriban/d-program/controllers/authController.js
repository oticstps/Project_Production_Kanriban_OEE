// src/controllers/authController.js
const pool = require("../config/db_core");

const login = async (req, res) => {
  const { nik, pin } = req.body;

  if (!nik || !pin) {
    return res.status(400).json({ message: "NIK dan PIN harus diisi." });
  }

  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE nik = ? AND pin = ?", [nik, pin]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "NIK atau PIN salah." });
    }

    const user = rows[0];

    // Di sini Anda bisa generate JWT token jika diperlukan
    // const token = jwt.sign({ id: user.id }, 'secret_key');

    return res.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        nik: user.nik,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

module.exports = { login };