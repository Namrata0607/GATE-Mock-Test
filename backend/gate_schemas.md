# GATE Mock Test MongoDB Schema

## 1. **User Schema**
```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    attemptedTests: [
        {
            test: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
            responses: [
                {
                    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
                    obtainedMarks: Number,
                    correctAnswer: String,
                    attemptedStatus: Boolean
                }
            ]
        },
        {
            // 
        }
    ],
    role : {
        required: true,
        enum["User","Staff"]
    }
});

module.exports = mongoose.model("User", userSchema);
```

## 2. **Staff Schema**
```js
const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model("Staff", staffSchema);
```

## 3. **Branch Schema**
```js
const branchSchema = new mongoose.Schema({
    branchName: { type: String, required: true, unique: true },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }]
});

module.exports = mongoose.model("Branch", branchSchema);
```

## 4. **Subject Schema**
```js
const subjectSchema = new mongoose.Schema(
    {
    name: { type: String, required: true },
    // abbreviation: { type: String },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }]
    },
    {
    name: { type: String, required: true },
    // abbreviation: { type: String },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }]
    }
);

module.exports = mongoose.model("Subject", subjectSchema);
```

## 5. **Question Schema**
```js
const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    queImg: { type: String }, // URL of question image
    options: [String],
    correctAnswer: [String], // Can store multiple correct answers (for MSQ type)
    queType: { type: String, enum: ["MCQ", "MSQ", "NAT"], required: true },
    negativeMark: { type: Boolean, default: false },
    mark: { type: Number, required: true }
});

module.exports = mongoose.model("Question", questionSchema);
```

## 6. **Test Schema**
```js
const testSchema = new mongoose.Schema({
    name: { type: String, required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    subjects: [
        {
            subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
            questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }]
        }
    ],
    totalMarks: { type: Number, default: 65 },
    sectionwiseMarks: {
        aptitude: { type: Number, default: 15 },
        technical: { type: Number, default: 50 }
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Test", testSchema);
```
## 7. **Test Report Schema**
```js
const testReportSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    test: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
    responses: [
        {
            question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
            obtainedMarks: Number,
            correct: Boolean
        }
    ],
    totalScore: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TestReport", testReportSchema);