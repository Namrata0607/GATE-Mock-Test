const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true,
        unique: true
    },
    questions: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Questions" 
        }
    ]
})
exports = mongoose.model('Subjects', subjectSchema);