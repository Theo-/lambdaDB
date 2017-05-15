var pool = require('./../db.js'),
    response = require('./response.js');

module.exports = {
    parse: function(req, res, next) {
        if(!req.body.query) {
            next(new Error('Please specify a query.'));
        }

        pool.getConnection().then(function(connection) {
            connection.query(req.body.query, [],
                function(err, rows) {
                    connection.release();
                    if(err) {
                        return next(err);
                    }
                    res.json(response.format(rows));
            });
        }, next);
    },

    insert: function(req, res, next) {

    }
}