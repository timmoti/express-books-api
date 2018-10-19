const mongoose = require('mongoose');
const app = require('./app');
const dbUrl = process.env.MONGODB_URI;

mongoose.connect(
  dbUrl,
  { useNewUrlParser: true }
);

const db = mongoose.connection;

db.once('open', () => console.log('Database is connected'));
db.on('error', error => console.error('An error occured', error));

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}...`);
});
