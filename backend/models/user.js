const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// bcrypt is used to hash passwords

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true,
        minlength: 6
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true
    },
    mobile : {
        type: Number,
        required: true
    },
    attemptedTests : [
        {
            testId :  {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tests'
            },
            testResponses : [
                {
                    questionIndex: {
                        type: Number,
                        required: true
                    },
                    question: { 
                        type: mongoose.Schema.Types.ObjectId, 
                        ref: "Questions" 
                    },
                    chosenAnswer: [String],
                    obtainedMarks: {
                        type: Number,
                        default: 0
                    },
                    attemptedStatus: Boolean
                }
            ],
            totalTestMarks: {
                type: Number,
                default: 0
            },
            sectionwiseTestMarks: {
                aptitude: { 
                    type: Number, 
                    default: 0
                },
                technical: { 
                    type: Number, 
                    default: 0
                }
            },
            testDate: {
                type: Date,
                default: Date.now
            },
        }
    ],  
    avgMarks : {
        type: Number,
        default: 0
    },
    role : {
        type: String,
        enum : ["User","Staff","Admin"],
        default: "User"
    }
}, {timestamps: true});
// timestamps: true will automatically add createdAt and updatedAt fields in the database

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")){
        return next();
    } 
// If the password is not modified, then we don't need to hash it again 
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
// 10 is the number of rounds of hashing

// pre() is a middleware function that runs before
// the save() method is called on the mongoose model instance

module.exports = mongoose.model('User', userSchema);