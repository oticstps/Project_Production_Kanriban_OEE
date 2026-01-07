const express = require('express');
const router = express.Router();
const commonRail6FilteredController = require('../controllers/commonRail6FilteredController');

// Get all data
router.get('/', commonRail6FilteredController.getAll);

// Get latest data with limit
router.get('/latest', commonRail6FilteredController.getLatest);

// Get data by specific date (YYYY-MM-DD)
router.get('/date/:date', commonRail6FilteredController.getByDate);

// Get data by datetime range (YYYY-MM-DD HH:MM:SS)
router.get('/datetime-range', commonRail6FilteredController.getByDateTimeRange);

// Get data by time range within a specific date
router.get('/time-range', commonRail6FilteredController.getByTimeRange);

// Get data by multiple days with time range
router.get('/multi-days-time-range', commonRail6FilteredController.getByMultipleDaysTimeRange);

// Get data with advanced filter
router.get('/filter', commonRail6FilteredController.getWithFilter);

// Get data with pagination
router.get('/paginated', commonRail6FilteredController.getWithPagination);

// Get hourly statistics for a date
router.get('/hourly-stats/:date', commonRail6FilteredController.getHourlyStats);

module.exports = router;