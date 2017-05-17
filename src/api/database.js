var masterPool = require('./../pools').getMaster(),
    table = require('./table.js');

module.exports = function(databaseName, _pool) {
    var pool = _pool || masterPool;

    this.create = function() {
        return new Promise(function(resolve, reject) {
            pool.getConnection().then(function(connection) {
                connection.query(
                    'CREATE DATABASE ' + databaseName, [], function(err, result) {
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