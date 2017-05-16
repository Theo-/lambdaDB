var configParser = require('./../src/configParser.js'),
    configFile = require('./../config.js');

describe('config parser', function() {
    it('should parse a valid configuration', function() {
        var config = configParser();
        var original = configFile(process.env.NODE_ENV);

        expect(config.host).toBe(original.host);
        expect(config.user).toBe(original.user);
        expect(config.port).toBe(original.port);
        expect(config.database).toBe(original.database);
        expect(config.password).toBe(original.password);
        expect(config.secretToken).toBe(original.secretToken);
    })
})