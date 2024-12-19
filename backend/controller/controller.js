const express = require('express');

const router = express.Router();

const Link = require('../models/SubmitLink')

// API Endpoints
router.post('/submit-link', async (req,res) => {
    const { input } = req.body;
    console.log("received input", input)

    try {
    const newLink = new Link ({
        videoURL: input
    });

    await newLink.save();
    res.status(200).json({ message: 'received link successfully'})
} catch (error) {
    console.log(error);
    res.json({ message: 'failed to save to database'})
}
})


module.exports = router;