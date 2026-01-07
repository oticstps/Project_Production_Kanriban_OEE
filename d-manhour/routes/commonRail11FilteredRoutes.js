const express = require('express');
const router = express.Router();
const commonRail11FilteredController = require('../controllers/commonRail11FilteredController');

// Get all data
router.get('/', commonRail11FilteredController.getAll);

// Get latest data with limit
router.get('/latest', commonRail11FilteredController.getLatest);

// Get data by specific date (YYYY-MM-DD)
router.get('/date/:date', commonRail11FilteredController.getByDate);

// Get data by datetime range (YYYY-MM-DD HH:MM:SS)
router.get('/datetime-range', commonRail11FilteredController.getByDateTimeRange);

// Get data by time range within a specific date
router.get('/time-range', commonRail11FilteredController.getByTimeRange);

// Get data by multiple days with time range
router.get('/multi-days-time-range', commonRail11FilteredController.getByMultipleDaysTimeRange);

// Get data with advanced filter
router.get('/filter', commonRail11FilteredController.getWithFilter);

// Get data with pagination
router.get('/paginated', commonRail11FilteredController.getWithPagination);

// Get hourly statistics for a date
router.get('/hourly-stats/:date', commonRail11FilteredController.getHourlyStats);

module.exports = router;