var templateEngine = require('./../template/templateEngine.js'),
    response = require('./response.js'),
    usersAPI = require('./../api/users.js');

var Template = {
    parse: function(req, res, next) {
        var template = req.body.template;
        template.name = req.user.username + '_' + template.name;
        var sqlUser = usersAPI(req.user.sql_role);

        templateEngine.parse(template).then(function() {
            return sqlUser.grantDatabase(template.name);
        }).then(function() {
            res.json(response.format({}));
        }).catch(function(err) {
            next(err);
        });
    }
};

module.exports = Template;