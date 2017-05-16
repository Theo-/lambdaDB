module.exports = function(environment) {
    return {
        connectionLimit: 20,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        port: process.env.MYSQL_PORT,
        password: process.env.MYSQL_PASSWORD,
        host: process.env.MYSQL_HOST,
        secretToken: process.env.SECRET_TOKEN
    }
}