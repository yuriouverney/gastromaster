const logger = (req, res, next) => {
  console.log(`Received ${req.method} request for ${req.originalUrl}`);
  next();
};

module.exports = logger;
