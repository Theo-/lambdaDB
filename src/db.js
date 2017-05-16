var mysql = require('mysql');
var q = require('q');
var configParser = require('./configParser.js');

var Connection = function(_mysqlConfig) {
    this.pool = null;

    this.init = function() {
        this.pool = mysql.createPool(_mysqlConfig);
    }.bind(this);

    this.acquire = function(callback, attemp) {
        attemp = attemp || 0;

        this.pool.getConnection(function(err, connection) {
            /* istanbul ignore if */
            if (err || !connection.query) {
                console.log('Error while connection to database', err);

                if (attemp === 0) {
                    this.init();
                }

                this.acquire(callback, attemp + 1);
            } else {
                callback(err, connection);
            }
        }.bind(this));
    }.bind(this);

    // Grab a connection to the DB
    this.getConnection = function() {
        var defer = q.defer();

        this.acquire(function(err, connection) {
            /* istanbul ignore if */
            if (err) {
                defer.reject(err);
                if (connection) {
                    connection.release();
                }
                return;
            } else {
                defer.resolve(connection);
            }
        });

        return defer.promise;
    }.bind(this);

    this.init();
}

module.exports = Connection;