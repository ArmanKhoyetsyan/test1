const expressSession = require('express-session');

const sessionExpress = () => expressSession({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  resave: true,
  cookie: {
    originalMaxAge: null,
    httpOnly: false,
    sameSite:'strict',
    signed:true,
    // secure:undefined,
  },
});
module.exports = { sessionExpress };

