


const express = require('express');
const router = express.Router();
const TbKub1TotalWhController = require('../controllers/tb_kub1_total_kwh');

// GET all records
router.get('/', TbKub1TotalWhController.getAll);

// GET by ID
router.get('/:id', TbKub1TotalWhController.getById);

// POST create new record
router.post('/', TbKub1TotalWhController.create);

// PUT update record
router.put('/:id', TbKub1TotalWhController.update);

// DELETE record
router.delete('/:id', TbKub1TotalWhController.delete);

// GET by date range
router.get('/date-range', TbKub1TotalWhController.getByDateRange);

// GET by shift
router.get('/shift/:shift', TbKub1TotalWhController.getByShift);

// GET by power meter
router.get('/power-meter/:power_meter', TbKub1TotalWhController.getByPowerMeter);

module.exports = router;