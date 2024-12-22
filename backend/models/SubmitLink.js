const mongoose = require('mongoose');

const SubmitLinkSchema = new mongoose.Schema({
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