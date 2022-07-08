const expressSession = require('express-session');

const sessionExpress = () => expressSession({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true,
  cookie: {
    originalMaxAge:600000
    httpOnly: false,
//     sameSite:'lax',
    secure: 'auto',
  },
});

module.exports = { sessionExpress };
