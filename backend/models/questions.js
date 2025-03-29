const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { 
        type: String, 
        required: true 
    },
    queImg: { 
        type: String 
    }, // URL of question image

    options: [String],

    correctAnswer: [String], // Can store multiple correct answers (for MSQ type)
    
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
