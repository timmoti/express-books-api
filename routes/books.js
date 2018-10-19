const express = require('express');
const router = express.Router();
const Book = require('../models/book');

//Get all books in database
router.get('/', async (req, res, next) => {
  try {
    const result = await Book.find().populate('author');
    res.json(result);
  } catch (error) {
    next(error);
  }
});

//Get book by id from database
router.get('/:id', async (req, res, next) => {
  try {
    const result = await Book.findById(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

//Create a new book
router.post('/', async (req, res, next) => {
  try {
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author
    });
    await newBook.save();

    res
      .status(201)
      .json({ message: `create new book using data from ${req.body}` });
  } catch (error) {
    next(error);
  }
});

//Update book details by id
router.put('/:id', async (req, res, next) => {
  try {
    const result = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.json({ message: `update book with id ${req.params.id}`, result });
  } catch (error) {
    next(error);
  }
});

//Delete book from database by id
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Book.findByIdAndDelete(req.params.id);
    res.json({ message: `delete book with id ${req.params.id}` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
