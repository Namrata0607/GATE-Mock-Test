import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../utils/UserDetails";
import SectionTabs from "../components/SectionTabs";
import QuestionStatusButtons from "../components/QuestionStatusButtons";
import ScientificCalculator from "../components/ScientificCalci";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Logo from "../components/Logo";

function TestUI() {
  const [showCalculator, setShowCalculator] = useState(false);
  const [aptitudeQuestions, setAptitudeQuestions] = useState([]); 
  const [technicalQuestions, setTechnicalQuestions] = useState([]);
  const [currentSection, setCurrentSection] = useState("Aptitude");
  const [selectedQuestion, setSelectedQuestion] = useState(1);
  const [questionStatus, setQuestionStatus] = useState([]);
  const [user, setUser] = useState({ name: "", branchId: "", branchName: "", _id: "" });  
  const [error, setError] = useState(null);
  // const [currentTime, setCurrentTime] = useState(new Date());
  // const [selectedAnswer, setSelectedAnswer] = useState(null); // This state is no longer needed
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentQuestions = currentSection === "Aptitude" ? aptitudeQuestions : technicalQuestions;
  // const [popupData, setPopupData] = useState(null);
  // const [showPopup, setShowPopup] = useState(false);

  // Initialize chosenAnswers by loading from localStorage
  const [chosenAnswers, setChosenAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem('testResponses');
    return savedAnswers ? JSON.parse(savedAnswers) : [];
  });
  const [showTestSummary, setShowTestSummary] = useState(false);
  const [showEvalutionModal, setShowEvalutionModal] = useState(false);
  const [result, setResult] = useState(null);
  const [progressMessage, setProgressMessage] = useState("Loading...");
  const navigate = useNavigate();


  // Logic to navigate to the next question
  function goToNextQuestion() {
    const totalQuestions =
      currentSection === "Aptitude" ? aptitudeQuestions.length : technicalQuestions.length;

    // Check if the current question is the last one in the section
    if (selectedQuestion < totalQuestions) {
      // Move to the next question
      setSelectedQuestion(selectedQuestion + 1);
    } else {
      // If it's the last question in the section, switch to the next section
      if (currentSection === "Aptitude") {
        setCurrentSection("Technical");
        setSelectedQuestion(1); // Start from the first question in the technical section
      } else {
        alert("You have completed all the questions!");
      }
    }
  }

  // Modified handleAnswerSelect to update chosenAnswers state
  const handleAnswerSelect = (question, selectedOption) => {
    const questionId = question._id;

    setChosenAnswers(prevAnswers => {
      const existingAnswerIndex = prevAnswers.findIndex(ans => ans.questionId === questionId);
      let updatedChosenAnswer;

      if (question.queType === "MSQ") {
        // Get current selected options for this MSQ question
        const currentMsQAnswers = existingAnswerIndex !== -1 ? prevAnswers[existingAnswerIndex].chosenAnswer || [] : [];

        if (currentMsQAnswers.includes(selectedOption)) {
          // Option was unchecked, remove it
          updatedChosenAnswer = currentMsQAnswers.filter(option => option !== selectedOption);
        } else {
          // Option was checked, add it
          updatedChosenAnswer = [...currentMsQAnswers, selectedOption];
        }
      } else {
        // For MCQ and NAT, the selected option is the chosen answer
        // ENSURE chosenAnswer is always an array, even for single selections
        updatedChosenAnswer = [selectedOption];
      }

      const newAnswerEntry = {
        questionId: questionId,
        chosenAnswer: updatedChosenAnswer, // This is now always an array
        attemptedStatus: true,
      };

      if (existingAnswerIndex !== -1) {
        // Update existing answer entry
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = newAnswerEntry;
        return updatedAnswers;
      } else {
        // Add new answer entry
        return [...prevAnswers, newAnswerEntry];
      }
    });
  };

