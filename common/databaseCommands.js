const User = require('../models/User');

async function createUser(context) {
  const {
    id,
    is_bot: isBot,
    first_name: firstName,
    last_name: lastName,
    username,
    language_code: languageCode,
  } = context.message.from;
  const candidate = await User.findOne({ id });
  if (candidate) {
    return;
  }
  const user = new User({
    id,
    isBot,
    firstName,
    lastName,
    username,
    languageCode,
  });
  await user.save();
}

async function get() {
  return User.find();
}

async function getUserByName(name) {
  return User.find({ username: name });
}

async function del(context) {
  const { id } = context.message.from;
  await User.deleteOne({ id });
}

module.exports = {
  getUserByName,
  createUser,
  get,
  del,
};
