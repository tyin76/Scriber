const express = require('express');

const router = express.Router();

const Link = require('../models/SubmitLink');

const { YoutubeTranscript } = require('youtube-transcript');

const he = require('he');

// API Endpoints

// adds link to db and transcribes
router.post('/submit-link', async (req,res) => {
    const { input, user = undefined } = req.body;
    const stringInput = input.toString();  

     const youtubeUrlRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
     if (!youtubeUrlRegex.test(input)) {
         return res.status(400).json({ message: 'Invalid YouTube URL' });
     }

    try {
    const transcript = await YoutubeTranscript.fetchTranscript(stringInput);
    console.log("transcript", transcript);
    const transcriptToString = transcript.map(obj => he.decode(he.decode(obj.text))).join(' ');
    console.log(transcriptToString);
    const newLink = new Link ({
        user: user.email,
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



module.exports = router;