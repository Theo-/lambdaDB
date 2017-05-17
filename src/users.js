var User = {
    cache: {},
    
    getForToken: function(secretToken) {
        var me = User;

        return new Promise(function(resolve, reject) {
            if(!!me.cache[secretToken]) {
                resolve(me.cache[secretToken]);
            } else {
                me.loadToken(secretToken).then(resolve, reject);
            }
        })
    },

    loadToken: function(token) {
        var me = User;
        var masterPool = require('./pools.js').getMaster();
        return new Promise(function(resolve, reject) {
            masterPool.getConnection().then(function(connection) {
                connection.query(
                    'SELECT * FROM lambdadb_config.users WHERE secretToken=?',
                    [
                        token
                    ],
                    function(err, rows) {
                        if(err) {
                            return reject(err);
                        }

                        if(rows.length != 1) {
                            return reject(new Error('User not found'));
                        }
                        
                        me.cache[rows[0].secretToken] = rows[0];
                        resolve(rows[0]);
                    }
                )
            }, reject);
        })
    }
};

module.exports = User;