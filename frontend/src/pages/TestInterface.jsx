import React, { useEffect, useState } from "react";
import { fetchData } from "../utils/UserDetails";
import SectionTabs from "../components/SectionTabs";
import QuestionStatusButtons from "../components/QuestionStatusButtons";
import ScientificCalculator from "../components/ScientificCalci";

function TestUI() {
  const [showCalculator, setShowCalculator] = useState(false);
  const [aptitudeQuestions, setAptitudeQuestions] = useState([]);
  const [technicalQuestions, setTechnicalQuestions] = useState([]);
  const [currentSection, setCurrentSection] = useState("Aptitude");
  const [selectedQuestion, setSelectedQuestion] = useState(1);
  const [questionStatus, setQuestionStatus] = useState([]);
  const [user, setUser] = useState({ name: "", branch: "" });
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [popupData, setPopupData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  function Popup({ data, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg">
          <h2 className="text-xl font-bold mb-4">Test Data</h2>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
          <button
            onClick={onClose}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  let chosenAnswers = JSON.parse(localStorage.getItem('chosenAnswers')) || [];

// Save and Next Button Handler
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

function saveAndNext(questionId, chosenAnswer) {
  // Ensure chosenAnswer is consistent
  const formattedAnswer =
    Array.isArray(chosenAnswer) && chosenAnswer.length === 1
      ? chosenAnswer[0] // Convert single-element array to string
      : chosenAnswer;

  // Check if the question already exists in chosenAnswers
  const existingAnswerIndex = chosenAnswers.findIndex(
    (answer) => answer.question === questionId
  );

  if (existingAnswerIndex !== -1) {
    // Update the existing answer
    chosenAnswers[existingAnswerIndex].chosenAnswer = formattedAnswer;
    chosenAnswers[existingAnswerIndex].attemptedStatus = true;
  } else {
    // Add a new answer
    chosenAnswers.push({
      question: questionId,
      chosenAnswer: formattedAnswer,
      attemptedStatus: true,
    });
  }

  // Save the updated array to localStorage
  localStorage.setItem("chosenAnswers", JSON.stringify(chosenAnswers));

  // Navigate to the next question
  goToNextQuestion();
}

// Submit Test Button Handler
async function submitTest(branchId, createdBy) {
  const token = localStorage.getItem("userToken");
  if (!token) {
    alert("No token found. Please log in again.");
    return;
  }

  // Fetch the chosen answers from localStorage
  const testResponses = JSON.parse(localStorage.getItem("chosenAnswers")) || [];
  const subjectsData = JSON.parse(localStorage.getItem("subjectsData")) || [];


  if (testResponses.length === 0) {
    alert("No answers have been saved. Please attempt some questions before submitting.");
    return;
  }

  if (!subjectsData || subjectsData.length === 0) {
    alert("Subjects data is missing. Please reload the test.");
    return;
  }
  
  const isValidSubjectsData = subjectsData.every((subject) =>
    subject.subject && /^[a-f\d]{24}$/i.test(subject.subject) // Check if subject is a valid ObjectId
  );
  
  if (!isValidSubjectsData) {
    console.log("subjectsData:", subjectsData); // Log the invalid subjectsData for debugging
    // Log the invalid subjectsData for debugging
    alert("Invalid subject data. Please reload the test.");
    //return;
  }

  // Prepare the payload for uploading the test
  const payload = {
    branchId: branchId,
    subjectsData: subjectsData, // Use dynamically fetched subjectsData
    createdBy: createdBy,
    testResponses: testResponses, // Include the chosen answers
  };

  console.log("Payload:", payload); // Log the payload for debugging

  try {
    const response = await fetch("http://localhost:3000/api/test/uploadTest/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token here
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("Response:", result); // Log the response for debugging

    if (response.ok) {
      alert(result.message);

      
      // Submit the test for the user
      await submitUserTest(result.testId, testResponses);
      
      // Show the popup with the returned data
      setPopupData(result.testData); // Store the returned data
      setShowPopup(true); // Show the popup

      // Clear localStorage after submission
      localStorage.removeItem("chosenAnswers");
      localStorage.removeItem("subjectsData");

      console.log("Received Subjects Data:", subjectsData);

      alert("Test submitted successfully!");
        } else {

      console.error("Error:", result.message);
    }
  } catch (error) {
    console.error("Error submitting test:", error);
    alert("An error occurred while submitting the test.");
  }
}

// Submit User Test Handler
async function submitUserTest(testId, testResponses) {
  const token = localStorage.getItem('userToken');
    if (!token) {
        alert('No token found. Please log in again.');
        return;
    }

  try {

      // Prepare the payload for updating the user's document
      const payload = {
          testId: testId,
          testResponses: testResponses.map((response) => ({
              question: response.question, // Question ID
              chosenAnswer: response.chosenAnswer, // User's chosen answer(s)
              attemptedStatus: response.attemptedStatus, // Whether the question was attempted
          })),
      };

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
          alert(result.message);
      } else {
          alert('Error: ' + result.message);
      }
  } catch (error) {
      console.error('Error submitting user test:', error);
      alert('An error occurred while submitting the user test.');
  }
}


  const handleCalculatorClick = () => {
    setShowCalculator(!showCalculator);
  };

  const handleQuestionClick = (number) => {
    setSelectedQuestion(number);
  
    const updatedStatus = [...questionStatus];
    const index = number - 1;
    if (updatedStatus[index] === "notVisited") {
      updatedStatus[index] = "notAnswered";
    }
    setQuestionStatus(updatedStatus);
  };
  
  const handleTabSwitch = (section) => {
    setCurrentSection(section);
    setSelectedQuestion(1); // Reset to the first question in the new section
    const totalQuestions =
      section === "Aptitude" ? aptitudeQuestions.length : technicalQuestions.length;
    setQuestionStatus(Array(totalQuestions).fill("notVisited"));
  };

  useEffect(() => {
//     const fetchTestQuestions = async () => {
//       try {
//         const token = localStorage.getItem("userToken");
//         if (!token) {
//           throw new Error("Authorization token is missing.");
//         }
    
//         const response = await fetch("http://localhost:3000/api/testQuestions/getTestQuestions", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
    
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || "Failed to fetch test questions");
//         }
    
//         const data = await response.json();
    
//         // Ensure data exists before setting state
//         setAptitudeQuestions(data.aptitudeQuestions || []);
//         setTechnicalQuestions(
//           (data.branchSpecificQuestions || []).flatMap((subject) => subject.questions || [])
//         );
//         setQuestionStatus(Array((data.aptitudeQuestions || []).length).fill("notVisited"));
    
//         // Prepare subjectsData dynamically
//         const subjectsData = (data.branchSpecificQuestions || []).map((subject) => ({
//           subject: subject._id, // Use valid ObjectId for the subject
//           questions: (subject.questions || []).map((q) => q._id), // Use valid ObjectIds for questions
//         }));
    
//         localStorage.setItem("subjectsData", JSON.stringify(subjectsData));
        
// console.log("branchSpecificQuestions:", data.branchSpecificQuestions);
// console.log("Prepared subjectsData:", subjectsData);// Save to localStorage for later use
//       } catch (error) {
//         console.error("Error fetching test questions:", error.message);
//         setError(error.message);
//       }
//     };
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

    console.log("branchSpecificQuestions:", data.branchSpecificQuestions);

    // Ensure data exists before setting state
    setAptitudeQuestions(data.aptitudeQuestions || []);
    setTechnicalQuestions(
      (data.branchSpecificQuestions || []).flatMap((subject) => subject.questions || [])
    );
    setQuestionStatus(Array((data.aptitudeQuestions || []).length).fill("notVisited"));

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
  
        // Set user details in state
        setUser({
          name: data.name,
          branchId: data.branchId, // Store branch ID
          branchName: data.branchName, // Store branch name
          _id: data._id, // Store user ID
        });
      } catch (err) {
        console.error("Error fetching user details:", err.message);
        setError(err.message);
      }
    };
  
    fetchUserData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>Loading...</p>;

  const currentQuestions =
    currentSection === "Aptitude" ? aptitudeQuestions : technicalQuestions;

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <nav className="bg-gray-100 border-b-2 border-gray-200 shadow-2xs-gray flex flex-row justify-between items-center text-gray-800 px-6 h-15 md:h-16 lg:h-16 w-full sticky">
        <h1 className="font-[Open_Sans] font-bold text-3xl animate-shimmer bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
          GATEPREP
        </h1>
      </nav>

      {/* User Info */}
      <div className="mt-4 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-white py-2 px-4 rounded-md shadow-md">
        <p className="text-lg font-medium">
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
        <p className="text-lg font-semibold">Timer: {currentTime.toLocaleTimeString()}</p>
      </div>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row w-9/10 mt-4 h-120 bg-white shadow-lg rounded-lg overflow-hidden">
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
          <div className="mt-4 p-4 border-2 border-gray-300 rounded-md">
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
                (Negative Mark: {currentQuestions[selectedQuestion - 1]?.mark}/3)
              </span>
            )}
          </p>
          <div className="flex flex-col items-start mt-4">
          {currentQuestions[selectedQuestion - 1]?.queType === "MCQ" &&
            currentQuestions[selectedQuestion - 1]?.options?.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="radio"
                  name={`question-${selectedQuestion}`}
                  value={option}
                  id={`option-${index}`}
                  onChange={() => setSelectedAnswer(option)} // Update selectedAnswer
                />
                <label htmlFor={`option-${index}`} className="ml-2">
                  {option}
                </label>
              </div>
            ))}

          {currentQuestions[selectedQuestion - 1]?.queType === "MSQ" &&
            currentQuestions[selectedQuestion - 1]?.options?.map((option, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  name={`question-${selectedQuestion}`}
                  value={option}
                  id={`option-${index}`}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAnswer((prev) => [...(prev || []), option]); // Add option
                    } else {
                      setSelectedAnswer((prev) => prev.filter((ans) => ans !== option)); // Remove option
                    }
                  }}
                />
                <label htmlFor={`option-${index}`} className="ml-2">
                  {option}
                </label>
              </div>
            ))}

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
                    onChange={(e) => setSelectedAnswer(e.target.value)} // Update selectedAnswer
                  />
                </div>
              )}
          </div>
        </div>

          <div className="flex justify-between items-center mt-6">
            <button className="flex hover:bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-2 border-blue-900
             hover:text-white text-gray-800 font-semibold px-6 py-2 rounded hover:bg-white transition duration-300 ease-in-out">
              Clear Response
            </button>
            <button
              onClick={() => saveAndNext(currentQuestions[selectedQuestion - 1]?.id, selectedAnswer)}
              className="flex hover:bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-2 border-blue-900
                        hover:text-white text-gray-800 font-semibold px-6 py-2 rounded hover:bg-white transition duration-300 ease-in-out"
            >
              Save & Next
            </button>
            <button
              onClick={() => {
                if (!isSubmitting) {
                  console.log("Branch ID:", user.branchId);
                  console.log("Created By:", user._id);
                  setIsSubmitting(true); // Disable the button
                  submitTest(user.branchId, user._id); // Pass user._id as createdBy
                }
              }}
              disabled={isSubmitting} // Disable the button after the first click
              className={`flex hover:bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-2 border-blue-900
                          hover:text-white text-gray-800 font-semibold px-6 py-2 rounded hover:bg-white transition duration-300 ease-in-out ${
                              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
          >
              Submit Test
          </button>
          {/* Popup for displaying data */}
          {showPopup && (
            <Popup
              data={popupData}
              onClose={() => setShowPopup(false)} // Close the popup
            />
          )}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/4 p-6 bg-gray-100 border-l-2 border-gray-300 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Chosen Section: {currentSection}</h2>
          <p className="text-sm mb-4 text-gray-600">Choose a Question</p>
          <div className="grid grid-cols-4 gap-2">
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