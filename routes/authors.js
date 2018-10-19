const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');

//Get all authors
router.get('/', async (req, res, next) => {
  try {
    const result = await Author.find();
    res.json({ message: 'respond with all Authors', result });
  } catch (error) {
    next(error);
  }
});

//Get author by name
// router.get('/:name', async (req, res, next) => {
//   try {
//     const result = await Author.find({ name: req.params.name });
//     res.json(result);
//   } catch (error) {
//     next(error);
//   }
// });

//Create a new author
router.post('/', async (req, res, next) => {
  try {
    const newAuthor = new Author({
      name: req.body.name,
      alive: req.body.alive
    });
    await newAuthor.save();

    res
      .status(201)
      .json({ message: `create new Author using data from ${req.body}` });
  } catch (error) {
    next(error);
  }
});

//Update author details
router.put('/:name', async (req, res, next) => {
  try {
    const result = await Author.findOneAndUpdate(
      { name: req.params.name },
      req.body,
      {
        new: true
      }
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

//Delete author from database
router.delete('/:name', async (req, res, next) => {
  try {
    const result = await Author.findOneAndDelete({ name: req.params.name });
    res.json({ message: `deleted Author with name ${req.params.name}` });
  } catch (error) {
    next(error);
  }
});

//Retrieve books written by author
router.get('/:name', async (req, res, next) => {
  try {
    const author = await Author.find({ name: req.params.name });
    console.log(author);
    const books = await Book.find({ author: author[0].id });
    res.json({
      author: author,
      books: books
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
