const express = require('express');
const router = express.Router();
const commonRail7FilteredController = require('../controllers/commonRail7FilteredController');

// Get all data
router.get('/', commonRail7FilteredController.getAll);

// Get latest data with limit
router.get('/latest', commonRail7FilteredController.getLatest);

// Get data by specific date (YYYY-MM-DD)
router.get('/date/:date', commonRail7FilteredController.getByDate);

// Get data by datetime range (YYYY-MM-DD HH:MM:SS)
router.get('/datetime-range', commonRail7FilteredController.getByDateTimeRange);

// Get data by time range within a specific date
router.get('/time-range', commonRail7FilteredController.getByTimeRange);

// Get data by multiple days with time range
router.get('/multi-days-time-range', commonRail7FilteredController.getByMultipleDaysTimeRange);

// Get data with advanced filter
router.get('/filter', commonRail7FilteredController.getWithFilter);

// Get data with pagination
router.get('/paginated', commonRail7FilteredController.getWithPagination);

// Get hourly statistics for a date
router.get('/hourly-stats/:date', commonRail7FilteredController.getHourlyStats);

module.exports = router;