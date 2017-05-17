var express = require('express');
var router = express.Router();

var mysqlRequest = require('./mysqlRequest.js');
router.post('/', mysqlRequest.parse);

var describe = require('./describe.js');
router.get('/describe/tables', describe.tables);
router.get('/describe/:table', describe.table);

var users = require('./users.js');
router.post('/users', users.create);

module.exports = router;