module.exports = function(result, req, res, next) {
    if (result instanceof Error) {
        var isProduction = process.env.NODE_ENV == 'production';
        res.json({
            success: false,
            error: isProduction ? 'Error reporting is turned off in productio environment ' : result.message
        })
    } else {
        next();
    }
};