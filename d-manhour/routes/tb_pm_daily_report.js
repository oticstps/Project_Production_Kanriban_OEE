


const express = require('express');
const router = express.Router();
const TbDailyWhController = require('../controllers/tb_pm_daily_report');

// GET all records
router.get('/', TbDailyWhController.getAll);

// GET by ID
router.get('/:id', TbDailyWhController.getById);

// POST create new record
router.post('/', TbDailyWhController.create);

// PUT update record
router.put('/:id', TbDailyWhController.update);

// DELETE record
router.delete('/:id', TbDailyWhController.delete);

// GET by date range
router.get('/date-range', TbDailyWhController.getByDateRange);

// GET by shift
router.get('/shift/:shift', TbDailyWhController.getByShift);

// GET by power meter
router.get('/power-meter/:power_meter', TbDailyWhController.getByPowerMeter);

module.exports = router;