function clearResponse() {
  const currentQuestion = currentQuestions[selectedQuestion - 1];

  // Remove the current question's answer from chosenAnswers
  const updatedAnswers = chosenAnswers.map((entry) => {
    if (entry.questionId === currentQuestion._id) {
      return {
        ...entry,
        chosenAnswer: [],
        attemptedStatus: false
      };
    }
    return entry;
  });

  setChosenAnswers(updatedAnswers);
  localStorage.setItem("testResponses", JSON.stringify(updatedAnswers));
}
// Modified saveAndNext to save the current state to localStorage
function saveAndNext() {
  // Save the current state of chosenAnswers to localStorage
  localStorage.setItem("testResponses", JSON.stringify(chosenAnswers));
  console.log("Updated chosenAnswers in localStorage:", chosenAnswers);

  // Update questionStatus to "answered" or "notAnswered" for the current question
  setQuestionStatus((prevStatus) => {
    const updatedStatus = [...prevStatus];
    const index = selectedQuestion - 1;
    const currentQuestion = currentQuestions[index];
    const answerEntry = chosenAnswers.find(ans => ans.questionId === currentQuestion?._id);
    const hasAnswer = answerEntry && answerEntry.chosenAnswer && answerEntry.chosenAnswer.length > 0;
    updatedStatus[index] = hasAnswer ? "answered" : "notAnswered";
    return updatedStatus;
  });

  goToNextQuestion();
}

// Mark for review function
function markForReview() {
  const currentQuestion = currentQuestions[selectedQuestion - 1];
  const questionId = currentQuestion._id;

  setChosenAnswers((prevAnswers) => {
    const existingAnswerIndex = prevAnswers.findIndex(
      (ans) => ans.questionId === questionId
    );

    if (existingAnswerIndex !== -1) {
      // Update existing answer entry
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[existingAnswerIndex].attemptedStatus = true; // Mark as attempted
      return updatedAnswers;
    } else {
      // Add new answer entry
      return [
        ...prevAnswers,
        {
          questionId: questionId,
          chosenAnswer: [],
          attemptedStatus: true, // Mark as attempted
        },
      ];
    }
  });

  // Update questionStatus to "marked" or "answeredMarked" for the current question
  setQuestionStatus((prevStatus) => {
    const updatedStatus = [...prevStatus];
    const index = selectedQuestion - 1;
    // Check if the question has an answer
    const answerEntry = chosenAnswers.find(ans => ans.questionId === questionId);
    const hasAnswer = answerEntry && answerEntry.chosenAnswer && answerEntry.chosenAnswer.length > 0;
    updatedStatus[index] = hasAnswer ? "answeredMarked" : "marked";
    return updatedStatus;
  });

  goToNextQuestion();
}

// --- FIX: Maintain question status across section switches ---

// Helper to get status for all questions in a section based on chosenAnswers
function getSectionQuestionStatus(sectionQuestions) {
  return sectionQuestions.map((question) => {
    const answerEntry = chosenAnswers.find(ans => ans.questionId === question._id);
    if (!answerEntry) return "notVisited";
    if (
      answerEntry.attemptedStatus &&
      answerEntry.chosenAnswer &&
      answerEntry.chosenAnswer.length > 0
    ) {
      // Check for marked for review
      if (
        questionStatus.length &&
        (questionStatus.find((_, idx) => sectionQuestions[idx]._id === question._id) === "answeredMarked")
      ) {
        return "answeredMarked";
      }
      return "answered";
    }
    if (
      answerEntry.attemptedStatus &&
      (!answerEntry.chosenAnswer || answerEntry.chosenAnswer.length === 0)
    ) {
      // Check for marked for review
      if (
        questionStatus.length &&
        (questionStatus.find((_, idx) => sectionQuestions[idx]._id === question._id) === "marked")
      ) {
        return "marked";
      }
      return "notAnswered";
    }
    return "notVisited";
  });
}

// Update questionStatus when section or chosenAnswers changes
useEffect(() => {
  if (currentSection === "Aptitude") {
    setQuestionStatus(getSectionQuestionStatus(aptitudeQuestions));
  } else {
    setQuestionStatus(getSectionQuestionStatus(technicalQuestions));
  }
  // eslint-disable-next-line
}, [currentSection, chosenAnswers, aptitudeQuestions, technicalQuestions]);

  // Submit Test Button Handler - uses chosenAnswers state
  //only saves the test to the database
  // and then calls submitUserTest to submit the test
