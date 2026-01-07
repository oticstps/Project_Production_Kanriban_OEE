


const express = require('express');
const router = express.Router();
const TbKub1ActivePowerController = require('../controllers/tb_kub1_active_power');

// GET all records
router.get('/', TbKub1ActivePowerController.getAll);

// GET by ID
router.get('/:id', TbKub1ActivePowerController.getById);

// POST create new record
router.post('/', TbKub1ActivePowerController.create);

// PUT update record
router.put('/:id', TbKub1ActivePowerController.update);

// DELETE record
router.delete('/:id', TbKub1ActivePowerController.delete);

// GET by date range
router.get('/date-range', TbKub1ActivePowerController.getByDateRange);

// GET by shift
router.get('/shift/:shift', TbKub1ActivePowerController.getByShift);

// GET by power meter
router.get('/power-meter/:power_meter', TbKub1ActivePowerController.getByPowerMeter);

module.exports = router;