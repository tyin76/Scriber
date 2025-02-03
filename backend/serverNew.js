require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path'); 

const app = express();
const appController = require('../backend/controller/controller');

const dbKey = process.env.DB_KEY || process.env.dbKey;


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://scriber-126cc.web.app'); 
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); 
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
  next();
});


app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200); 
});

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000', 
      'http://localhost:5001', 
      'https://scriber-production.up.railway.app/',
      'https://scriber-126cc.web.app/'
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(express.json());


app.use(express.static(path.join(__dirname, '../frontend/build')));

// API routes
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

// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const app = express();
// const mongoose = require('mongoose');

// const appController = require('../backend/controller/controller')


// const corsOptions = {
//     origin: (origin, callback) => {
//       if (!origin || origin.startsWith('http://localhost')) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//   };
  
// app.use(cors(corsOptions));


// app.use(express.json());

// app.use('/', appController);


// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.dbKey);
//     console.log('MongoDB Connected');
//   } catch (err) {
//     console.error('MongoDB connection error:', err);
//     process.exit(1); 
//   }
// };


// const PORT = 5001;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// connectDB();

