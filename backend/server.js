require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

const appController = require('../backend/controller/controller')


const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || origin.startsWith('http://localhost')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  };
  
app.use(cors(corsOptions));


app.use(express.json());

app.use('/', appController);


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.dbKey);
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