async function submitTest(branchId, createdBy) {
  console.log("Submited test with branchId:", branchId);
  const token = localStorage.getItem("userToken");
  if (!token) {
    alert("No token found. Please log in again.");
    return;
  }
  setShowEvalutionModal(true);
  setProgressMessage("Processing your test, please wait...");
  
  // Combine all questions from both sections
  const allQuestions = [...aptitudeQuestions, ...technicalQuestions];

  // Add unattempted questions to chosenAnswers
  setChosenAnswers((prevAnswers) => {
    const updatedAnswers = [...prevAnswers];

    allQuestions.forEach((question, index) => {
      const existingAnswerIndex = updatedAnswers.findIndex(
        (ans) => ans.questionId === question._id
      );

      if (existingAnswerIndex === -1) {
        // Add unattempted question
        updatedAnswers.push({
          questionId: question._id,
          chosenAnswer: [], // No answer selected
          attemptedStatus: false, // Mark as not attempted
          questionIndex: index + 1, // Store the index (1-based)
        });
      } else {
        // Update existing entry to include the index
        updatedAnswers[existingAnswerIndex].questionIndex = index + 1;
      }
    });

    // Save updated answers to localStorage
    localStorage.setItem("testResponses", JSON.stringify(updatedAnswers));

    return updatedAnswers;
  });

  // Use the updated chosenAnswers state
  const testResponses = chosenAnswers;

  const subjectsData = JSON.parse(localStorage.getItem("subjectsData")) || [];

  if (testResponses.length === 0) {
    alert("No answers have been saved. Please attempt some questions before submitting.");
    return;
  }

  if (!subjectsData || subjectsData.length === 0) {
    alert("Subjects data is missing. Please reload the test.");
    return;
  }

  const isValidSubjectsData = subjectsData.every(
    (subject) =>
      subject.subject && /^[a-f\d]{24}$/i.test(subject.subject) // Check if subject is a valid ObjectId
  );

  if (!isValidSubjectsData) {
    console.log("subjectsData:", subjectsData); // Log the invalid subjectsData for debugging
    alert("Invalid subject data. Please reload the test.");
    // return; // Consider uncommenting this in production
  }

  // Prepare the payload for uploading the test
  const payload = {
    branchId: branchId,
    subjectsData: subjectsData, // Use dynamically fetched subjectsData
    createdBy: createdBy,
    testResponses: testResponses, // Include the chosen answers from state
  };

  try {
    console.log("Pauload:",payload)
    const response = await fetch("http://localhost:3000/api/test/uploadTest/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token here
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      // alert(result.message);

      // Submit the test for the user - pass testId, submitUserTest will use chosenAnswers state
      console.log("Test ID:", result.testData.testId); // Log the testId for debugging
      await submitUserTest(result.testData.testId);

      // Clear localStorage after submission
      localStorage.removeItem("testResponses");
      localStorage.removeItem("subjectsData");

      // alert("Test submitted successfully!");
    } else {
      console.error("Error:", result.message);
      alert("Error: " + result.message);
    }
  } catch (error) {
    console.error("Error submitting test:", error);
    alert("An error occurred while submitting the test.");
  } finally {
    setIsSubmitting(false); // Re-enable the button
  }
}
  
