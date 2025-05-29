const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true,
    },
    photoUrl: {
        type: String, // URL to the photo in Azure Blob Storage
        required: true,
    },
    extractedText: {
        type: String,
        required: true,
    },
    audioUrl: {
        type: String, // URL to the audio file in Azure Blob Storage
        required: true,
    },
});

const History = mongoose.model('History', historySchema);

module.exports = History;
