var pool = require('./../pools.js').getConfigPool(),
    bcrypt = require('bcrypt-nodejs'),
    salt = 'lambdadbsalt',
    response = require('./response.js'),
    crypto = require('crypto'),
    userAPI = require('./../api/users.js');

var Users = {
    get: function(req, res, next) {
        pool.getConnection().then(function(connection) {
            connection.query(
                'SELECT * FROM lambdadb_config.users',
                [],
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

    create: function(req, res, next) {
        // Hash password
        bcrypt.hash(req.body.password, salt, null, function(err, hash) {
            pool.getConnection().then(function(connection) {
                var time = (new Date()).getTime();
                var sql_password = crypto.randomBytes(64).toString('hex');
                var sql_username = ('lr_' + req.body.username).substr(0, 15); // user names cannot be longer than 16 bytes
                var sql_user = userAPI(sql_username, sql_password);
                var secretToken = crypto.randomBytes(64).toString('hex').substr(0, 25);
                sql_user.create();

                connection.query(
                    'INSERT INTO lambdadb_config.users VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        req.body.username,
                        hash,
                        sql_username,
                        sql_password,
                        secretToken,
                        time,
                        time
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
        }, next);
    }
}

module.exports = Users;