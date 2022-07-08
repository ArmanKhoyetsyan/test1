const express = require('express');
const { notifyUsers } = require('../controllers/users.controller');
const { isAuthenticated } = require('../middlewares/middlewares');

const router = express.Router();

router.post('/notify', isAuthenticated, (req, res) => notifyUsers(req, res));

module.exports = router;
