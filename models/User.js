const { Schema, model } = require('mongoose');

const User = new Schema({
  id: { type: Number, unique: true, required: true },
  is_bot: { type: Boolean, alias: 'isBot' },
  first_name: { type: String, alias: 'firstName' },
  last_name: { type: String, alias: 'lastName' },
  username: { type: String, unique: true },
  language_code: { type: String, alias: 'languageCode' },
}, {
  timestamps: true,
});

module.exports = model('User', User);
