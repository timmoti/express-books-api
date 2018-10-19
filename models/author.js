const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;

const authorSchema = Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  alive: {
    type: Boolean,
    required: true
  }
});

authorSchema.plugin(uniqueValidator);
const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
