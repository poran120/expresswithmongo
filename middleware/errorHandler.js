const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  const error = res.json({
    message: err.message || "Internal Server Error",
  });

  next(error);
};

const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};
module.exports = {
  errorHandler,
  notFound,
};
