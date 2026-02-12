


const express = require('express');
const router = express.Router();
const TbWeeklyWhController = require('../controllers/tb_pm_weekly_report');

// GET all records
router.get('/', TbWeeklyWhController.getAll);

// GET by ID
router.get('/:id', TbWeeklyWhController.getById);

// POST create new record
router.post('/', TbWeeklyWhController.create);

// PUT update record
router.put('/:id', TbWeeklyWhController.update);

// DELETE record
router.delete('/:id', TbWeeklyWhController.delete);

// GET by date range
router.get('/date-range', TbWeeklyWhController.getByDateRange);

// GET by shift
router.get('/shift/:shift', TbWeeklyWhController.getByShift);

// GET by power meter
router.get('/power-meter/:power_meter', TbWeeklyWhController.getByPowerMeter);

module.exports = router;