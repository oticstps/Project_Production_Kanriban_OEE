const express = require('express');
const router = express.Router();
const commonRail2FilteredController = require('../controllers/commonRail2FilteredController');

// Get all data
router.get('/', commonRail2FilteredController.getAll);

// Get latest data with limit
router.get('/latest', commonRail2FilteredController.getLatest);

// Get data by specific date (YYYY-MM-DD)
router.get('/date/:date', commonRail2FilteredController.getByDate);

// Get data by datetime range (YYYY-MM-DD HH:MM:SS)
router.get('/datetime-range', commonRail2FilteredController.getByDateTimeRange);

// Get data by time range within a specific date
router.get('/time-range', commonRail2FilteredController.getByTimeRange);

// Get data by multiple days with time range
router.get('/multi-days-time-range', commonRail2FilteredController.getByMultipleDaysTimeRange);

// Get data with advanced filter
router.get('/filter', commonRail2FilteredController.getWithFilter);

// Get data with pagination
router.get('/paginated', commonRail2FilteredController.getWithPagination);

// Get hourly statistics for a date
router.get('/hourly-stats/:date', commonRail2FilteredController.getHourlyStats);

module.exports = router;