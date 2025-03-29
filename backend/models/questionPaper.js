const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: String,
    queImg: String,  // URL for image
    options: [String],  // Array of options
    correctAnswer: [String],  // Can be multiple correct answers
    queType: { type: String, enum: ["MCQ", "MSQ", "NAT"] },
    negativeMark: Boolean,
    mark: Number,
    subject: String,
});

module.exports = mongoose.model("Question", questionSchema);