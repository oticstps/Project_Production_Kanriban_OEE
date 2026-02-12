// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/energyController");

// // GET
// router.get("/electrical-monthly", controller.getMonthly);
// router.get("/electrical-monthly/:id", controller.getIdMonthly); // ✅ diperbaiki

// // POST / PUT / DELETE
// router.post("/electrical-monthly", controller.create);
// router.put("/electrical-monthly/:id", controller.update);
// router.delete("/electrical-monthly/:id", controller.remove);

// module.exports = router;


const express = require('express');
const router = express.Router();
const energyElectricalControllerMonthly = require('../controllers/energyElectricalControllerMonthly');

// Get all PM monthly report data
router.get('/pm-monthly-report', energyElectricalControllerMonthly.getAllPmMonthlyReport);

// Get PM monthly report by ID
router.get('/pm-monthly-report/id/:id', energyElectricalControllerMonthly.getPmMonthlyReportById);

// Get PM monthly report by type
router.get('/pm-monthly-report/type/:type', energyElectricalControllerMonthly.getPmMonthlyReportByType);

// Get PM monthly report by line name
router.get('/pm-monthly-report/line/:line', energyElectricalControllerMonthly.getPmMonthlyReportByLine);

// Get PM monthly report by month and year
router.get('/pm-monthly-report/month/:month/year/:year', energyElectricalControllerMonthly.getPmMonthlyReportByMonthYear);

// Get PM monthly report by date range
router.get('/pm-monthly-report/date-range', energyElectricalControllerMonthly.getPmMonthlyReportByDateRange);

module.exports = router;