const express = require('express');
const router = express.Router();
const EnergyController = require('../controllers/EnergyController');

router.get('/plant2/energyShiftly', EnergyController.getDashboardData);

module.exports = router;