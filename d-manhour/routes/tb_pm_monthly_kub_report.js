const express = require('express');
const router = express.Router();
const TbMonthlyKubWhController = require('../controllers/tb_pm_monthly_kub_report');

// GET all records
router.get('/', TbMonthlyKubWhController.getAll);

// GET by ID
router.get('/:id', TbMonthlyKubWhController.getById);

// POST create new record
router.post('/', TbMonthlyKubWhController.create);

// PUT update record
router.put('/:id', TbMonthlyKubWhController.update);

// DELETE record
router.delete('/:id', TbMonthlyKubWhController.delete);

// GET by date range
router.get('/date-range', TbMonthlyKubWhController.getByDateRange);

// GET by shift
router.get('/shift/:shift', TbMonthlyKubWhController.getByShift);

// GET by power meter
router.get('/power-meter/:power_meter', TbMonthlyKubWhController.getByPowerMeter);

module.exports = router;