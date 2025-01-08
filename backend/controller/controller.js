const express = require('express');

const router = express.Router();

const Link = require('../models/SubmitLink');

const { YoutubeTranscript } = require('youtube-transcript');

const he = require('he');

const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


// API Endpoints

// adds link to db and transcribes
router.post('/api/submit-link', async (req,res) => {
    const { input, userEmail = null } = req.body;
    const stringInput = input.toString();  

     const youtubeUrlRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
     if (!youtubeUrlRegex.test(input)) {
         return res.status(400).json({ message: 'Invalid YouTube URL' });
     }

    try {
    const transcript = await YoutubeTranscript.fetchTranscript(stringInput);
    const transcriptToString = transcript.map(obj => he.decode(he.decode(obj.text))).join(' ');
    const newLink = new Link ({
        user: userEmail,
        videoURL: input,
        transcript: transcriptToString,
    });

    await newLink.save();
    res.status(200).json({ message: 'link and transcript saved successfully', transcript: transcriptToString});
} catch (error) {
    console.log(error);
    res.json({ message: 'failed at /submit-link'})
}
})

router.get('/api/getTranscriptionHistory/:userEmail', async (req,res) => {
    const { userEmail } = req.params;

    if (!userEmail) {
        return res.status(400).json( { message : "User Email is Required"});
    }
    const makeEmailString = userEmail.toString();
    try {
        const history = await Link.find({ user: makeEmailString });
        console.log(history);
        console.log(typeof history);

        res.status(200).json({ message: "User Transcriptions found!", history: history});
    } catch (error) {
        console.log(error);
    }

})

router.delete('/api/DeleteTranscriptionHistory/:id', async (req,res) => {
    const { id } = req.params;
    try {
        await Link.findByIdAndDelete(id);
        res.status(200).json({ message: "FROM BACKEND SUCCESSFULLY DELETED"});
    } catch (error) {
        console.log(error);
    }
})
;

router.post('/api/generate-quiz', async (req, res) => {
    const { transcript } = req.body;
  
    if (!transcript) {
      return res.status(400).json({ message: 'Transcript is required' });
    }
  
    try {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": `Generate 5 quiz questions based on this transcript: ${transcript}. Provide 4 multiple choice answers for each question.
                Format the questions as JSON like this: 
                Question: ...
                Options: A: ..., B: ..., C: ..., D: ...
                Answer: A: ...`
              }
            ]
          }
        ]
      });
      if (response) {
        console.log(response.choices[0].message.content);
      res.status(200).json({ quiz: response.choices[0].message.content });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error generating quiz questions' });
    }
  });


  router.get('/api/testing', async (req,res) => {
    res.send("YAYYYY!");
  })


module.exports = router;