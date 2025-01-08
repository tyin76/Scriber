require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const appController = require('../backend/controller/controller');

const dbKey = process.env.DB_KEY || process.env.dbKey;


const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000', // Local frontend
      'http://localhost:5001', // Local backend emulator
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/', appController);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(dbKey);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};


const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

connectDB();

// Export the app for use in Firebase Functions
module.exports = app;
