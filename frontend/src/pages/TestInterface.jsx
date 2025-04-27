import {React} from 'react'
import { useEffect, useState } from 'react';
import { fetchData } from '../utils/UserDetails';
import SectionTabs from '../components/SectionTabs';
import QuestionStatusButtons from '../components/QuestionStatusButtons';
import ScientificCalculator from '../components/ScientificCalci';

function TestUI() {

  const [showCalculator, setShowCalculator] = useState(false);
  const handleCalculatorClick = () => {
    setShowCalculator(!showCalculator);
  }
  
  // Fetching test questions
  const [aptitudeQuestions, setaptitudeQuestions] = useState([]);
  const [technicalQuestions, setTechnicalQuestions] = useState([]);

  useEffect(() => {
    const fetchTestQuestions = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/test/questions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch test questions");
        }
        const data = await response.json();
        console.log(data);
        setaptitudeQuestions(data.aptitudeQuestions);
        setTechnicalQuestions(data.technicalQuestions);
      } catch (error) {
        console.error("Error fetching test questions:", error.message);
      }
    };
    fetchTestQuestions();
  }
  , []);

  const [currentSection, setCurrentSection] = useState("Aptitude");
  const [selectedQuestion, setSelectedQuestion] = useState(1);

  const totalQuestions = currentSection === "Aptitude" ? 15 : 50;
  const [questionStatus, setQuestionStatus] = useState(
    Array(totalQuestions).fill("notVisited")
  );


  const handleQuestionClick = (number) => {
    setSelectedQuestion(number);

    const updatedStatus = [...questionStatus];
    const index = number - 1;
   // Update the status of the clicked question
    if (updatedStatus[index] === "notVisited") {
      updatedStatus[index] = "notAnswered";
    } else if (updatedStatus[index] === "answered") {
      updatedStatus[index] = "answeredMarked";
    }
    setQuestionStatus(updatedStatus);
  };

  const handleTabSwitch = (section) => {
    setCurrentSection(section);
    setSelectedQuestion(null);
    const total = section === "Aptitude" ? 15 : 50;
    setQuestionStatus(Array(total).fill("notVisited"));
  };
  
  // Fetching user details 
  const [user, setUser] = useState({ name: '', branch: '' });
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
        console.log("Token:", token); // Debug log
        if
         (!token) {
          console.error('No token found. User is not logged in.');
          return;
        }
  
        const data = await fetchData('http://localhost:3000/api/users/userdetails', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });
  
        setUser(data); // Set user details in state
      } catch (err) {
        setError(err.message);
      }
    };
  
    fetchUserData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <>
    {/* nav bar for user info */}
      <nav className="bg-gray-100 border-b-2 border-gray-200 shadow-2xs-gray h-15 md:h-16 lg:h-16 w-full flex justify-between items-center text-gray-800 p-5">
      <h1 className="font-[Open_Sans] font-bold text-xl md:text-2xl lg:text-3xl animate-shimmer bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
        GATEPREP
      </h1>
        <div className="flex space-x-2 items-center bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 rounded-sm p-2 h-10 w-60 ml-9 mt-4 mb-4 font-[sans] md:w-80 md:pl-5 lg:w-90 lg:pl-7 text-white text-sm md:text-lg lg:text-xl">
          <h2 className="font-medium">{user.name}</h2><b>-</b>
          <h2 className="font-medium">{user.branch}</h2>
        </div>
      </nav>
      
      <div className="flex space-x-5 mx-auto my-2 w-100 h-12 justify-between items-center font-[sans]">
      <button
        className="rounded bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 h-8 text-white px-2 transition duration-300 ease-in-out text-sm"
        onClick={handleCalculatorClick}
        >
        {/* Scientific Calculator */}
        {showCalculator ? "Hide Calculator" : "Show Calculator"}
      </button>
        <p>Timer: {currentTime.toLocaleTimeString()}</p>

      {/* Conditionally render ScientificCalculator component */}
      {showCalculator && <ScientificCalculator />}
      
    </div>

    {/* main Container */}
    {/* sm:w-full lg:w-full xl:w-full */}
    {/* h-full sm:h-72 md:h-80 lg:h-96 xl: */}
      <div className="-mt-6 container flex flex-col lg:flex-row mx-auto p-3 w-full h-[600px] text-center">
        
        {/* Left Section */}
        {/* border-2 border-gray-300 */}
        <div className="w-2/2 h-full rounded-lg p-4">
          <SectionTabs
            currentSection={currentSection}
            setCurrentSection={handleTabSwitch}
          />

          <div>
            {selectedQuestion && (
              <p className="mt-4 text-lg font-semibold text-blue-700">
              Selected Question: {selectedQuestion}
            </p>
            )}
          </div>

          {/* Question display */}
          <div className="mt-4 p-4 border-2 border-gray-300 rounded-sm h-90 justify-items-start">
            <>
              <p className="text-lg font-semibold">Question no: {selectedQuestion}</p>
              <p className="text-lg font-semibold">
                {currentSection === "Aptitude"
                  ? aptitudeQuestions[selectedQuestion - 1]?.question
                  : technicalQuestions[selectedQuestion - 1]?.question}
              </p>
              <div className="flex flex-col items-start mt-2">
                {(currentSection === "Aptitude"
                  ? aptitudeQuestions[selectedQuestion - 1]?.options
                  : technicalQuestions[selectedQuestion - 1]?.options
                )?.map((option, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${selectedQuestion}`}
                      value={option}
                      id={`option-${index}`}
                    />
                    <label htmlFor={`option-${index}`} className="ml-2">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </>
          </div>

          <div className="bottom-0 left-0 right-0 flex justify-between items-center mt-8">
            <button className="bg-blue-200 text-black border border-blue-300 px-4 py-2 rounded hover:bg-blue-100">Clear Response</button>
            <button className="bg-blue-200 text-black border border-blue-300 px-4 py-2 rounded hover:bg-blue-100">Save & Next</button>
          </div>

        </div>

        {/* Right Panel - Question Pallet */}
        {/* overflow-y-auto */}
        <div className="w-2/2 h-full rounded-lg p-4">
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-1">
              Chosen Section: {currentSection}
            </h2>
            <p className="text-sm mb-3 text-gray-600">Choose a Question</p>

            <div className="grid grid-cols-4 gap-1 justify-items-center">
              {questionStatus.map((status, index) => (
                <QuestionStatusButtons
                  key={index}
                  number={index + 1} // Pass the question number
                  status={status} // Pass the status of the question
                  onClick={() => handleQuestionClick(index + 1)} // Handle button click
                />
              ))}
            </div>
            
          </div>
        </div>

      </div>
    </>
    
  );
}

export default TestUI;