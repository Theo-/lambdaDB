var masterPool = require('./../pools').getMaster(),
    _ = require('underscore'),
    logger = require('./../logger.js');

module.exports = function(userName, password, _pool) {
    var pool = _pool || masterPool;

    this.create = function() {
        return new Promise(function(resolve, reject) {
            pool.getConnection().then(function(connection) {
                logger('Creating user ' + userName);
                connection.query(
                    'CREATE USER \'' + userName + '\'@\'%\' IDENTIFIED BY \'' + password + '\';',
                    [],
                    function(err, result) {
                        connection.release();

                        if(err) {
                            return reject(err);
                        }

                        resolve(err);
                    }
                )
            }, reject);
        });
    }

    this.grantDatabase = function(databaseName) {
        return new Promise(function(resolve, reject) {
            pool.getConnection().then(function(connection) {
                logger('Granting user ' + userName + ' to ' + databaseName);
                connection.query(
                    'GRANT ALL PRIVILEGES ON ' + databaseName + '.* TO \'' + userName + '\'@\'%\';',
                    [],
                    function(err, result) {
                        connection.release();

                        if(err) {
                            return reject(err);
                        }

                        resolve(err);
                    }
                )
            }, reject);
        });
    }

    this.flush = function() {
        return new Promise(function(resolve, reject) {
            pool.getConnection().then(function(connection) {
                logger('Flushing privileges');
                connection.query(
                    'FLUSH PRIVILEGES;',
                    [],
                    function(err, result) {
                        connection.release();

                        if(err) {
                            return reject(err);
                        }

                        resolve(err);
                    }
                )
            }, reject);
        });
    }

    return this;
}