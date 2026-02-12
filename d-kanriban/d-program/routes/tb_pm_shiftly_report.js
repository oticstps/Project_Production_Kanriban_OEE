


const express = require('express');
const router = express.Router();
const TbShiftlyWhController = require('../controllers/tb_pm_shiftly_report');

// GET all records
router.get('/', TbShiftlyWhController.getAll);

// GET by ID
router.get('/:id', TbShiftlyWhController.getById);

// POST create new record
router.post('/', TbShiftlyWhController.create);

// PUT update record
router.put('/:id', TbShiftlyWhController.update);

// DELETE record
router.delete('/:id', TbShiftlyWhController.delete);

// GET by date range
router.get('/date-range', TbShiftlyWhController.getByDateRange);

// GET by shift
router.get('/shift/:shift', TbShiftlyWhController.getByShift);

// GET by power meter
router.get('/power-meter/:power_meter', TbShiftlyWhController.getByPowerMeter);

module.exports = router;