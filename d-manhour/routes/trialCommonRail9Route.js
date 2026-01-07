// src/routes/commonRailRoutesCr9.js

const express = require("express");
const router = express.Router();
const controller = require("../controllers/trialCommonRail9Controller");

// GET
router.get("/trialcr9", controller.getAllCr9);





module.exports = router;