const express = require('express');
const cors = require('cors');
const app = express();


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

app.post('/submit-link', (req,res) => {
    const { input } = req.body;
    console.log("received input", input)
    res.status(200).json({ message: 'received link successfully'})
})

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




