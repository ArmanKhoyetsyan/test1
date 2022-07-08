const expressSession = require('express-session');

const sessionExpress = () => expressSession({
  secret: "judfnjkbsdjhfgvjdfgjhasgjgj",
  signed:true,
  saveUninitialized: false,
  resave: false,
  cookie: {
    sameSite: false,
    maxAge: null,
    httpOnly: false,
    secure:true,
  },
});

module.exports = { sessionExpress };
