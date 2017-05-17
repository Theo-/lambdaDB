/**
 * This template engine can load JSON configuration
 * and spawn the database (or table) described
 * in this JSON.
 */
var configPool = require('./../pools.js').getConfigPool(),
    logger = require('./../logger.js'),
    _ = require('underscore'),
    databaseAPI = require('./../api/database.js'),
    q = require('q');

var Engine = {
    /**
     * Parse an entier file
     * @param {STRING} filePath of the JSON
     */
    parseFile: function(filePath) {
        var jsonObject = require('../../' + filePath);
        return Engine.parse(jsonObject);
    },

    /**
     * Parse a json object.
     * @param {JSON} jsonObject describing the entity
     */
    parse: function(jsonObject) {
        if(!jsonObject.type) {
            throw new Error('Missing type in the template');
        }

        switch(jsonObject.type) {
            case 'database':
                return Engine.parseDatabase(jsonObject);
            case 'table':
                return Engine.parseTable(jsonObject);
            default:
                throw new Error('Type ' + jsonObject.type + ' not recognized.');
        }
    },

    /**
     * Parse a table object
     * @param {JSON} tableObject
     * @param {STRING} database name that contains
     * the table
     */
    parseTable: function(tableObject, database) {
        var tableName = tableObject.name;

        logger('Creating table ' + tableName + ' in ' + database);
        var database = databaseAPI(database);
        var table = database.getTable(tableName);

        return table.create(tableObject.columns);
    },

    /**
     * Parse a database object
     * @param {JSON} databaseObject
     */
    parseDatabase: function(databaseObject) {
        var databaseName = databaseObject.name;
        var api = databaseAPI(databaseName);
        var defer = q.defer();

        logger('Creating database ' + databaseName);
        api.create().then(function() {
            Promise.all(
                _.map(databaseObject.tables, function(table) {
                    return Engine.parseTable(table, databaseName);
                })
            ).then(function() {
                logger('Done importing database ' + databaseName);
                defer.resolve();
            }, defer.reject);
        }, defer.reject);

        return defer.promise;
    }
};

module.exports = Engine;