const express = require('express');
const router = express.Router();
const commonRail3FilteredController = require('../controllers/commonRail3FilteredController');

// Get all data
router.get('/', commonRail3FilteredController.getAll);

// Get latest data with limit
router.get('/latest', commonRail3FilteredController.getLatest);

// Get data by specific date (YYYY-MM-DD)
router.get('/date/:date', commonRail3FilteredController.getByDate);

// Get data by datetime range (YYYY-MM-DD HH:MM:SS)
router.get('/datetime-range', commonRail3FilteredController.getByDateTimeRange);

// Get data by time range within a specific date
router.get('/time-range', commonRail3FilteredController.getByTimeRange);

// Get data by multiple days with time range
router.get('/multi-days-time-range', commonRail3FilteredController.getByMultipleDaysTimeRange);

// Get data with advanced filter
router.get('/filter', commonRail3FilteredController.getWithFilter);

// Get data with pagination
router.get('/paginated', commonRail3FilteredController.getWithPagination);

// Get hourly statistics for a date
router.get('/hourly-stats/:date', commonRail3FilteredController.getHourlyStats);

module.exports = router;