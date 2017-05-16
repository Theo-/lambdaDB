var pool = require('./../pools.js').getMaster();
var response = require('./response.js');

module.exports = {
    table: function(req, res, next) {
        var tableName = req.params.table;

        pool.getConnection().then(function(connection) {
            connection.query("SHOW COLUMNS FROM "+tableName, [],
                function(err, rows) {
                    connection.release();

                    if(err) {
                        if(err.message.startsWith('ER_NO_SUCH_TABLE')) {
                            return next(new Error('Table \''+tableName+'\' could not be found.'));
                        }
                        return next(err);
                    }
                    res.json(response.format(rows));
            });
        }, next);
    },

    tables: function(req, res, next) {
        pool.getConnection().then(function(connection) {
            connection.query("SHOW TABLES", [],
                function(err, rows) {
                    connection.release();

                    if(err) {
                        return next(err);
                    }
                    res.json(response.format(rows));
            });
        }, next);
    }
}