const XLSX = require('xlsx');
const Branch = require('../models/branch');
const Subject = require('../models/subjects');
const Question = require('../models/questions');

const uploadQuestions = async (req, res, next) => {
    try {
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        let selectedBranchNames = req.body.selectedBranches; // Array: ['CSE', 'AIML', ...]
        // console.log("Received selectedBranches:", selectedBranchNames);

        if (typeof selectedBranchNames === 'string') {
            selectedBranchNames = selectedBranchNames.split(',').map(name => name.trim());
        }

        // if (!selectedBranchNames || !selectedBranchNames.length) {
        //     return res.status(400).json({ message: "No branches selected." });
        // }

        // Resolve all selected branch documents
        let existingBranches  = await Branch.find({ branchName: { $in: selectedBranchNames } });
        // it will return an array of branch documents that match the selected branch names
        // $in: operator is used to match any of the specified values in the array.
        const existingBranchNames = existingBranches.map(branch => branch.branchName);

        const branchesToCreate = selectedBranchNames.filter(name => !existingBranchNames.includes(name));

        const newBranches = await Branch.insertMany(
            branchesToCreate.map(name => ({ branchName: name, subjects: [] }))
        );

        // Step 4: Combine all branch docs (existing + new)
        const allBranches = [...existingBranches, ...newBranches];

        for(const row of data){
            const {
                // branchName,
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
            // let branch = await Branch.findOne({ branchName: branchName });
            // if (!branch) {
            //     branch = await Branch.create({ branchName: branchName, subjects: [] });
            // }

            // 2.Subject
            let subject = await Subject.findOne({ subjectName: subjectName});
            
            if (!subject) {
                subject = await Subject.create({
                    subjectName: subjectName,
                    branches: allBranches.map(b => b._id),
                    // b => b._id is used to extract the _id property from each branch document in the branchDocs array.
                    questions: []
                });
            } else {
                if (!subject.branches) subject.branches = [];
                // Add new branches to subject if not already present
                for (const branch of allBranches) {
                    if (!subject.branches.includes(branch._id)) {
                        subject.branches.push(branch._id);
                    }
                }
                await subject.save();
            }
            // it will check if the subject already exists in the database. If it does not exist, it will create a new subject document with the provided subject name and associate it with the selected branches.
            // If it does exist, it will check if the branches are already associated with the subject and add them if not.

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