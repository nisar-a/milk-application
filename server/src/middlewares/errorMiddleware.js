const notFound = (_req, _res, next) => {
  const error = new Error('Route not found.');
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error.';

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' ? { stack: error.stack } : {})
  });
};

module.exports = {
  notFound,
  errorHandler
};
