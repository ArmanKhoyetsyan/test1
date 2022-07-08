const { getUserByName } = require('../common/databaseCommands');

const getUserIdsByUserName = async (userName) => {
  let userId;
  const user = await getUserByName(userName);
  if (user[0]?.id) {
    userId = user[0]?.id;
  }

  return userId;
};

module.exports = { getUserIdsByUserName };
