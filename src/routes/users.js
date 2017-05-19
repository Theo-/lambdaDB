var pool = require('./../pools.js').getConfigPool(),
    bcrypt = require('bcrypt-nodejs'),
    salt = "mybacon",
    response = require('./response.js'),
    crypto = require('crypto'),
    userAPI = require('./../api/users.js'),
    databaseAPI = require('./../api/database.js');

var Users = {
    get: function(req, res, next) {
        if(!req.master) {
            throw new Error('Must use the master secret key');
        }

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

    me: function(req, res, next) {
        delete req.user.password;
        req.user.sql_server = process.env.MYSQL_HOST + ':' + process.env.MYSQL_PORT;
        res.json(response.format(req.user));
    },

    logIn: function(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;

        pool.getConnection().then(function(connection) {
            connection.query(
                'SELECT * FROM lambdadb_config.users WHERE username=?',
                [
                    username
                ],
                function(err, rows) {
                    connection.release();

                    if(err) {
                        return next(err);
                    }

                    if(rows.length != 1) {
                        return next(new Error('Unauthorized'));
                    }

                    var userData = rows[0];
                    var same = bcrypt.compareSync(password, userData.password);

                    if(same) {
                        delete userData.password;
                        res.json(response.format(userData));
                    } else {
                        next(new Error('Unauthorized'));
                    }
                }
            )
        })
    },

    create: function(req, res, next) {
        if(!req.master) {
            // Allow "public" registering
            //throw new Error('Must use the master secret key to create an account');
        }

        if(!/^[0-9_a-z]+$/.test(req.body.username)) {
            throw new Error('Username can only contain letters and number');
        }

        if(req.body.password.length < 4) {
            throw new Error('Password must be at least 4 characters');
        }

        // Hash password
        bcrypt.hash(req.body.password, null, null, function(err, hash) {
            if(err) {
                throw err;
            }

            pool.getConnection().then(function(connection) {
                var time = (new Date()).getTime();
                var sql_password = crypto.randomBytes(64).toString('hex').substr(0, 35);;
                var sql_username = ('lr_' + req.body.username).substr(0, 15); // user names cannot be longer than 16 bytes
                var sql_user = userAPI(sql_username, sql_password);
                var secretToken = crypto.randomBytes(64).toString('hex').substr(0, 25);
                sql_user.create().then(function() {
                    return databaseAPI(sql_username).create();
                }).then(function() {
                    return sql_user.grantDatabase(sql_username);
                }).then(function() {
                    return sql_user.flush();
                });

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