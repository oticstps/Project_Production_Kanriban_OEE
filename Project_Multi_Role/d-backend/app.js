// db_name : wwwpasba_database_v1
// db_user : wwwpasba_wandaadii
// db_password : -Lr@F[,EmbMY



const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

// Database connection pool
// const pool = mysql.createPool({
//   host: 'api-v1.pasbatron.net',
//   user: 'wwwpasba_wandaadii',
//   password: '-Lr@F[,EmbMY',
//   database: 'wwwpasba_database_v1',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });



const pool = mysql.createPool({
  host: 'localhost',
  user: 'wandaadii',
  password: 'pasbatron',
  database: 'database_v1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});




// Middleware untuk verifikasi token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};






// Middleware untuk cek role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};





// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Validasi role
    const validRoles = ['admin', 'manager', 'supervisor', 'leader', 'user'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});






// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});







// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users (Admin only)
app.get('/api/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM users'
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});






// Update user (Admin, Manager)
app.put('/api/users/:id', authenticateToken, authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const { id } = req.params;

    await pool.execute(
      'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?',
      [username, email, role, id]
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});






// Delete user (Admin only)
app.delete('/api/users/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});






// Dashboard stats (Admin, Manager, Supervisor)
app.get('/api/dashboard/stats', authenticateToken, authorizeRoles('admin', 'manager', 'supervisor'), async (req, res) => {
  try {
    const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [roleStats] = await pool.execute('SELECT role, COUNT(*) as count FROM users GROUP BY role');
    
    res.json({
      totalUsers: userCount[0].count,
      roleDistribution: roleStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});







// Projects endpoint (Leader, Manager, Admin can create)
app.post('/api/projects', authenticateToken, authorizeRoles('admin', 'manager', 'leader'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)',
      [name, description, req.user.id]
    );
    res.status(201).json({ message: 'Project created', projectId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});






// Get all projects (All authenticated users)
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const [projects] = await pool.execute(
      'SELECT p.*, u.username as creator FROM projects p JOIN users u ON p.created_by = u.id'
    );
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});








app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});