const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.get('/', indexController.getHomePage);

module.exports = router; 