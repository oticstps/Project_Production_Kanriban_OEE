const express = require('express');
const router = express.Router();
const commonRail4FilteredController = require('../controllers/commonRail4FilteredController');

// Get all data
router.get('/', commonRail4FilteredController.getAll);

// Get latest data with limit
router.get('/latest', commonRail4FilteredController.getLatest);

// Get data by specific date (YYYY-MM-DD)
router.get('/date/:date', commonRail4FilteredController.getByDate);

// Get data by datetime range (YYYY-MM-DD HH:MM:SS)
router.get('/datetime-range', commonRail4FilteredController.getByDateTimeRange);

// Get data by time range within a specific date
router.get('/time-range', commonRail4FilteredController.getByTimeRange);

// Get data by multiple days with time range
router.get('/multi-days-time-range', commonRail4FilteredController.getByMultipleDaysTimeRange);

// Get data with advanced filter
router.get('/filter', commonRail4FilteredController.getWithFilter);

// Get data with pagination
router.get('/paginated', commonRail4FilteredController.getWithPagination);

// Get hourly statistics for a date
router.get('/hourly-stats/:date', commonRail4FilteredController.getHourlyStats);

module.exports = router;