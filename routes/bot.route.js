const express = require('express');
const { getPaymentMethod, updatePaymentSystem } = require('../controllers/bot.controller');
const { isAuthenticated } = require('../middlewares/middlewares');

const router = express.Router();

router.get('/commissions', isAuthenticated, (req, res) => getPaymentMethod(req, res));

router.put('/commissions', isAuthenticated, (req, res) => updatePaymentSystem(req, res));

module.exports = router;
