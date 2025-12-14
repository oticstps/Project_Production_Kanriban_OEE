const express = require('express');
const {
  getAllData,
  getDataByDate,
  getDataByProduct,
  createData,
  updateData,
  deleteData
} = require('../controllers/dataController');
const authenticateToken = require('../middleware/auth');
const checkRole = require('../middleware/role');
const router = express.Router();

router.get('/', authenticateToken, getAllData);
router.get('/date/:date', authenticateToken, getDataByDate);
router.get('/product/:productName', authenticateToken, getDataByProduct);
router.post('/', authenticateToken, checkRole(['superadmin', 'admin']), createData);
router.put('/:id', authenticateToken, checkRole(['superadmin', 'admin']), updateData);
router.delete('/:id', authenticateToken, checkRole(['superadmin', 'admin']), deleteData);

module.exports = router;