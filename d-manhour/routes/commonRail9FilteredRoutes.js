const express = require('express');
const router = express.Router();
const commonRail9FilteredController = require('../controllers/commonRail9FilteredController');

// Get all data
router.get('/', commonRail9FilteredController.getAll);

// Get latest data with limit
router.get('/latest', commonRail9FilteredController.getLatest);

// Get data by specific date (YYYY-MM-DD)
router.get('/date/:date', commonRail9FilteredController.getByDate);

// Get data by datetime range (YYYY-MM-DD HH:MM:SS)
router.get('/datetime-range', commonRail9FilteredController.getByDateTimeRange);

// Get data by time range within a specific date
router.get('/time-range', commonRail9FilteredController.getByTimeRange);

// Get data by multiple days with time range
router.get('/multi-days-time-range', commonRail9FilteredController.getByMultipleDaysTimeRange);

// Get data with advanced filter
router.get('/filter', commonRail9FilteredController.getWithFilter);

// Get data with pagination
router.get('/paginated', commonRail9FilteredController.getWithPagination);

// Get hourly statistics for a date
router.get('/hourly-stats/:date', commonRail9FilteredController.getHourlyStats);

module.exports = router;