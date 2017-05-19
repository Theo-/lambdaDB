var dbConnection = require('./db.js'),
    configParser = require('./configParser.js'),
    users = require('./users.js'),
    logger = require('./logger.js');

var masterConfig = configParser();

var Pools = {
    // Contain pools for each secretToken
    pools: {},

    getMaster: function() {
        if(!Pools.pools['master']) {
            var masterPool = new dbConnection(masterConfig);
            Pools.pools['master'] = masterPool;
        }

        return Pools.pools['master'];
    },
    
    getConfigPool: function() {
        if(!Pools.pools['config']) {
            var basicConfig = configParser();
            basicConfig.database = 'lambdadb_config';
            var masterPool = new dbConnection(basicConfig);
            Pools.pools['config'] = masterPool;
        }

        return Pools.pools['config'];
    },  

    getForToken: function(secretToken, databaseName) {
        if(secretToken == masterConfig.secretToken) {
            return Pools.getMaster();
        }

        if(!users.cache[secretToken]) {
            throw new Error('Secret token not registered');
        }
        var user = users.cache[secretToken];
        databaseName = user.username + '_' + databaseName;
        var key = secretToken + '.' + databaseName;

        if(!Pools.pools[key]) {
            if(!!users.cache[secretToken]) {
                logger('Creating pool for '+key);
                var user = users.cache[secretToken];
                var basicConfig = configParser();
                basicConfig.user = user.sql_role;
                basicConfig.password = user.sql_password;
                basicConfig.database = databaseName;
                var userPool = new dbConnection(basicConfig);
                Pools.pools[key] = userPool;
            } else {
                throw new Error('Pool does not exist for the key ' + key);
            }
        }

        return Pools.pools[key];
    }
};

module.exports = Pools;