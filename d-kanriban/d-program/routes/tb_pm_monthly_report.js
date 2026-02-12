
const express = require('express');
const router = express.Router();
const TbMonthlyWhController = require('../controllers/tb_pm_monthly_report');

// GET all records
router.get('/', TbMonthlyWhController.getAll);

// GET by ID
router.get('/:id', TbMonthlyWhController.getById);

// POST create new record
router.post('/', TbMonthlyWhController.create);

// PUT update record
router.put('/:id', TbMonthlyWhController.update);

// DELETE record
router.delete('/:id', TbMonthlyWhController.delete);

// GET by date range
router.get('/date-range', TbMonthlyWhController.getByDateRange);

// GET by shift
router.get('/shift/:shift', TbMonthlyWhController.getByShift);

// GET by power meter
router.get('/power-meter/:power_meter', TbMonthlyWhController.getByPowerMeter);

module.exports = router;