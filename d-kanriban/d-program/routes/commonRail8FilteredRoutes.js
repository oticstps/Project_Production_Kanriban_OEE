const express = require('express');
const router = express.Router();
const commonRail8FilteredController = require('../controllers/commonRail8FilteredController');

// Get all data
router.get('/', commonRail8FilteredController.getAll);

// Get latest data with limit
router.get('/latest', commonRail8FilteredController.getLatest);

// Get data by specific date (YYYY-MM-DD)
router.get('/date/:date', commonRail8FilteredController.getByDate);

// Get data by datetime range (YYYY-MM-DD HH:MM:SS)
router.get('/datetime-range', commonRail8FilteredController.getByDateTimeRange);

// Get data by time range within a specific date
router.get('/time-range', commonRail8FilteredController.getByTimeRange);

// Get data by multiple days with time range
router.get('/multi-days-time-range', commonRail8FilteredController.getByMultipleDaysTimeRange);

// Get data with advanced filter
router.get('/filter', commonRail8FilteredController.getWithFilter);

// Get data with pagination
router.get('/paginated', commonRail8FilteredController.getWithPagination);

// Get hourly statistics for a date
router.get('/hourly-stats/:date', commonRail8FilteredController.getHourlyStats);

module.exports = router;