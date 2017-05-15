var express = require('express');
var router = express.Router();

var mysqlRequest = require('./mysqlRequest.js');
router.post('/', mysqlRequest.parse);

module.exports = router;