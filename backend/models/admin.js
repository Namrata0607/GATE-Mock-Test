const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Ensure bcrypt is imported

// Define Questions Schema
const questionsSchema = new mongoose.Schema({
    branch: {
        type: String,
        enum: ["Computer Science and Information Technology", "Data Science and Artificial Intelligence",
            "Civil Engineering", "Electronics and Communication Engineering", "Mechanical Engineering"],
        required: true
    },
    question: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }], // Array of 4 options
    correctAnswer: {
        type: String,
        required: true
    }, // Store the correct answer
    quetype: {
        type: String,
        enum: ["MCQ", "MSQ", "NAT"],
        required: true
    },
    marks: {
        type: Number,
        required: true
    },
    negativeMark: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

// Define Admin Schema
const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        enum: ["Computer Science and Information Technology", "Data Science and Artificial Intelligence",
            "Civil Engineering", "Electronics and Communication Engineering", "Mechanical Engineering"],
    }, // Admin selects a branch
    questions: [questionsSchema], // Questions for the branch
}, { timestamps: true });

// Hash Password Before Saving
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Export Models
console.log(mongoose.models);
const Admin = mongoose.model('Admin', adminSchema);
const Question = mongoose.models.Question || mongoose.model('Question', questionsSchema);

module.exports = { Admin, Question };