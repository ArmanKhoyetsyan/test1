const { userData } = require('./data');

const setStepPath = (ctx, text) => {
  const userId = ctx.message.from.id;
  if (userData[userId]) {
    const { path } = userData[userId];
    userData[userId].path = path ? `${path}. ${text}` : path + text;
  }
};

module.exports = {
  setStepPath,
};
