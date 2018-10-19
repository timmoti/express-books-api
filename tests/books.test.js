const request = require('supertest');
const app = require('../app');
const MongodbMemoryServer = require('mongodb-memory-server').default;
const mongod = new MongodbMemoryServer();
const mongoose = require('mongoose');
const Author = require('../models/author');
const Book = require('../models/book');

async function addFakeAuthorsAndBooks() {
  const author1 = new Author({
    name: 'paulo',
    alive: true
  });
  const savedAuthor1 = await author1.save();

  const author2 = new Author({
    name: 'john',
    alive: false
  });
  const savedAuthor2 = await author2.save();

  const book1 = new Book({
    title: 'Lord of the Rings',
    author: `${savedAuthor1._id}`
  });
  await book1.save();

  const book2 = new Book({
    title: 'Fifty Shades of Grey',
    author: `${savedAuthor2._id}`
  });
  await book2.save();

  const book3 = new Book({
    title: 'Game of Thrones',
    author: `${savedAuthor2._id}`
  });
  await book3.save();
}

beforeAll(async () => {
  jest.setTimeout(120000);

  const uri = await mongod.getConnectionString();
  await mongoose.connect(
    uri,
    { useNewUrlParser: true }
  );
});

afterAll(() => {
  mongoose.disconnect();
  mongod.stop();
});

beforeEach(async () => {
  mongoose.connection.db.dropDatabase();
  await addFakeAuthorsAndBooks();
});

test('POST /books should create new book ', async () => {
  const author = await Author.find({ name: 'john' });
  const requestBody = {
    title: 'The Bible',
    author: `${author[0]._id}`
  };

  const response = await request(app)
    .post('/books')
    .send(requestBody);

  expect(response.status).toBe(201);
  expect(response.body.message).toEqual(
    'create new book using data from [object Object]'
  );
});

test('PUT /books/:id should update selected book', async () => {
  const book = await Book.find({ title: 'Game of Thrones' });
  const author = await Author.find({ name: 'paulo' });
  const requestBody = {
    author: `${author[0]._id}`
  };

  const response = await request(app)
    .put(`/books/${book[0]._id}`)
    .send(requestBody);

  expect(response.status).toBe(200);
  expect(response.body.result.title).toEqual('Game of Thrones');
  expect(response.body.result.author).toEqual(`${author[0]._id}`);
});

test('DELETE /books/:id should delete selected book', async () => {
  const book = await Book.find({title: 'Fifty Shades of Grey'})

  const response = await request(app).delete(`/books/${book[0]._id}`)

  expect(response.status).toBe(200);
  expect(response.body.message).toEqual(`delete book with id ${book[0]._id}`)});

test('GET /books/:id should retrieve selected book', async () => {
  const author = await Author.find({ name: 'paulo' });
  const book = await Book.find({ title: 'Lord of the Rings' });

  const response = await request(app).get(`/books/${book[0]._id}`);

  expect(response.status).toBe(200);
  expect(response.body.title).toEqual('Lord of the Rings');
  expect(response.body.author).toEqual(`${author[0]._id}`);
});
