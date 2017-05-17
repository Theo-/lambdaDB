var dbConnection = require('./db.js'),
    configParser = require('./configParser.js'),
    users = require('./users.js');

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

    getForToken: function(secretToken) {
        if(secretToken == masterConfig.secretToken) {
            return Pools.getMaster();
        }

        if(!Pools.pools[secretToken]) {
            if(!!users.cache[secretToken]) {
                var user = users.cache[secretToken];
                var basicConfig = configParser();
                basicConfig.user = user.sql_role;
                basicConfig.password = user.sql_password;
                basicConfig.database = 'lr_theo';
                var userPool = new dbConnection(basicConfig);
                Pools.pools[secretToken] = userPool;
            } else {
                throw new Error('Pool does not exist for this key');
            }
        }

        return Pools.pools[secretToken];
    }
};

module.exports = Pools;