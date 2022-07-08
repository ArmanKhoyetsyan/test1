const expressSession = require('express-session');

const sessionExpress = () => expressSession({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true,
  cookie: {
    httpOnly: false,
    sameSite:'strict',
    secure: 'auto',
  },
});

module.exports = { sessionExpress };
