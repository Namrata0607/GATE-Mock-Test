const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String], // Array of options
        required: true,
    },
    correctAnswer: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
