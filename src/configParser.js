var configFunction = require('./../config.js'),
    colors = require('colors');

module.exports = function() {
    var config = configFunction(process.env.NODE_ENV);

    if(!config.database) {
        throw new Error(colors.green('Database name') + ' must be set in config.js');
    }

    if(!config.user) {
        throw new Error('Database ' + colors.green('user') + ' must be set in config.js');
    }

    if(!config.password) {
        throw new Error('Username ' + colors.green('password') + ' be set in config.js');
    }

    if(!config.host) {
        throw new Error('Database ' + colors.green('host') + ' must be set in config.js');
    }

    if(!config.secretToken) {
        throw new Error(colors.green('Secret token') + ' must be defined');
    }

    return config;
}