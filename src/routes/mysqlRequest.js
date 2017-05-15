var pool = require('./../db.js'),
    response = require('./response.js'),
    _ = require('underscore');

module.exports = {
    parse: function(req, res, next) {
        if(!req.body.query && !req.body.queries) {
            next(new Error('Please specify a query.'));
        }

        var queryResults = [];
        function makeRequest(query) {
            return new Promise(function(resolve, reject) {
                pool.getConnection().then(function(connection) {
                    connection.query(query, [],
                        function(err, rows) {
                            connection.release();
                            if(err) {
                                return reject(err);
                            }
                            queryResults.push({query: query, result: rows});
                            resolve(rows);
                    });
                }, reject);
            })
        }

        var query = req.body.query;
        var queries = req.body.queries;
        if(query) {
            makeRequest(query).then(function(rows) {
                res.json(response.format(rows));
            }, next)
        } else if(queries) {
            Promise.all(
                _.map(queries, function(_query) {
                    return makeRequest(_query);
                })
            ).then(function() {
                res.json(response.format(queryResults));
            }, next)
        }
    },

    insert: function(req, res, next) {

    }
}