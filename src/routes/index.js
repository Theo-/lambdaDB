var express = require('express');
var router = express.Router();

var mysqlRequest = require('./mysqlRequest.js');
router.post('/', mysqlRequest.parse);

var describe = require('./describe.js');
router.get('/db/describe/tables', describe.tables);
router.get('/db/describe/:table', describe.table);

var users = require('./users.js');
router.post('/users', users.create);
router.get('/users', users.get);
router.get('/me', users.me);
router.post('/users/login', users.logIn);

var database = require('./database.js');
router.get('/db/drop', database.drop);
router.get('/me/db', database.get);
router.post('/me/db', database.create);

var template = require('./template.js');
router.post('/me/db/template', template.parse);

module.exports = router;