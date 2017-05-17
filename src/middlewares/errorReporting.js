module.exports = function(result, req, res, next) {
    if (result instanceof Error) {
        var isProduction = process.env.NODE_ENV == 'production';
        res.json({
            success: false,
            error: result.message
        })
    } else {
        next();
    }
};