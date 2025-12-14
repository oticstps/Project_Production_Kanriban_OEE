const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');
const checkRole = require('../middleware/role');
const router = express.Router();

router.get('/', authenticateToken, checkRole(['superadmin', 'admin']), getAllUsers);
router.get('/:id', authenticateToken, checkRole(['superadmin', 'admin']), getUserById);
router.put('/:id', authenticateToken, checkRole(['superadmin', 'admin']), updateUser);
router.delete('/:id', authenticateToken, checkRole(['superadmin']), deleteUser);

module.exports = router;