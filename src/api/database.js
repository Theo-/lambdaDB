var masterPool = require('./../pools').getMaster(),
    table = require('./table.js'),
    logger = require('./../logger.js');

module.exports = function(databaseName, _pool) {
    var pool = _pool || masterPool;

    /**
     * Creates the database.
     */
    this.create = function() {
        return new Promise(function(resolve, reject) {
            pool.getConnection().then(function(connection) {
                logger('Creating database ' + databaseName);
                connection.query(
                    'CREATE DATABASE IF NOT EXISTS ' + databaseName, [], 
                    function(err, result) {
                        connection.release();
                        if(err) {
                            return reject(err);
                        }   
                        resolve(result);
                    }
                )
            }, reject)
        });
    }

    /**
     * Check if the database exists.
     */
    this.exists = function() {
        return new Promise(function(resolve, reject) {
            pool.getConnection().then(function(connection) {
                connection.query(
                    'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = \'' + databaseName + '\'', [], 
                    function(err, result) {
                        connection.release();
                        if(err || !result.SCHEMA_NAME) {
                            return reject(err);
                        } 
                        resolve(result);
                    }
                )
            }, reject)
        });
    }

    /**
     * Destroys the database
     */
    this.drop = function() {
        return new Promise(function(resolve, reject) {
            pool.getConnection().then(function(connection) {
                connection.query(
                    'DROP DATABASE IF EXISTS ' + databaseName, [], 
                    function(err, result) {
                        connection.release();
                        if(err) {
                            return reject(err);
                        } 
                        resolve(result);
                    }
                )
            }, reject)
        });
    }

    this.getTable = function(name) {
        return table(databaseName + '.' + name, pool);
    }

    return this;
}