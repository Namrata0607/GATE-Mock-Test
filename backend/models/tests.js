const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    testName: { 
        type: String, 
        required: true 
    },//like test1, test2, test3
    branch: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Branch" 
    },
    subjectsData: [
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
        default: 100 
    },
    sectionwiseMarks: {
        aptitude: { 
            type: Number, 
            default: 25 
        },
        technical: { 
            type: Number, 
            default: 85 
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