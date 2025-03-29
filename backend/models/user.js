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
        required: true
    },
    confirmPassword : {
        type: String,
        required: true
    },
    branch: {
        type: String,
        enum: ["Computer Science and Information Technology", "Data Science and Artificial Intelligence",
            "Civil Engineering", "Electronics and Communication Engineering", "Mechanical Engineering"],
    },
    mobile : {
        type: Number,
        required: true
    },
    attemptedTests : [
        {
            test :  {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tests' // Reference to the Test model
            },
            responses : [
                {
                    question: { 
                        type: mongoose.Schema.Types.ObjectId, 
                        ref: "Questions" 
                    },
                    obtainedMarks: Number,
                    correctAnswer: [String],
                    attemptedStatus: Boolean
                }
            ]
        }
    ],
    // role : {
    //     required: true,
    //     enum : ["User","Staff"]
    // }
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