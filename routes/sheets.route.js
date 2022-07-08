const express = require('express');
const { createMonthlySheet, createDailySheet, updateRateInDailySheet } = require('../controllers/sheets.controller');

const router = express.Router();

router.post('/month', (req, res) => createMonthlySheet(req, res));

router.post('/day', (req, res) => createDailySheet(req, res));

router.put('/rate', (req, res) => updateRateInDailySheet(req, res));

module.exports = router;
