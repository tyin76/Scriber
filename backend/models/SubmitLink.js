const mongoose = require('mongoose');

const SubmitLinkSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    videoURL: {
        type: String, 
        required: true,
    },
    transcript: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("Links", SubmitLinkSchema);