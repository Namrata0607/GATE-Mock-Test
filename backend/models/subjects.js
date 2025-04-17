const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true,
        unique: true
    },
    branches: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Branch',
            required: true
        }
    ],
    questions: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Questions" 
        }
    ]
});


// Enforce uniqueness of subjectName per branch
// subjectSchema.index({ subjectName: 1, branch: 1 }, { unique: true });

module.exports = mongoose.model('Subjects', subjectSchema);