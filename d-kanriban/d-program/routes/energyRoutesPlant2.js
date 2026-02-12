const express = require('express');
const router = express.Router();
const EnergyControllerPlant2 = require('../controllers/EnergyControllerPlant2');

router.get('/plant2/energyShiftly', EnergyControllerPlant2.getDashboardData);

module.exports = router;