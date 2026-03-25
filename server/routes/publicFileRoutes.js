const express = require('express');
const router = express.Router();
const { proxyFile } = require('../controllers/publicFileController');

// Public proxy for files to control headers (inline vs attachment)
router.get('/file', proxyFile);

module.exports = router;
