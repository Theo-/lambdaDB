var configFunction = require('./../config.js'),
    colors = require('colors');

module.exports = function() {
    var config = configFunction(process.env.NODE_ENV);

    if(!config.database) {
        console.log(colors.red('Warning: ') + colors.green('Database name') + ' is not set in config.js');
    }

    if(!config.user) {
        throw new Error('Database ' + colors.green('user') + ' must be set in config.js');
    }

    if(!config.host) {
        throw new Error('Database ' + colors.green('host') + ' must be set in config.js');
    }

    if(!config.secretToken) {
        throw new Error(colors.green('Secret token') + ' must be defined');
    }

    return config;
}