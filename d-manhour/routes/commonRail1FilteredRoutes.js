const express = require('express');
const router = express.Router();
const commonRail1FilteredController = require('../controllers/commonRail1FilteredController');

// Get all data
router.get('/', commonRail1FilteredController.getAll);

// Get latest data with limit
router.get('/latest', commonRail1FilteredController.getLatest);

// Get data by specific date (YYYY-MM-DD)
router.get('/date/:date', commonRail1FilteredController.getByDate);

// Get data by datetime range (YYYY-MM-DD HH:MM:SS)
router.get('/datetime-range', commonRail1FilteredController.getByDateTimeRange);

// Get data by time range within a specific date
router.get('/time-range', commonRail1FilteredController.getByTimeRange);

// Get data by multiple days with time range
router.get('/multi-days-time-range', commonRail1FilteredController.getByMultipleDaysTimeRange);

// Get data with advanced filter
router.get('/filter', commonRail1FilteredController.getWithFilter);

// Get data with pagination
router.get('/paginated', commonRail1FilteredController.getWithPagination);

// Get hourly statistics for a date
router.get('/hourly-stats/:date', commonRail1FilteredController.getHourlyStats);

module.exports = router;