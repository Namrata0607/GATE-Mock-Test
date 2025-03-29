const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    branch: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Branch" 
    },
    subjects: [
        {
            subject: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Subjects" 
            },
            questions: [
                { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: "Questions" 
                }
            ]
        }
    ],
    totalMarks: { 
        type: Number,
        default: 65 
    },
    sectionwiseMarks: {
        aptitude: { 
            type: Number, 
            default: 15 
        },
        technical: { 
            type: Number, 
            default: 50 
        }
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Staff" 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
},{ timestamps: true });

module.exports = mongoose.model('Tests', testSchema);