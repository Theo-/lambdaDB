module.exports = function(environment) {
    return {
        connectionLimit: 20,
        user: process.env.MYSQL_USER,
        port: process.env.MYSQL_PORT,
        password: process.env.MYSQL_PASSWORD,
        host: process.env.MYSQL_HOST,
        // Master secret token
        secretToken: process.env.SECRET_TOKEN,
        // Enable users, will create a lambdadb_config
        // database following the format in 
        // databases/lambdadb_config.json
        enableUsers: true
    }
}