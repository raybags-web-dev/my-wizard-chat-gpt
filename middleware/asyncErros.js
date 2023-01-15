module.exports = function asyncMiddleware(handler) {
    return async(req, res, next) => {
        try {
            await handler(req, res);
        } catch (ex) {
            res.status(500).json('something went wrong. Try again later')
            next(ex.message);
        }
    };
}