const expressSession = require('express-session');

const sessionExpress = () => expressSession({
  name: "VirtualExchange",
  secret: "asdasdasdasdasdasdasd",
  store: store,
  saveUninitialized: false,
  resave: false,
  cookie: {
    sameSite: false,
    maxAge: 1000,
    httpOnly: false,
  },
});

module.exports = { sessionExpress };
