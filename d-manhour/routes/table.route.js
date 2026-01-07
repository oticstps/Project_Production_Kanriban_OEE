// src/routes/table.route.js
const express = require('express');
const router = express.Router();
const { getAllDataFromTable } = require('../controllers/table.controller');

router.get('/table/:table', getAllDataFromTable);

module.exports = router;