const User = require('../models/user');
const Subject = require('../models/subjects'); 
const Question = require('../models/questions'); 
const Tests = require('../models/tests');
const mongoose = require('mongoose');

const getTestQuestions = async (req, res, next) => {
  try {
    let aptitudeQuestions = [];
    let branchSpecificQuestions = [];
    const totalMarks = 85; // Total marks for branch-specific questions
    const totalQuestions = 55; // Total number of branch-specific questions

    // Retry until constraints are met
    while (
      branchSpecificQuestions.reduce((sum, subject) => sum + subject.questions.length, 0) !== totalQuestions ||
      branchSpecificQuestions.reduce((sum, subject) => sum + subject.questions.reduce((s, q) => s + q.mark, 0), 0) !== totalMarks
    ) {
      // Reset branch-specific questions
      branchSpecificQuestions = [];

      // Step 1: Fetch the user's branch
      const user = await User.findById(req.user.userId).populate('branch', 'branchName');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userBranchId = user.branch._id; // Get the branch ObjectId

      // Step 2: Find all subjects where the user's branch is present in the `branches` array
      const subjectsForBranch = await Subject.find({ branches: userBranchId })
        .populate('questions')
        .select('_id subjectName subjectMarks questions');
      if (!subjectsForBranch || subjectsForBranch.length === 0) {
        return res.status(404).json({ message: "No subjects found for the user's branch" });
      }

      // Step 3: Separate "Aptitude" subject and branch-specific subjects
      const aptitudeSubject = subjectsForBranch.find(subject => subject.subjectName === 'General Aptitude');
      const branchSpecificSubjects = subjectsForBranch.filter(subject => subject.subjectName !== 'General Aptitude');

      // Step 4: Fetch Aptitude Questions
      if (aptitudeSubject) {
        const allAptitudeQuestions = aptitudeSubject.questions;

        // Fetch 5 questions with 1 mark each
        const oneMarkQuestions = allAptitudeQuestions.filter(q => q.mark === 1);
        const selectedOneMarkQuestions = getRandomQuestionsWithMarks(oneMarkQuestions, 5, 5);

        // Fetch 5 questions with 2 marks each
        const twoMarkQuestions = allAptitudeQuestions.filter(q => q.mark === 2);
        const selectedTwoMarkQuestions = getRandomQuestionsWithMarks(twoMarkQuestions, 5, 10);

        // Combine and shuffle the questions
        aptitudeQuestions = shuffleArray([...selectedOneMarkQuestions, ...selectedTwoMarkQuestions]);

        if (aptitudeQuestions.length < 10) {
          aptitudeQuestions = []; // Reset and retry
          continue; // Retry the loop
        }
      }

      // Step 5: Fetch Branch-Specific Questions
      let remainingMarks = totalMarks;
      let remainingQuestions = totalQuestions;

      for (const subject of branchSpecificSubjects) {
        const allSubjectQuestions = subject.questions;

        // Calculate allocated marks and questions for the subject
        const allocatedMarks = Math.min(subject.subjectMarks, remainingMarks);
        const allocatedQuestions = Math.min(allSubjectQuestions.length, remainingQuestions);

        // Fetch questions for the subject
        const subjectQuestions = getRandomQuestionsWithMarks(
          allSubjectQuestions,
          allocatedQuestions,
          allocatedMarks
        );

        branchSpecificQuestions.push({
          _id: subject._id,
          subjectName: subject.subjectName,
          questions: shuffleArray(subjectQuestions), // Shuffle the questions
        });

        // Adjust remaining marks and questions
        remainingMarks -= subjectQuestions.reduce((sum, q) => sum + q.mark, 0);
        remainingQuestions -= subjectQuestions.length;
      }

      // If constraints are not met, retry
      if (remainingMarks > 0 || remainingQuestions > 0) {
        console.log("Retrying due to unmet constraints...");
        continue; // Retry the loop
      }
    }

    // Step 6: Return Separate Sections
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
  
      // console.log("Received Subjects Data:", subjectsData);
  
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
  
      return res.status(200).json({
        message: "Test submitted successfully!",
        testData: {
          testId: newTest._id,
          branchId: newTest.branch,
          subjectsData: newTest.subjectsData,
          testResponses: newTest.testResponses,
          createdBy: newTest.createdBy,
        },
      });
    } catch (error) {
      next(error);
    }
  };

