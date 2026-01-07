


const express = require('express');
const router = express.Router();
const TbShiftlyKubWhController = require('../controllers/tb_pm_shiftly_kub_report');

// GET all records
router.get('/', TbShiftlyKubWhController.getAll);

// GET by ID
router.get('/:id', TbShiftlyKubWhController.getById);

// POST create new record
router.post('/', TbShiftlyKubWhController.create);

// PUT update record
router.put('/:id', TbShiftlyKubWhController.update);

// DELETE record
router.delete('/:id', TbShiftlyKubWhController.delete);

// GET by date range
router.get('/date-range', TbShiftlyKubWhController.getByDateRange);

// GET by shift
router.get('/shift/:shift', TbShiftlyKubWhController.getByShift);

// GET by power meter
router.get('/power-meter/:power_meter', TbShiftlyKubWhController.getByPowerMeter);

module.exports = router;