//User Test Submission - Actual user score will be calculated in backend
 async function submitUserTest(testId) { // Removed testResponses parameter
    const token = localStorage.getItem('userToken');
    if (!token) {
      alert('No token found. Please log in again.');
      return;
    }

    setProgressMessage("Submitting your test, please wait...");


    // Use the current state of chosenAnswers
    const testResponses = JSON.parse(localStorage.getItem('testResponses') || '[]');
    // console.log("Type of testResponses:", typeof testResponses);
    console.log("testResponses:", testResponses); // Log the testResponses for debugging
    try {
      // Prepare the payload for updating the user's document
      const payload = {
        testId: testId,
        testResponses: testResponses.map((response) => ({
          questionIndex: response.questionIndex, // Use questionIndex from state
          questionId: response. questionId, // Use questionId from state
          // Ensure chosenAnswer is always an array of strings
          chosenAnswer: Array.isArray(response.chosenAnswer)
            ? response.chosenAnswer.map(String) // Ensure elements are strings
            : (response.chosenAnswer !== null && response.chosenAnswer !== undefined ? [String(response.chosenAnswer)] : []), // Wrap single value in array and ensure it's a string
          attemptedStatus: response.attemptedStatus, // Whether the question was attempted
          obtainedMarks: 0, // Placeholder, will be filled after evaluation
        })),
      };
      console.log("Payload for user test submission:", payload); // Log the payload for debugging

      const response = await fetch('http://localhost:3000/api/test/submitTest/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token here
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        console.log(result.message); // Log success message
        setProgressMessage("Your test has been submitted successfully!");

        // Call the evaluateTest route after successful submission
        const evaluatePayload = {
          testId: testId,
          // userId: localStorage.getItem("userId"), // Assuming userId is stored in localStorage
        };


          setProgressMessage("Evaluating your test, please wait...");
       // Delay for 2 seconds before showing evaluation message

        try {
          const evaluateResponse = await fetch("http://localhost:3000/api/test/evaluateTest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token here
        },
        body: JSON.stringify(evaluatePayload),
          });

          const evaluateResult = await evaluateResponse.json();
          setProgressMessage("Ready to view your results!");

          if (evaluateResponse.ok) {
            setTimeout(() => {
              setResult(evaluateResult); 
            }, 2000); // Delay for 2 seconds
        // console.log("Test evaluated successfully:", evaluateResult.message);
        // console.log("Total Marks:", evaluateResult.totalMarks);
        // console.log("Section-wise Marks:", evaluateResult.sectionwiseMarks);
        // console.log("Percentage:", evaluateResult.percentage);
        // console.log("Qualified:", evaluateResult.qualified ? "Yes" : "No");
        // console.log("GATE Score Estimate:", evaluateResult.gateScoreEstimate);
          } else {
        console.error("Error evaluating test:", evaluateResult.message);
          }
        } catch (evaluateError) {
          console.error("Error calling evaluateTest API:", evaluateError);
        }
      } else {
        console.error("Error submitting user test:", result.message); // Log error message
      }
    } catch (error) {
      console.error('Error submitting user test:', error);
      alert('An error occurred while submitting the user test.');
    }
  }


  // fetches questions fot test
  useEffect(() => {
    const fetchTestQuestions = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          throw new Error("Authorization token is missing.");
        }

        const response = await fetch("http://localhost:3000/api/testQuestions/getTestQuestions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch test questions");
        }

        const data = await response.json();
        console.log("Fetched Test Questions:", data.aptitudeQuestions);
        console.log("branchSpecificQuestions:", data.branchSpecificQuestions);

        // Ensure data exists before setting state
        setAptitudeQuestions(data.aptitudeQuestions || []);
        setTechnicalQuestions(
          (data.branchSpecificQuestions || []).flatMap((subject) => subject.questions || [])
        );
        // Initialize questionStatus based on total questions
        const totalAptitude = data.aptitudeQuestions?.length || 0;
        const totalTechnical = (data.branchSpecificQuestions || []).flatMap((subject) => subject.questions || []).length;
        setQuestionStatus(Array(totalAptitude + totalTechnical).fill("notVisited"));


        // Prepare subjectsData dynamically
        const subjectsData = (data.branchSpecificQuestions || []).map((subject, index) => {
          if (!subject || !subject._id || !Array.isArray(subject.questions)) {
            console.warn(`Invalid subject at index ${index}:`, subject);
            return null; // Skip invalid subjects
          }

          return {
            subject: subject._id, // Use _id instead of subjectName
            questions: subject.questions.map((q) => q._id), // Use valid ObjectIds for questions
          };
        }).filter(Boolean); // Remove null entries

        console.log("Prepared subjectsData:", subjectsData);

        localStorage.setItem("subjectsData", JSON.stringify(subjectsData));
      } catch (error) {
        console.error("Error fetching test questions:", error.message);
        setError(error.message);
      }
    };
    fetchTestQuestions();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token =
          localStorage.getItem("userToken") || localStorage.getItem("staffToken");
        if (!token) {
          console.error("No token found. User is not logged in.");
          return;
        }

        // Use fetchData utility to fetch user details
        const data = await fetchData("http://localhost:3000/api/users/userdetails", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("User Details:", data.branchId);
        // Set user details in state
        if (data && data.name && data.branchId && data.branchName && data._id) {
            setUser({
            name: data.name,
            branchId: data.branchId, // Store branch ID
            branchName: data.branchName, // Store branch name
            _id: data._id, // Store user ID
            });
            setTimeout(() => {
            console.log("User data set successfully:", {
              name: data.name,
              branchId: data.branchId,
              branchName: data.branchName,
              _id: data._id,
            });
            }, 0);
        } else {
          console.error("User data is incomplete or missing:", data);
          setError("Failed to load user details. Please try again.");
        }
      } catch (err) {
        console.error("Error fetching user details:", err.message);
        setError(err.message);
      }
    };

    fetchUserData();
    
  }, []);
  // Timer logic for 3 hours (in seconds)
  const TEST_DURATION = 3 * 60 * 60;

  // Always reset timer on refresh or navigation away
  useEffect(() => {
    // Set new end time on mount (refresh)
    const newEndTime = Date.now() + TEST_DURATION * 1000;
    localStorage.setItem("testEndTime", newEndTime);
    setRemainingTime(TEST_DURATION);

    // Optional: Reset timer if user is about to leave (no alert)
    const handleBeforeUnload = () => {
      const resetEndTime = Date.now() + TEST_DURATION * 1000;
      localStorage.setItem("testEndTime", resetEndTime);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
    // eslint-disable-next-line
  }, []);

  const [remainingTime, setRemainingTime] = useState(TEST_DURATION);

  useEffect(() => {
    console.log("Branch", user.branchId);
    if (remainingTime <= 0) {
      // Auto-submit test if time is up
      if (!isSubmitting && !showEvalutionModal) {
        setIsSubmitting(true);
        setShowTestSummary(false);
        submitTest(user.branchId, user._id);
      }
      return;
    }
    const timer = setInterval(() => {
      const savedEndTime = localStorage.getItem("testEndTime");
      const endTime = savedEndTime ? parseInt(savedEndTime, 10) : Date.now() + TEST_DURATION * 1000;
      const now = Date.now();
      const newRemaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setRemainingTime(newRemaining);
      if (newRemaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line
  }, [remainingTime, isSubmitting, showEvalutionModal, user.branchId, user._id]);

  // Clean up endTime on unmount or test submit
  useEffect(() => {
    if (showEvalutionModal) {
      localStorage.removeItem("testEndTime");
    }
  }, [showEvalutionModal]);

  // Format remaining time as HH:MM:SS
  function formatTime(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  TestUI.formatTime = formatTime;
  TestUI.remainingTime = remainingTime;

  const handleCalculatorClick = () => {
    setShowCalculator(!showCalculator);
  };

  // Handles clicking a question number and updates its status dynamically
  const handleQuestionClick = (number) => {
    setSelectedQuestion(number);

    setQuestionStatus((prevStatus) => {
      const updatedStatus = [...prevStatus];
      const index = number - 1;
      const currentQuestion = currentQuestions[index];

      // Find chosen answer for this question
      const answerEntry = chosenAnswers.find(ans => ans.questionId === currentQuestion?._id);
      const hasAnswer = answerEntry && answerEntry.chosenAnswer && answerEntry.chosenAnswer.length > 0;

      // If already marked for review, keep marked/answeredMarked
      if (updatedStatus[index] === "marked" || updatedStatus[index] === "answeredMarked") {
        return updatedStatus;
      }

      // If not visited, update to answered/notAnswered based on answer
      if (updatedStatus[index] === "notVisited") {
        updatedStatus[index] = hasAnswer ? "answered" : "notAnswered";
      } else if (updatedStatus[index] === "notAnswered" && hasAnswer) {
        updatedStatus[index] = "answered";
      } else if (updatedStatus[index] === "answered" && !hasAnswer) {
        updatedStatus[index] = "notAnswered";
      }
      // else keep as is (for marked, answeredMarked, etc.)

      return updatedStatus;
    });
  };

  const handleTabSwitch = (section) => {
    setCurrentSection(section);
    setSelectedQuestion(1); // Reset to the first question in the new section
    // Note: questionStatus should ideally track status for all questions, not just the current section.
    // Re-initializing here might lose status from the other section.
    // A more robust approach would be to manage question status globally as well.
    // For now, keeping the existing behavior for questionStatus on tab switch.
    const totalQuestions =
      section === "Aptitude" ? aptitudeQuestions.length : technicalQuestions.length;
    setQuestionStatus(Array(totalQuestions).fill("notVisited"));
  };

  // Function to get the chosen answer for the current question from state
  const getChosenAnswerForCurrentQuestion = () => {
    const currentQuestion = currentQuestions[selectedQuestion - 1];
    if (!currentQuestion) return null;
    const answerEntry = chosenAnswers.find(ans => ans.questionId === currentQuestion._id);
    return answerEntry ? answerEntry.chosenAnswer : null;
  };


  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <nav className="bg-gray-100 border-b-2 border-gray-200 shadow-2xs-gray flex flex-row justify-between items-center text-gray-800 px-6 h-15 md:h-16 lg:h-16 w-full sticky">
        <Logo></Logo>
      </nav>

      {/* User Info */}
      <div className="mx-3 mt-4 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-white py-2 px-4 rounded-md shadow-md">
        <p className="lg:text-lg font-medium">
          Candidate: {user.name} | Branch: {user.branchName}
        </p>
      </div>

      {/* Timer and Calculator */}
      <div className="flex justify-between items-center w-3/4 mt-4">
        <button
          className="rounded bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-white px-4 py-2 transition duration-300 ease-in-out"
          onClick={handleCalculatorClick}
        >
          {showCalculator ? "Hide Calculator" : "Show Calculator"}
        </button>
        <p className="text-lg font-semibold text-red-600">
        Time Left: {formatTime(remainingTime)}
      </p>
      </div>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row lg:flex-row w-9/10 mt-4 mb-10 h-200 md:h-140 lg:h-120 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Section */}
        <div className="w-full lg:w-3/4 p-6">
          <SectionTabs
            currentSection={currentSection}
            setCurrentSection={handleTabSwitch}
          />

          {selectedQuestion && (
            <p className="mt-4 text-lg font-semibold text-blue-700">
              Selected Question: {selectedQuestion}
            </p>
          )}

          {/* Question Display */}
          <div className="mt-4 p-4 border-2 border-gray-300 rounded-md h-75 lg:h-65">
            <p className="text-lg font-semibold">
              Question no: {selectedQuestion}
            </p>
            <p className="text-lg font-semibold">
              {currentQuestions[selectedQuestion - 1]?.question}
            </p>
            <p className="text-sm font-medium text-gray-600">
              Marks: {currentQuestions[selectedQuestion - 1]?.mark}
              {currentQuestions[selectedQuestion - 1]?.negativeMark && (
                <span className="text-red-600 ml-2">
                  (Negative Mark: {currentQuestions[selectedQuestion - 1]?.mark}
                  /3)
                </span>
              )}
            </p>
            <div className="flex flex-col items-start mt-4">
              {currentQuestions[selectedQuestion - 1]?.queType === "MCQ" &&
                currentQuestions[selectedQuestion - 1]?.options?.map(
                  (option, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name={`question-${selectedQuestion}`}
                        value={option}
                        id={`option-${selectedQuestion}-${index}`}
                        checked={
                          getChosenAnswerForCurrentQuestion()?.[0] === option
                        } // Ensure chosenAnswer is an array
                        onChange={() =>
                          handleAnswerSelect(
                            currentQuestions[selectedQuestion - 1],
                            option
                          )
                        } // Pass question object and selected option
                        className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                      />
                      <label
                        htmlFor={`option-${selectedQuestion}-${index}`}
                        className="ml-2 text-gray-700 cursor-pointer"
                      >
                        {option}
                      </label>
                    </div>
                  )
                )}

              {currentQuestions[selectedQuestion - 1]?.queType === "MSQ" &&
                currentQuestions[selectedQuestion - 1]?.options?.map(
                  (option, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        name={`question-${selectedQuestion}`}
                        value={option}
                        id={`option-${index}`}
                        checked={
                          Array.isArray(getChosenAnswerForCurrentQuestion()) &&
                          getChosenAnswerForCurrentQuestion().includes(option)
                        } // Check if this option is in the selected options array
                        onChange={() =>
                          handleAnswerSelect(
                            currentQuestions[selectedQuestion - 1],
                            option
                          )
                        } // Pass question object and selected option
                        className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                      />
                      <label
                        htmlFor={`option-${index}`}
                        className="ml-2 text-gray-700 cursor-pointer"
                      >
                        {option}
                      </label>
                    </div>
                  )
                )}

              {currentQuestions[selectedQuestion - 1]?.queType === "NAT" && (
                <div className="flex items-center mb-2">
                  <label htmlFor={`nat-${selectedQuestion}`} className="mr-2">
                    Answer:
                  </label>
                  <input
                    type="text"
                    name={`question-${selectedQuestion}`}
                    id={`nat-${selectedQuestion}`}
                    className="border border-gray-300 rounded-md px-2 py-1"
                    value={getChosenAnswerForCurrentQuestion() || ""} // Set the value from state
                    onChange={(e) =>
                      handleAnswerSelect(
                        currentQuestions[selectedQuestion - 1],
                        e.target.value
                      )
                    } // Pass question object and input value
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={clearResponse}
              className="mx-2 h-12 w-30 lg:h-10 lg:w-38 
             flex items-center justify-center
             text-sm font-semibold text-gray-800 
             border-2 border-blue-900 rounded 
             hover:bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 
             hover:text-white transition duration-300 ease-in-out"
            >
              Clear Response
            </button>
            <button
              onClick={() => markForReview()}
              className="mx-2 h-12 w-30 lg:h-10 lg:w-38 
             flex items-center justify-center
             text-sm font-semibold text-gray-800 
             border-2 border-blue-900 rounded 
             hover:bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 
             hover:text-white transition duration-300 ease-in-out"
            >
              Mark for Review
            </button>
            <button
              onClick={() => saveAndNext()}
              className="mx-2 h-12 w-30 lg:h-10 lg:w-38 
             flex items-center justify-center
             text-sm font-semibold text-gray-800 
             border-2 border-blue-900 rounded 
             hover:bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 
             hover:text-white transition duration-300 ease-in-out"
            >
              Save & Next
            </button>
            <button
              onClick={() => {
                if (!isSubmitting) {
                  // console.log("Branch ID:", user.branchId);
                  // console.log("Created By:", user._id);
                  setIsSubmitting(true); // Disable the button
                  setShowTestSummary(true); // Pass user._id as createdBy
                }
              }}
              disabled={isSubmitting} // Disable the button after the first click
              className={`mx-2 h-12 w-30 lg:h-10 lg:w-38 
             flex items-center justify-center
             text-sm font-semibold text-gray-800 
             border-2 border-blue-900 rounded 
             hover:bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 
             hover:text-white transition duration-300 ease-in-out ${
               isSubmitting ? "opacity-50 cursor-not-allowed" : ""
             }`}
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/4 p-6 bg-gray-100 border-l-2 border-gray-300 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">
            Chosen Section: {currentSection}
          </h2>
          <p className="text-sm mb-4 text-gray-600">Choose a Question</p>
          <div className="grid grid-cols-4 gap-2 md:gap-6 md:pr-2">
            {currentQuestions.map((_, index) => (
              <QuestionStatusButtons
                key={index}
                number={index + 1}
                status={questionStatus[index]}
                onClick={() => handleQuestionClick(index + 1)}
              />
            ))}
          </div>
        </div>
      </div>

      {showTestSummary && (
        <TestSummary
          onConfirm={() => {
            setShowTestSummary(false);
            submitTest(user.branchId, user._id);
          }}
          onCancel={() => {
            setShowTestSummary(false);
            setIsSubmitting(false); // Re-enable the button
          }}
          totalQuestions={aptitudeQuestions.length + technicalQuestions.length}
          attemptedQuestions={
            chosenAnswers.filter((ans) => ans.attemptedStatus).length
          }
        />
      )}

      {showEvalutionModal && (
        <TestEvaluationModal
          progressMessage={progressMessage}
          result={result} // Replace with actual result state if available
          onClose={() => {
            // alert("Test evaluation completed!");
            setShowEvalutionModal(false);
            setIsSubmitting(false);
            navigate("/userProfile"); // Redirect to home or desired route
          }}
        />
      )}

      {/* Scientific Calculator */}
      {showCalculator && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4">
          <ScientificCalculator />
        </div>
      )}
    </div>
  );
}


export default TestUI;


const TestSummary = ({ onConfirm, onCancel, totalQuestions, attemptedQuestions }) => {
  const attemptedPercentage = Math.round((attemptedQuestions / totalQuestions) * 100);

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-11/12 max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Test Summary</h2>
        <div className="flex justify-center items-center mb-6">
          <div className="w-24 h-24">
            <CircularProgressbar
              value={attemptedPercentage}
              text={`${attemptedPercentage}%`}
              styles={buildStyles({
                textColor: "#1D4ED8",
                pathColor: "#1D4ED8",
                trailColor: "#D1D5DB",
              })}
            />
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg text-gray-700">Total Questions: {totalQuestions}</p>
          <p className="text-lg text-green-600">Attempted: {attemptedQuestions}</p>
          <p className="text-lg text-red-600">Unattempted: {totalQuestions - attemptedQuestions}</p>
        </div>
        <p className="text-sm text-red-600 font-semibold mt-4 text-center">
          Warning: Once submitted, you cannot change your answers.
        </p>
        <div className="flex justify-end mt-6">
          <button
            onClick={onCancel}
            className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};



const TestEvaluationModal = ({ progressMessage, result, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-screen h-screen p-8">
        <h2 className="text-3xl font-extrabold text-blue-900 mb-6 text-center">
          Test Evaluation
        </h2>
        {result ? (
          <div className="space-y-4">
            <p className="text-xl font-semibold text-green-600">
              {result.message}
            </p>
            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
              <p className="text-lg font-medium text-gray-800">
                Total Marks: <span className="font-bold">{result.totalMarks}</span>
              </p>
              <p className="text-lg font-medium text-gray-800 mt-2">
                Section-wise Marks:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-2">
                <li>
                  <span className="font-semibold">Aptitude:</span> {result.sectionwiseMarks.aptitude}
                </li>
                <li>
                  <span className="font-semibold">Technical:</span> {result.sectionwiseMarks.technical}
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
              <p className="text-lg font-medium text-gray-800">
                Percentage: <span className="font-bold">{result.percentage}%</span>
              </p>
              <p className="text-lg font-medium text-gray-800 mt-2">
                Qualified:{" "}
                <span
                  className={`font-bold ${
                    result.qualified ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {result.qualified ? "Yes" : "No"}
                </span>
              </p>
              <p className="text-lg font-medium text-gray-800 mt-2">
                GATE Score Estimate:{" "}
                <span className="font-bold">{result.gateScoreEstimate}</span>
              </p>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-blue-900 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              >
                View Detailed Results
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-lg font-medium text-gray-700 mb-4">
              {progressMessage}
            </p>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};
