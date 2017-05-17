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
                            console.log(err)
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