const submitUserTest = async (req, res, next) => {
  try {
    const { testId, testResponses } = req.body;
    const userId = req.user.userId;

    if (!testId || !Array.isArray(testResponses) || testResponses.length === 0) {
      return res.status(400).json({
        message: "Test cannot be submitted without attempting at least one question.",
      });
    }

    // Validate each testResponse entry using questionId
    for (const response of testResponses) {
      if (!mongoose.Types.ObjectId.isValid(response.questionId)) { // Use questionId
        return res.status(400).json({
          message: `Invalid question ID: ${response.questionId}`, // Use questionId in message
        });
      }
    }

    const attemptedTest = {
      testId, // refer to full test document
      testResponses: testResponses.map((response) => ({
      questionIndex: response.questionIndex,
      question: response.questionId, // Use questionId for the question reference
      chosenAnswer: response.chosenAnswer,
      attemptedStatus: response.attemptedStatus,
      obtainedMarks: 0, // Placeholder, will be filled after evaluation
      })),
      totalTestMarks: 0,
      sectionwiseTestMarks: {
      aptitude: 0,
      technical: 0,
      },
      testDate: new Date(), // Store the date and time on which the test is submitted
    };

    // Push into attemptedTests array
    await User.findByIdAndUpdate(userId, {
      $push: { attemptedTests: attemptedTest },
    });

    return res.status(200).json({ message: "Test submitted successfully" });
    
  } catch (error) {
    next(error);
  }
};

const evaluateTest = async (req, res, next) => {
  try {
    const { testId } = req.body;
    console.log("Test ID:", testId);
    // console.log("User ID:", req.user.userId);
    // Fetch the user and their attempted test
    const user = await User.findById(req.user.userId);
    const attemptedTest = user.attemptedTests.find(test => test.testId.toString() === testId.toString());
    
    if (!attemptedTest) {
      return res.status(404).json({ message: "Test not found for evaluation." });
    }

    // Calculate marks
    const { totalMarks, updatedTestResponses } = await calculateMarks(attemptedTest.testResponses);

    // Round marks to 2 decimal places
    totalMarks.total = parseFloat(totalMarks.total.toFixed(2));
    totalMarks.sectionwise.aptitude = parseFloat(totalMarks.sectionwise.aptitude.toFixed(2));
    totalMarks.sectionwise.technical = parseFloat(totalMarks.sectionwise.technical.toFixed(2));

    // Update test attempt with evaluated data
    attemptedTest.testResponses = updatedTestResponses;
    attemptedTest.totalTestMarks = totalMarks.total;
    attemptedTest.sectionwiseTestMarks = totalMarks.sectionwise;

    // Qualification check (assume 25 is qualifying)
    const qualifyingMarks = 25;
    const isQualified = totalMarks.total >= qualifyingMarks;

    // Calculate percentage (optional)
    const percentage = parseFloat(((totalMarks.total / 100) * 100).toFixed(2));

    // Optional mock GATE score estimate (simplified for your system)
    // Assumption: Top 0.1% average = 90 marks -> score = 900
    let gateScore = Math.round((totalMarks.total / 90) * 900);
    if (gateScore > 1000) gateScore = 1000;

    // Save the user object
    await user.save();

    return res.status(200).json({
      message: "Marks calculated successfully.",
      totalMarks: totalMarks.total,
      sectionwiseMarks: totalMarks.sectionwise,
      percentage: percentage + "%",
      qualified: isQualified,
      gateScoreEstimate: gateScore,
    });
  } catch (error) {
    next(error);
  }
};

async function calculateMarks(testResponses) {
  const totalMarks = {
    total: 0,
    sectionwise: {
      aptitude: 0,
      technical: 0,
    },
  };

  for (const response of testResponses) {
    const questionId = response.question; // Extract question ID
    const question = await Question.findById(questionId).populate('subject', 'subjectName'); // Fetch question and populate subject
    // console.log("Question ID:", questionId);
    // console.log("Question:", question);
    console.log("Response Chosen Answer:", response.chosenAnswer);
    console.log("Question Correct Answer:", question.correctAnswer);
    // console.log("Subject of Question ", question.subject.subjectName);
    if (!question) {
      console.error(`Question with ID ${questionId} not found.`);
      continue;
    }

    const marks = question.mark;
    const isCorrect = JSON.stringify(response.chosenAnswer.sort()) === JSON.stringify(question.correctAnswer.sort());

    if (response.attemptedStatus) {
      if (isCorrect) {
        response.obtainedMarks = marks; // Add full marks for correct answer
        totalMarks.total += marks;
      } else if (question.negativeMark) {
        const penalty = marks === 1 ? 0.33 : 0.67; // Deduction based on mark value
        response.obtainedMarks = -penalty; // Deduct penalty for incorrect answer
        totalMarks.total -= penalty;
      }

      // Categorize marks into sections
      if (question.subject.subjectName === "General Aptitude") {
        totalMarks.sectionwise.aptitude += response.obtainedMarks;
      } else {
        totalMarks.sectionwise.technical += response.obtainedMarks;
      }
    }
  }
  console.log("Total Marks:", totalMarks.total);
  console.log("Section-wise Marks:", totalMarks.sectionwise);

  // Verify total marks consistency with rounding to avoid floating-point precision issues
  const roundedTotal = parseFloat(totalMarks.total.toFixed(2));
  const roundedSectionwiseTotal = parseFloat(
    (totalMarks.sectionwise.aptitude + totalMarks.sectionwise.technical).toFixed(2)
  );

  if (roundedTotal !== roundedSectionwiseTotal) {
    throw new Error("Total marks do not match the sum of section-wise marks.");
  }

  // console.log("Updated Test Responses:", testResponses);
  return {
    totalMarks,
    updatedTestResponses: testResponses, // Include updated test responses with obtained marks
  };
}

