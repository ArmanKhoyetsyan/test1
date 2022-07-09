function errorHandler(res, error) {
  res.sendStatus(500).json({
    massage: error.massage ? error.massage : error,
  });
}

function authorizationHandler(req, res, next) {
  if (req.headers.api_key === process.env.API_KEY) {
    next();
  } else {
    res.json('Unauthorized').status(401);
  }
}

function isAuthenticated(req, res, next) {
  console.log("🚀 ~ file: middlewares.js ~ line 17 ~ isAuthenticated ~ req.headers.cookie", req.headers.cookie)
  if (req.headers.cookie) next();
  else {
    res.status(401).json('Unauthorized');
  }
}

module.exports = { errorHandler, authorizationHandler, isAuthenticated };
