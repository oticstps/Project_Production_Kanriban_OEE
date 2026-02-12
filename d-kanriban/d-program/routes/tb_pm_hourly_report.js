


const express = require('express');
const router = express.Router();
const TbHourlyWhController = require('../controllers/tb_pm_hourly_report');

// GET all records
router.get('/', TbHourlyWhController.getAll);

// GET by ID
router.get('/:id', TbHourlyWhController.getById);

// POST create new record
router.post('/', TbHourlyWhController.create);

// PUT update record
router.put('/:id', TbHourlyWhController.update);

// DELETE record
router.delete('/:id', TbHourlyWhController.delete);

// GET by date range
router.get('/date-range', TbHourlyWhController.getByDateRange);

// GET by shift
router.get('/shift/:shift', TbHourlyWhController.getByShift);

// GET by power meter
router.get('/power-meter/:power_meter', TbHourlyWhController.getByPowerMeter);

module.exports = router;