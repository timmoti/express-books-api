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

test('POST /authors should create new author', async () => {
  const requestBody = {
    name: 'Tim',
    alive: true
  };
  const response = await request(app)
    .post('/authors')
    .send(requestBody);

  expect(response.status).toBe(201);
  expect(response.body).toEqual({
    message: 'create new Author using data from [object Object]'
  });
});

test('PUT /authors/:name should update selected author', async () => {
  const requestBody = {
    name: 'Cher'
  };
  const response = await request(app)
    .put('/authors/paulo')
    .send(requestBody);

  expect(response.status).toBe(200);
  expect(response.body.name).toEqual('Cher');
  expect(response.body.alive).toEqual(true);
});

test('DELETE /authors/:name should delete selected author', async () => {
  const response = await request(app).delete('/authors/john');

  expect(response.status).toBe(200);
  expect(response.body.message).toEqual(`deleted Author with name john`);
});

test('GET /authors/:name should display author and books', async () => {
  const response = await request(app).get('/authors/john');

  expect(response.status).toBe(200);
  expect(response.body.author[0].name).toEqual('john');
  expect(response.body.author[0].alive).toEqual(false);
  expect(response.body.books[0].title).toEqual('Fifty Shades of Grey');
  expect(response.body.books[1].title).toEqual('Game of Thrones');
});
