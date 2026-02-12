const express = require('express');
const router = express.Router();
const commonRail10FilteredController = require('../controllers/commonRail10FilteredController');

// Get all data
router.get('/', commonRail10FilteredController.getAll);

// Get latest data with limit
router.get('/latest', commonRail10FilteredController.getLatest);

// Get data by specific date (YYYY-MM-DD)
router.get('/date/:date', commonRail10FilteredController.getByDate);

// Get data by datetime range (YYYY-MM-DD HH:MM:SS)
router.get('/datetime-range', commonRail10FilteredController.getByDateTimeRange);

// Get data by time range within a specific date
router.get('/time-range', commonRail10FilteredController.getByTimeRange);

// Get data by multiple days with time range
router.get('/multi-days-time-range', commonRail10FilteredController.getByMultipleDaysTimeRange);

// Get data with advanced filter
router.get('/filter', commonRail10FilteredController.getWithFilter);

// Get data with pagination
router.get('/paginated', commonRail10FilteredController.getWithPagination);

// Get hourly statistics for a date
router.get('/hourly-stats/:date', commonRail10FilteredController.getHourlyStats);

module.exports = router;