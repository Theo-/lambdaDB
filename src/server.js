var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    helmet = require('helmet'),
    colors = require('colors'),
    configParser = require('./configParser.js'),
    pools = require('./pools.js'),
    users = require('./users.js');

var config = configParser();

var app = express();

// Logging
app.use(logger('dev'));

// Helmet
app.use(helmet());

// Body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request headers
app.all('/*', function(req, res, next) {
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,X-Access-Token,X-Database-Name');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

/**
 * Administration routes for the user.
 * No pool is attached here since no database
 * is specified.
 */
app.use('/me*', function(req, res, next) {
    var secretToken = req.headers['x-access-token'];
    if(!secretToken) {
        return next(new Error('Secret token needed'));
    }

    users.getForToken(secretToken).then(function(userData) {
        req.user = userData;
        req.master = false;
        next();
    }, function() {
        next(new Error('Unauthorized Access'));
    })
});

/**
 * Database access for a certain user.
 * X-Database-Name must be specified here.
 */
function checkDatabase(req, res, next) {
    var secretToken = req.headers['x-access-token'];
    var databaseName = req.headers['x-database-name'];
    if(!secretToken) {
        return next(new Error('Secret token must be specified using X-Access-Token header.'));
    }

    if(!databaseName) {
        return next(new Error('Database name must be specified using X-Database-Name header.'))
    }

    // Search for user
    users.getForToken(secretToken).then(function(userData) {
        req.user = userData;
        req.master = false;
        req.trueDatabaseName = req.user.username + '_' + databaseName;

        // Assign pool to the request
        req.pool = pools.getForToken(secretToken, databaseName);
        next();
    }, function() {
        next(new Error('Unauthorized Access'));
    })
}
app.use('/db*', checkDatabase);
app.use('/', checkDatabase);

// API routes for master access
app.use(function(req, res, next) {
    req.master = false;
    if(req.headers['x-access-token'] == config.secretToken) {
        req.master = true;
        req.pool = pools.getForToken(req.headers['x-access-token']);
        next();
    } else {
        next();
    }
})

app.use('/', require('./routes'));

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

var errorHandler = require('./middlewares/errorReporting');
app.use(errorHandler);

// Start the server
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
    console.log(colors.green('LambdaDB') + ' Server listening on port ' + server.address().port);
});

if(config.enableUsers) {
    // Import lambdadb_config database
    var templateEngine = require('./template/templateEngine');
    templateEngine.parseFile('databases/lambdadb_config.json');
}

// Keep the database connection
// alive
function keepAlive() {
    pools.getMaster().acquire(function(err, connection) {
        if (err) { return console.log(err); }
        connection.ping();
        connection.release();
    });
}
setInterval(keepAlive, 5000);