var colors = require('colors');

module.exports = function(string, type) {
    var type = type || 'LOG';
    var date = (new Date()).toString();

    console.log(colors.green('['+ date +'] ') + colors.blue(type + ':') + ' ' + string)
}