const XLSX = require('xlsx');
const Branch = require('../models/branch');
const Subject = require('../models/subjects');
const Question = require('../models/questions');

const uploadQuestions = async (req, res, next) => {
    try {
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        for(const row of data){
            const {
                branchName,
                subjectName,
                question,
                queImg,
                option1,
                option2,
                option3,
                option4,
                correctAnswer,
                queType,
                negativeMark,
                mark
              } = row;

              const options = [option1, option2, option3, option4];

            // 1.Branch
            let branch = await Branch.findOne({ branchName: branchName });
            if (!branch) {
                branch = await Branch.create({ branchName: branchName, subjects: [] });
            }

            // 2.Subject
            let subject = await Subject.findOne({ subjectName: subjectName, branch: branch._id });
            if (!subject) {
                subject = await Subject.create({ subjectName: subjectName, branch: branch._id, questions: [] });
                branch.subjects.push(subject._id);
                await branch.save();
            }

            // 3.Question
            const newQuestion = await Question.create({
                question,
                queImg,
                options,
                correctAnswer,
                queType,
                negativeMark: String(negativeMark).toLowerCase() === 'true',
                mark,
                subject: subject._id,
            });
            subject.questions.push(newQuestion._id);
            await subject.save();

        }

        res.status(200).json({ message: "Questions uploaded successfully!" });

    }catch (error) {
        next(error);
        res.status(500).json({ message: "Upload failed" , error: error.message });
    }
};

module.exports = { uploadQuestions };























// const Question = require("../models/questionPaper");

// // Upload multiple questions to MongoDB
// const uploadQuestions = async (req, res, next) => {
//     try {
//         const questionsData = req.body;

//         if (!Array.isArray(questionsData) || questionsData.length === 0) {
//             return res.status(400).json({ message: "Invalid input: Expected an array of questions." });
//         }

//         // Validate each question object
//         const validQuestions = questionsData.every(q => 
//             q.question && 
//             Array.isArray(q.options) && 
//             Array.isArray(q.correctAnswer) && 
//             q.queType && 
//             ["MCQ", "MSQ", "NAT"].includes(q.queType) && 
//             typeof q.negativeMark === "boolean" && 
//             typeof q.mark === "number" && 
//             q.subject
//         );

//         if (!validQuestions) {
//             return res.status(400).json({ message: "Invalid question format in request body." });
//         }

//         // Insert into MongoDB
//         await Question.insertMany(questionsData);

//         res.status(201).json({ message: "Questions uploaded successfully!" });
//     } catch (error) {
//         next(error);
//     }
// };

// // Get all questions from MongoDB
// const getQuestions = async (req, res, next) => {
//     try {
//         const questions = await Question.find({});
//         res.status(200).json({ questions });
//     } catch (error) {
//         next(error);
//     }
// };

// module.exports = { uploadQuestions, getQuestions };