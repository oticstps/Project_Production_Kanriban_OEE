const express = require('express');
const router = express.Router();
const commonRail12FilteredController = require('../controllers/commonRail12FilteredController');

// Get all data
router.get('/', commonRail12FilteredController.getAll);

// Get latest data with limit
router.get('/latest', commonRail12FilteredController.getLatest);

// Get data by specific date (YYYY-MM-DD)
router.get('/date/:date', commonRail12FilteredController.getByDate);

// Get data by datetime range (YYYY-MM-DD HH:MM:SS)
router.get('/datetime-range', commonRail12FilteredController.getByDateTimeRange);

// Get data by time range within a specific date
router.get('/time-range', commonRail12FilteredController.getByTimeRange);

// Get data by multiple days with time range
router.get('/multi-days-time-range', commonRail12FilteredController.getByMultipleDaysTimeRange);

// Get data with advanced filter
router.get('/filter', commonRail12FilteredController.getWithFilter);

// Get data with pagination
router.get('/paginated', commonRail12FilteredController.getWithPagination);

// Get hourly statistics for a date
router.get('/hourly-stats/:date', commonRail12FilteredController.getHourlyStats);

module.exports = router;