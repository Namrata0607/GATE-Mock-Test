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
        console.log("User's Branch ID:", userBranchId);

        // Step 2: Find all subjects where the user's branch is present in the `branches` array
        const subjectsForBranch = await Subject.find({ branches: userBranchId }).populate('questions');
        if (!subjectsForBranch || subjectsForBranch.length === 0) {
            return res.status(404).json({ message: "No subjects found for the user's branch" });
        }

        // Step 3: Separate "Aptitude" subject and branch-specific subjects
        const aptitudeSubject = subjectsForBranch.find(subject => subject.subjectName === 'Aptitude');
        const branchSpecificSubjects = subjectsForBranch.filter(subject => subject.subjectName !== 'Aptitude');

        // Step 4: Fetch 15 questions from the "Aptitude" subject
        let aptitudeQuestions = [];
        if (aptitudeSubject) {
            aptitudeQuestions = aptitudeSubject.questions.slice(0, 15); // Limit to 15 questions
        }

        // Step 5: Fetch 50 questions from branch-specific subjects
        const branchQuestions = [];
        for (const subject of branchSpecificSubjects) {
            branchQuestions.push(...subject.questions);
            if (branchQuestions.length >= 50) break; // Limit to 50 questions
        }

        // Trim to exactly 50 questions if more were added
        const trimmedBranchQuestions = branchQuestions.slice(0, 50);

        // Step 6: Combine the questions
        // const questions = [...aptitudeQuestions, ...trimmedBranchQuestions];

        // Step 7: Return the questions
        res.json({
            message: "Questions fetched successfully",
            aptitudeQuestions,
            technicalQuestions: trimmedBranchQuestions
        });
    } catch (error) {
        next(error);
    }
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