const getTestAnalysis = async (req, res, next) => {
  try {
    const { testId } = req.body; // Extract testId from the request body
    const userId = req.user.userId; // Get the userId from the authenticated user

    // Fetch the user and their attempted test
    const user = await User.findById(userId).populate({
      path: "attemptedTests.testResponses.question",
      model: "Questions",
      populate: {
        path: "subject",
        model: "Subjects",
        select: "subjectName",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the attempted test by testId
    const attemptedTest = user.attemptedTests.find(
      (test) => test.testId.toString() === testId.toString()
    );

    if (!attemptedTest) {
      return res.status(404).json({ message: "Test not found for analysis." });
    }

    // Prepare the detailed analysis
    const detailedAnalysis = attemptedTest.testResponses.map((response) => {
      const question = response.question; // Populated question object
      return {
        questionIndex: response.questionIndex,
        questionText: question.question,
        questionImage: question.queImg || null,
        options: question.options,
        correctAnswer: question.correctAnswer,
        chosenAnswer: response.chosenAnswer,
        obtainedMarks: response.obtainedMarks,
        totalMarks: question.mark,
        negativeMarking: question.negativeMark,
        attemptedStatus: response.attemptedStatus,
        subject: question.subject.subjectName,
      };
    });

    // Prepare the summary
    const summary = {
      testId: attemptedTest.testId,
      totalMarks: attemptedTest.totalTestMarks,
      sectionwiseMarks: attemptedTest.sectionwiseTestMarks,
      detailedAnalysis,
    };

    // Include additional calculations in the response
    const percentage = parseFloat(((attemptedTest.totalTestMarks / 100) * 100).toFixed(2));
    const qualifyingMarks = 25;
    const isQualified = attemptedTest.totalTestMarks >= qualifyingMarks;
    let gateScore = Math.round((attemptedTest.totalTestMarks / 90) * 900);
    if (gateScore > 1000) gateScore = 1000;

    return res.status(200).json({
      message: "Test analysis fetched successfully.",
      summary,
      additionalCalculations: {
        percentage: percentage + "%",
        qualified: isQualified,
        gateScoreEstimate: gateScore,
      },
    });
  } catch (error) {
    next(error);
  }
};

const avgMarks = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user || !user.attemptedTests || user.attemptedTests.length === 0) {
      user.avgMarks = 0;
      await user.save();
      return res.status(200).json({ 
        attemptedTestsCount: 0, 
        avgMarks: 0 
      });
    }

    const totalMarksSum = user.attemptedTests.reduce(
      (sum, test) => sum + (test.totalTestMarks || 0),
      0
    );
    const attemptedTestsCount = user.attemptedTests.length;
    const avgMarks = parseFloat((totalMarksSum / attemptedTestsCount).toFixed(2));

    user.avgMarks = avgMarks;
    await user.save();

    return res.status(200).json({ 
      attemptedTestsCount, 
      avgMarks 
    });
  } catch (error) {
    next(error);
  }
};


const getBranchRank = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const branch = currentUser.branch;

    const branchUsers = await User.find({ branch, avgMarks: { $gt: 0 } })
      .select("name avgMarks") // include name and avgMarks only
      .sort({ avgMarks: -1 }); // sort descending

    // Assign ranks and find current user's rank
    let userRank = null;
    const rankedList = branchUsers.map((user, index) => {
      const rank = index + 1;
      if (user._id.toString() === userId) userRank = rank;
      return {
        name: user.name,
        avgMarks: user.avgMarks,
        rank
      };
    });

    return res.status(200).json({
      userRank,
      rankList: rankedList,
      currentUser: {
        name: currentUser.name,
        avgMarks: currentUser.avgMarks,
        rank: userRank
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTestQuestions,getTestAnalysis, uploadTests, 
                  submitUserTest, evaluateTest, avgMarks , getBranchRank}; 