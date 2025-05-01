const User = require('../models/user');
const Subject = require('../models/subjects'); 
const Question = require('../models/questions'); 
const Tests = require('../models/tests');

const getTestQuestions = async (req, res, next) => {
    try {
        // Step 1: Fetch the user's branch
        const user = await User.findById(req.user.userId).populate('branch', 'branchName');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userBranchId = user.branch._id; // Get the branch ObjectId

        // Step 2: Find all subjects where the user's branch is present in the `branches` array
        const subjectsForBranch = await Subject.find({ branches: userBranchId }).populate('questions');
        if (!subjectsForBranch || subjectsForBranch.length === 0) {
            return res.status(404).json({ message: "No subjects found for the user's branch" });
        }

        // Step 3: Separate "Aptitude" subject and branch-specific subjects
        const aptitudeSubject = subjectsForBranch.find(subject => subject.subjectName === 'Aptitude');
        const branchSpecificSubjects = subjectsForBranch.filter(subject => subject.subjectName !== 'Aptitude');

        // Step 4: Fetch 10 Aptitude Questions with total marks = 15
        let aptitudeQuestions = [];
        if (aptitudeSubject) {
            const allAptitudeQuestions = aptitudeSubject.questions;
            aptitudeQuestions = getRandomQuestionsWithMarks(allAptitudeQuestions, 10, 15);

            if (aptitudeQuestions.length !== 10) {
                return res.status(400).json({
                    message: "Test not generated because there are not enough questions for the Aptitude section."
                });
            }
        }

        // Step 5: Fetch Branch-Specific Questions with total marks = 85
        const branchSpecificQuestions = [];
        let totalBranchMarks = 0;

        for (const subject of branchSpecificSubjects) {
            const allSubjectQuestions = subject.questions;
            const subjectMarks = subject.subjectMarks;

            const subjectQuestions = getRandomQuestionsWithMarks(allSubjectQuestions, null, subjectMarks);

            if (subjectQuestions.length === 0) {
                return res.status(400).json({
                    message: `Test not generated because there are not enough questions for the ${subject.subjectName} subject.`
                });
            }

            branchSpecificQuestions.push({
                subjectName: subject.subjectName,
                questions: subjectQuestions
            });

            totalBranchMarks += subjectMarks;
        }

        if (totalBranchMarks !== 85) {
            return res.status(400).json({
                message: "Test not generated because the total marks for branch-specific subjects do not add up to 85."
            });
        }

        // Step 6: Shuffle Questions
        aptitudeQuestions = shuffleArray(aptitudeQuestions);
        branchSpecificQuestions.forEach(subject => {
            subject.questions = shuffleArray(subject.questions);
        });

        // Step 7: Return Separate Sections
        res.json({
            message: "Questions fetched successfully",
            aptitudeQuestions,
            branchSpecificQuestions
        });
    } catch (error) {
        next(error);
    }
};

// Helper function to fetch random questions with specific marks
const getRandomQuestionsWithMarks = (questions, questionLimit, totalMarks) => {
    const shuffledQuestions = shuffleArray(questions);
    const selectedQuestions = [];
    let currentMarks = 0;

    for (const question of shuffledQuestions) {
        if (questionLimit && selectedQuestions.length >= questionLimit) break;
        if (currentMarks + question.marks > totalMarks) continue;

        selectedQuestions.push(question);
        currentMarks += question.marks;

        if (currentMarks === totalMarks) break;
    }

    return currentMarks === totalMarks ? selectedQuestions : [];
};

// Helper function to shuffle an array
const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

const uploadTests = async (req, res, next) => {
    try {
        const { branchId, subjectsData, createdBy  } = req.body;
        
        const testCount = await Tests.countDocuments();
        const newTestName = `Test${testCount + 1}`; // Generate a new test name

        const newTest = new Tests({
            testName: newTestName,
            branch: branchId,
            subjectsData: subjectsData, // [{subject: id, questions: [qid1, qid2]}]
            createdBy: createdBy,
        });

        const savedTest = await newTest.save();
        res.status(201).json({ 
            testId: savedTest._id, 
            message: "Test started and uploaded successfully", 
        }); 


    }catch (error) {
        next(error);
    }
}

const submitUserTest = async (req, res, next) => {
    try {
        const { testId, testResponses } = req.body;
        const userId = req.user.userId; 

        await User.findByIdAndUpdate(userId, {
            $push: {
                attemptedTests: {
                    testId: testId,
                    testResponses: testResponses
                }
            }
        })

        res.status(200).json({ message: "Test submitted successfully" });

    }catch (error) {
        next(error);
    }
}

module.exports = { getTestQuestions, uploadTests, submitUserTest };