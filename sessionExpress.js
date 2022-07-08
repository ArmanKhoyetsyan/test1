const expressSession = require('express-session');

const sessionExpress = () => expressSession({
  secret:'ssasdasftwhgbadfasdasdes',
  cookie: {
    sameSite:'none'
  },
});

module.exports = { sessionExpress };
