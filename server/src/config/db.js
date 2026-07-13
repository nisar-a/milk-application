const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in environment variables.');
  }

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB_NAME || 'smart_dairy'
  });

  // eslint-disable-next-line no-console
  console.log('MongoDB connected successfully.');
};

module.exports = connectDB;
