const request = require('supertest');

const MongodbMemoryServer = require('mongodb-memory-server').default;
const mongod = new MongodbMemoryServer();
const mongoose = require('mongoose');
const Author = require('../models/author');
const Book = require('../models/book');

const app = require('../app');

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

test('GET /authors should display all authors', async () => {
  const response = await request(app).get('/authors');

  expect(response.status).toBe(200);
  expect(response.body.length).toBe(2);
});

test('GET /books should display all books ', async () => {
  const response = await request(app).get('/books');

  expect(response.status).toBe(200);
  expect(response.body.length).toBe(2);
});

test('GET / should display welcome message', async () => {
  const response = await request(app).get('/');

  expect(response.status).toBe(201);
  expect(response.body.message).toEqual('hello express-books-api');
});
