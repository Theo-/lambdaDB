var masterPool = require('./../pools').getMaster(),
    _ = require('underscore');

module.exports = function(tableName, _pool) {
    var pool = _pool || masterPool;

    this.create = function(fields) {
        return new Promise(function(resolve, reject) {
            var primary_keys = [];

            var columns = _.reduce(fields, function(memo, field) {
                var AUTO_INCREMENT = field.auto_increment ? ' AUTO_INCREMENT' : '';
                var UNIQUE = field.unique ? ' UNIQUE' : '';
                if(field.auto_increment || field.primary) {
                    primary_keys.push(field.name);
                }
                return memo + field.name + ' ' + field.type + AUTO_INCREMENT + UNIQUE + ',\n'
            }, "");

            columns = columns.slice(0, -2); // remove last \n and ,

            var primary_keys_string = '';
            if(primary_keys.length != 0) {
                columns += ',\n';
                var primary_keys_string = _.reduce(primary_keys, function(memo, key) {
                    return memo + key + ',';
                }, '')

                primary_keys_string = primary_keys_string.slice(0, -1); // remove last ,
                primary_keys_string = 'PRIMARY KEY(' + primary_keys_string + ')';
            }

            pool.getConnection().then(function(connection) {
                var params = columns + primary_keys_string;
                
                connection.query(
                    'CREATE TABLE IF NOT EXISTS ' + tableName + '('+ params +')', [], function(err, result) {
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

    return this;
}