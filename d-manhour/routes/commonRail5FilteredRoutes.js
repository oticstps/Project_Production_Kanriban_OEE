const express = require('express');
const router = express.Router();
const commonRail5FilteredController = require('../controllers/commonRail5FilteredController');

// Get all data
router.get('/', commonRail5FilteredController.getAll);

// Get latest data with limit
router.get('/latest', commonRail5FilteredController.getLatest);

// Get data by specific date (YYYY-MM-DD)
router.get('/date/:date', commonRail5FilteredController.getByDate);

// Get data by datetime range (YYYY-MM-DD HH:MM:SS)
router.get('/datetime-range', commonRail5FilteredController.getByDateTimeRange);

// Get data by time range within a specific date
router.get('/time-range', commonRail5FilteredController.getByTimeRange);

// Get data by multiple days with time range
router.get('/multi-days-time-range', commonRail5FilteredController.getByMultipleDaysTimeRange);

// Get data with advanced filter
router.get('/filter', commonRail5FilteredController.getWithFilter);

// Get data with pagination
router.get('/paginated', commonRail5FilteredController.getWithPagination);

// Get hourly statistics for a date
router.get('/hourly-stats/:date', commonRail5FilteredController.getHourlyStats);

module.exports = router;