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
    res.header('Access-Control-Allow-Headers', 'Content-type,X-Access-Token');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// API routes
app.use(function(req, res, next) {
    // If the X-Access-Token is empty or different than
    // the secret token
    if(req.headers['x-access-token'] != config.secretToken) {
        // Search for user
        var token = req.headers['x-access-token'];
        users.getForToken(token).then(function(userData) {
            req.user = userData;
            req.master = false;

            // Assign pool to the request
            req.pool = pools.getForToken(token);
            next();
        }, function() {
            next(new Error('Unauthorized Access'));
        })
    }

    req.master = false;
    if(req.headers['x-access-token'] == config.secretToken) {
        req.master = true;
        req.pool = pools.getForToken(req.headers['x-access-token']);
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