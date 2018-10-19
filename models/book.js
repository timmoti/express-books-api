const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;

const bookSchema = Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author'
  }
});

bookSchema.plugin(uniqueValidator);
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
