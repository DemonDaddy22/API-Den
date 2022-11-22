const asyncErrorHandler = func => (req, res, next) => func(req, res, next)?.catch(next);

export default asyncErrorHandler;
