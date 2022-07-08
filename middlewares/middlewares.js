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
  if (req.headers.cookie.includes(process.env.ADMIN_EMAIL)) next();
  else {
    res.status(401).json('Unauthorized');
  }
}

module.exports = { errorHandler, authorizationHandler, isAuthenticated };
