var response = require('./response.js');

module.exports = {
    table: function(req, res, next) {
        var tableName = req.params.table;
        var databaseName = req.params.database;

        if(!!databaseName) {
            tableName = databaseName + '.' + tableName;
        }

        req.pool.getConnection().then(function(connection) {
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
        var databaseName = req.params.database;
        var fromDatabase = '';

        if(!!databaseName) {
            fromDatabase = ' IN ' + databaseName;
        }

        req.pool.getConnection().then(function(connection) {
            connection.query("SHOW TABLES" + fromDatabase, [],
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