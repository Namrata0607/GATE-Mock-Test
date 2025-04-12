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

  const [currentSection, setCurrentSection] = useState("Aptitude");
  const totalQuestions = currentSection === "Aptitude" ? 15 : 50;

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionStatus, setQuestionStatus] = useState(
    Array(50).fill("notVisited")
  );

  const handleQuestionClick = (number) => {
    setSelectedQuestion(number);

    const updated = [...questionStatus];
    const index = number - 1;
    updated[index] =
      updated[index] === "answered" ? "answeredMarked" : "answered";
    setQuestionStatus(updated);
  };

  const handleTabSwitch = (currentSection) => {
    setCurrentSection(currentSection);
    setSelectedQuestion(null);
    setQuestionStatus(Array(50).fill("notVisited"));
  };

  const [user, setUser] = useState({ name: '', branch: '' });
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  

  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        const data = await fetchData('http://localhost:3000/api/users/userdetails');
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Set up a timer to update the current time every second
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
      <nav className="bg-gray-100 border-b-2 border-gray-200 shadow-sm h-17 w-full flex justify-between items-center text-gray-800 p-5">
        <h1 className="font-bold text-2xl">GATEPrep</h1>
        <div className="flex space-x-5 items-center border border-gray-300 rounded-lg p-2">
          <h2 className="font-medium">Name: {user.name}</h2>
          <h2 className="font-medium">Branch: {user.branch}</h2>
        </div>
      </nav>
      
      <div className="flex space-x-5 mx-auto mt-1 p-3 border-2 border-gray-300 bg-blue-100">
      <p>Timer: {currentTime.toLocaleTimeString()}</p>
      <button
        className="border-2 border-gray-400 rounded p-2 bg-blue-400"
        onClick={handleCalculatorClick}
      >
        {/* Scientific Calculator */}
        {showCalculator ? "Hide Calculator" : "Show Calculator"}
      </button>

      
      {/* Conditionally render ScientificCalculator component */}
      {showCalculator && <ScientificCalculator />}
      
    </div>

    {/* main Container */}
    {/* sm:w-full lg:w-full xl:w-full */}
    {/* h-full sm:h-72 md:h-80 lg:h-96 xl: */}
      <div className="m-0 container flex mx-auto p-3 rounded-lg w-full h-[600px] text-center">
        
        {/* Left Section */}
        <div className="w-2/2 h-full border-2 border-gray-300  rounded-lg p-4">
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
          <div className="mt-4 p-4 border-2 border-gray-300 rounded-lg h-60">
            <p>Question display</p>
          </div>

          <div className="bottom-0 left-0 right-0 flex justify-between items-center mt-8">
            <button className="bg-blue-200 text-black border border-blue-300 px-4 py-2 rounded hover:bg-blue-100">Clear Response</button>
            <button className="bg-blue-200 text-black border border-blue-300 px-4 py-2 rounded hover:bg-blue-100">Save & Next</button>
          </div>

        </div>


        {/* Right Panel - Question Pallet */}
        <div className="w-1/3 h-full border-2 border-gray-300 rounded-lg p-4 overflow-y-auto">
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-1">
              Chosen Section: {currentSection}
            </h2>
            <p className="text-sm mb-3 text-gray-600">Choose a Question</p>

            <div className="grid grid-cols-4 gap-1 justify-items-center">
              {[...Array(totalQuestions)].map((_, index) => (
                <QuestionStatusButtons
                  key={index}
                  number={index + 1}
                  status={questionStatus[index]}
                  onClick={handleQuestionClick}
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