var response = require('./response.js'),
    databaseAPI = require('./../api/database.js'),
    pools = require('./../pools.js'),
    usersAPI = require('./../api/users.js');

var database = {
    get: function(req, res, next) {
        var sql_role = req.user.sql_role;

        pools.getMaster().getConnection().then(function(connection) {
            connection.query(
                'SELECT * FROM mysql.db WHERE User=?',
                [
                    sql_role
                ],
                function(err, rows) {
                    connection.release();

                    if(err) {
                        return next(err);
                    }

                    res.json(response.format(rows));
                }
            )
        }, next);
    },

    drop: function(req, res, next) {
        var dbName = req.trueDatabaseName;
        var database = databaseAPI(dbName);
        var sql_user = usersAPI(req.user.sql_role);

        database.drop().then(function() {
            sql_user.removeAcessTo(dbName);
        }).then(function() {
            res.json(response.format({}));
        }).catch(next);
    },

    create: function(req, res, next) {
        var dbName = req.user.username + '_' + req.body.name;
        var sql_user = usersAPI(req.user.sql_role);
        var db = databaseAPI(dbName);

        db.create().then(function(result) {
            return sql_user.grantDatabase(dbName);
        }).then(function(result) {
            res.json(response.format(result));
        }).catch(next);
    }
};

module.exports = database;