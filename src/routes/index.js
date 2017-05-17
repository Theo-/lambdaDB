var express = require('express');
var router = express.Router();

var mysqlRequest = require('./mysqlRequest.js');
router.post('/', mysqlRequest.parse);

var describe = require('./describe.js');
router.get('/describe/tables', describe.tables);
router.get('/describe/:database/tables', describe.tables);
router.get('/describe/:database/:table', describe.table);

var users = require('./users.js');
router.post('/users', users.create);
router.get('/users', users.get);
router.post('/users/login', users.logIn);

var database = require('./database.js');
router.post('/database/new', database.create);
router.get('/database', database.get);

var template = require('./template.js');
router.post('/database/template', template.parse);

module.exports = router;