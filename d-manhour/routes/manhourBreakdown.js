const express = require('express');
const router = express.Router();
const CommonRailController = require('../controllers/manhourBreakdown');

// Get all data
router.get('/data', CommonRailController.getAllData);

// Get data for shift 1
router.get('/data/shift1', CommonRailController.getShift1Data);

// Get data for shift 2
router.get('/data/shift2', CommonRailController.getShift2Data);

// Get data by date range
router.get('/data/range', CommonRailController.getDataByDateRange);

// Get statistics
router.get('/statistics', CommonRailController.getStatistics);

module.exports = router;