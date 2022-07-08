const { Schema, model } = require('mongoose');

const Commission = new Schema({
  system: { type: String },
  method: { type: String },
  value: { type: Number },
});

module.exports = model('Commission', Commission);
