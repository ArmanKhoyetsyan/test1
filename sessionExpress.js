const expressSession = require('express-session');

const sessionExpress = () => expressSession({
  secret:'ssasdasftwhgbadfasdasdes',
  saveUninitialized: true,
  resave: true,
  cookie: {
    originalMaxAge: null,
    httpOnly: false,
    sameSite: false
  },
});

module.exports = { sessionExpress };
