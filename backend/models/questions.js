const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { 
        type: String, 
        required: true 
    },
    queImg: { 
        type: String, 
        default: null
    }, // URL of question image

    options: [String],

    correctAnswer: { 
        type: [String], // Store as an array of strings
        required: true,
        validate: {
            validator: function (value) {
                // Validation based on queType
                if (this.queType === "MCQ" && value.length !== 1) {
                    return false; // MCQ should have exactly one correct answer
                }
                if (this.queType === "MSQ" && value.length < 1) {
                    return false; // MSQ should have at least two correct answers
                }
                if (this.queType === "NAT" && value.length !== 1) {
                    return false; // NAT should have exactly one correct answer
                }
                return true;
            },
            message: "Invalid correctAnswer for the given queType."
        }
    },
    
    queType: { 
        type: String, 
        enum: ["MCQ", "MSQ", "NAT"], 
        required: true 
    },
    negativeMark: { 
        type: Boolean, 
        default: false 
    },
    mark: { 
        type: Number, 
        required: true 
    },
    subject: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Subjects" 
    },
}, { timestamps: true });

module.exports = mongoose.model('Questions', questionSchema);