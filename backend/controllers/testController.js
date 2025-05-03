const User = require('../models/user');
const Subject = require('../models/subjects'); 
const Question = require('../models/questions'); 
const Tests = require('../models/tests');
const mongoose = require('mongoose');

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
        const aptitudeSubject = subjectsForBranch.find(subject => subject.subjectName === 'General Aptitude');
        const branchSpecificSubjects = subjectsForBranch.filter(subject => subject.subjectName !== 'General Aptitude');

        // Step 4: Calculate Total Marks
        const totalMarks = req.query.totalMarks || 100; // Default to 100 marks
        const aptitudeMarks = Math.floor(totalMarks * 0.15); // 15% for aptitude
        const branchMarks = totalMarks - aptitudeMarks; // Remaining marks for branch-specific subjects

        // Step 5: Fetch Aptitude Questions
        let aptitudeQuestions = [];
        if (aptitudeSubject) {
            const allAptitudeQuestions = aptitudeSubject.questions;
            aptitudeQuestions = getRandomQuestionsWithMarks(allAptitudeQuestions, 10, aptitudeMarks);

            if (aptitudeQuestions.reduce((sum, q) => sum + q.mark, 0) < aptitudeMarks) {
                return res.status(400).json({
                    message: "Test not generated because there are not enough questions for the Aptitude section.",
                });
            }
        }

        // Step 6: Fetch Branch-Specific Questions
        const branchSpecificQuestions = [];
        const marksPerSubject = Math.floor(branchMarks / branchSpecificSubjects.length); // Divide marks equally among subjects

        for (const subject of branchSpecificSubjects) {
            const allSubjectQuestions = subject.questions;

            // Fetch questions for the subject based on its allocated marks
            const subjectQuestions = getRandomQuestionsWithMarks(allSubjectQuestions, allSubjectQuestions.length, marksPerSubject);

            if (subjectQuestions.reduce((sum, q) => sum + q.mark, 0) < marksPerSubject) {
                return res.status(400).json({
                    message: `Test not generated because there are not enough questions for the ${subject.subjectName} subject.`,
                });
            }

            branchSpecificQuestions.push({
                subjectName: subject.subjectName,
                questions: subjectQuestions,
            });
        }

        // Step 7: Shuffle Questions
        aptitudeQuestions = shuffleArray(aptitudeQuestions);
        branchSpecificQuestions.forEach(subject => {
            subject.questions = shuffleArray(subject.questions);
        });

        // Step 8: Return Separate Sections
        res.json({
            message: "Questions fetched successfully",
            aptitudeQuestions, // Aptitude questions in a separate array
            branchSpecificQuestions, // Branch-specific questions in their own array
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
        if (selectedQuestions.length >= questionLimit) break;
        if (currentMarks + question.mark > totalMarks) continue;

        selectedQuestions.push(question);
        currentMarks += question.mark;

        if (currentMarks >= totalMarks) break;
    }

    return selectedQuestions;
};

// Helper function to shuffle an array
const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

const uploadTests = async (req, res, next) => {
    try {
      const { branchId, subjectsData, createdBy, testResponses } = req.body;
  
      console.log("Received Subjects Data:", subjectsData);
  
      if (!Array.isArray(subjectsData) || subjectsData.length === 0) {
        return res.status(400).json({ message: "Subjects data cannot be empty." });
      }
  
      // Validate each subject in subjectsData
      for (const subject of subjectsData) {
        if (!mongoose.Types.ObjectId.isValid(subject.subject)) {
          return res.status(400).json({ message: `Invalid subject ID: ${subject.subject}` });
        }
      }
  
      // Proceed with saving the test
      const testCount = await Tests.countDocuments();
      const newTestName = `Test${testCount + 1}`;
  
      const newTest = new Tests({
        testName: newTestName,
        branch: branchId,
        subjectsData: subjectsData,
        createdBy: createdBy,
      });
  
      const savedTest = await newTest.save();
  
      res.status(201).json({
        testId: savedTest._id,
        message: "Test uploaded successfully",
      });
    } catch (error) {
      next(error);
    }
  };

const submitUserTest = async (req, res, next) => {
    try {
        const { testId, testResponses } = req.body;
        const userId = req.user.userId;

        // Prepare the attempted test object
        const attemptedTest = {
            testId: testId,
            testResponses: testResponses.map((response) => ({
                question: response.question, // Question ID
                chosenAnswer: response.chosenAnswer, // User's chosen answer(s)
                obtainedMarks: 0, // Initialize with 0, will be updated after evaluation
                attemptedStatus: response.attemptedStatus, // Whether the question was attempted
            })),
            totalTestMarks: 0, // Marks will be updated later
            sectionwiseTestMarks: {
                aptitude: 0,
                technical: 0,
            },
        };

        // Update the user's document
        await User.findByIdAndUpdate(userId, {
            $push: { attemptedTests: attemptedTest },
        });

        res.status(200).json({ message: "Test submitted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = { getTestQuestions, uploadTests, submitUserTest };