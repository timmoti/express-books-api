if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const express = require('express');

const index = require('./routes/index');
const books = require('./routes/books');
const authors = require('./routes/authors');

const app = express();
app.use(express.json());

app.use('/', index);
app.use('/books', books);
app.use('/authors', authors);

module.exports = app;
