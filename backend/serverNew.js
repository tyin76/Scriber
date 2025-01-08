require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path'); 

const app = express();
const appController = require('../backend/controller/controller');

const dbKey = process.env.DB_KEY || process.env.dbKey;

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000', 
      'http://localhost:5001', 
      'https://scriber-production.up.railway.app/' 
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

app.use(express.static(path.join(__dirname, '../frontend/build')));


app.use('/', appController);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDB();

module.exports = app;