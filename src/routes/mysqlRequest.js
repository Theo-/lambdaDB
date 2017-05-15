var pool = require('./../db.js');

module.exports = {
    parse: function(req, res, next) {
        pool.getConnection().then(function(connection) {
            connection.query(req.body.query, [],
                function(err, rows) {
                    if(err) {
                        return next(err);
                    }
                    res.json(rows);
            });
        }, next);
    }
}