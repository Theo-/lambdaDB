var response = require('./../../src/routes/response.js');

describe('response route', function() {
    it('should return a formatted succesfull request', function() {
        var result = {
            test: 'test'
        }

        var responseFormatted = response.format({
            test: 'test'
        })
        expect(responseFormatted.data.test).toBe(result.test)
    })
})