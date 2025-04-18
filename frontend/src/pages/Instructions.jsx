import React, { useEffect, useState } from 'react'
import '../App.css'
import { useNavigate } from "react-router-dom";
import { fetchData } from '../utils/UserDetails';

function Instructions() {
  const [isChecked, setIsChecked] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // const [userName, setUserName] = useState('');
  // const [user, setUser] = useState({ name: ''});
  const [user, setUser] = useState({ name: '', branch: '' });
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  

  const buttons = [
    { text: "1", color: "bg-gray-200 border-gray-400 text-black rounded-md", info: "You have NOT visited the question yet." },
    { text: "2", color: "bg-red-500 border-red-700 text-white rounded-b-lg rounded-t-none", info: "You have NOT answered the question yet." },
    { text: "3", color: "bg-green-500 border-green-700 text-white rounded-t-lg rounded-b-none", info: "You have answered the question.This will be evaluated." },
    { text: "4", color: "bg-purple-500 border-purple-700 text-white rounded-full", info: "You have NOT answered the question but marked it for review." },
    { text: "5", color: "bg-purple-500 border-purple-700 text-white rounded-full relative", info: "You have answered the question and marked it for review.This will also be evaluated." },
  ];

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
    

    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>Loading...</p>;

  const onClickHandler = () => {
    navigate("/testui");
  };

 
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='container text-center border-2 border-gray-300 w-100 mx-auto h-100 mt-10 shadow-lg bg-gray-100'>
        <h1>Test Attempted details</h1>
        <p className="text-lg font-semibold">Welcome! {user.name}</p>
        {/* <p>{localStorage.getItem('username')}</p> */}
      </div>
      <div className='lg:flex lg:flex-row lg:justify-center lg:items-center'>
        <div className='flex flex-row justify-center'>
          <img src="/Images/start_demo.png" alt="GATE_2025" className="h-100 object-cover" />
        </div>
        <div className='container text-center border-2 border-gray-300 p-4 m-4 w-100 mx-auto h-220 relative shadow-lg bg-gray-100 flex flex-col mb-20
        md:w-150 md:h-200 lg:w-150 lg:px-10'>
          <h1 className='text-gray-800 text-3xl font-bold font-[Open_Sans] mt-5'>Instructions</h1>
          <div className='h-70 mt-2 p-4 text-left flex-col mb-20'>
      
            <ul className="list-disc list-inside text-gray-900 space-y-4">
              <li className='m-2 font-semibold'>General Guidelines</li>
              <ol className="list-decimal list-inside text-gray-800 space-y-2 ml-4">
                <li>This is a timed test; ensure a stable internet connection.</li>
                <li>Do not refresh, close, or switch tabs during the test.</li>
                <li>Read questions carefully before selecting an answer.</li>
              </ol>

              <li className='m-2 font-semibold'>Test Format</li>
              <ol className="list-decimal list-inside text-gray-800 space-y-2 ml-4">
                <li>Consists of multiple-choice questions.</li>
                <li>Correct answers earn points; some may have negative marking.</li>
                <li>Unanswered questions won't be scored.</li>
              </ol>

              <li className='m-2 font-semibold'>Submission & Timer</li>
              <ol className="list-decimal list-inside text-gray-800 space-y-2 ml-4">
                <li>The timer starts when you begin the test.</li>
                <li>Test auto-submits when time runs out.</li>
                <li>Ensure all answers are selected before submission.</li>
              </ol>

              <li className='m-2 font-semibold'>Fair Attempt Rules</li>
              <ol className="list-decimal list-inside text-gray-800 space-y-2 ml-4">
                <li>No external help or cheating is allowed.</li>
                <li>Violating rules may result in disqualification.</li>
              </ol>
            </ul>

          </div>
          <div className='relative flex flex-row mt-75 justify-center md:mt-40'>
            <input
            type="checkbox"
            className="h-5 w-5 mx-10 my-10 -ml-1 "
            onChange={(e) => setIsChecked(e.target.checked)}
            />
            <button onClick={() => setIsPopupOpen(true)}
          className={`border-2 h-10 w-50 my-8 mx-2 rounded-sm ${
            isChecked
              ? "bg-blue-200 border-blue-200 hover:bg-blue-100"
              : "bg-gray-300 border-gray-300 cursor-not-allowed"
          }`}
          disabled={!isChecked}
        >I Agree and Proceed</button>
          </div>
        <h1 className='text-gray-600 text-sm -mt-3 justify-center'>Please mark the check box to proceed further.</h1>
        </div>
      </div>
      

      {/* Popup Modal */}
        {isPopupOpen && (
         <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-brightness-50">
           <div className="bg-white p-6 rounded shadow-2xl w-200 h-150 overflow-x-hidden">
             
            <button 
              onClick={() => setIsPopupOpen(false)} 
              className="relative top-2 mx-180"
            >
              ✖
            </button>

            <div className="p-2">
              <h2 className="mb-5 text-gray-800 text-xl text-center font-bold font-[Open_Sans]">Please read the following carefully!</h2>
              <div>
                <ol className="list-decimal list-inside text-gray-800 space-y-2 ml-4">
                  <li>The duration of the examination is 180 minutes. The clock will be set on the server. The countdown timer at the top right-hand corner of your screen displays the time available for you to complete the examination.</li>
                  <li>When the timer reaches zero, the examination will end automatically. You will not be required to submit your examination.</li>
                  <li>A scientific calculator is available at the top-right-hand side of the screen.</li>
                  <li>The Question Palette displayed on the right-hand side of the screen shows the status of each question using one of the following symbols:</li>
                </ol>
              </div>
              
              <div className="flex flex-col space-y-2 p-4 border-2 border-gray-300 mt-3 rounded-md shadow-lg">
                {buttons.map((btn, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <button
                      className={`h-12 w-12 text-lg font-bold border-2 ${btn.color} flex items-center justify-center`}
                    >
                      {btn.text}
                      {btn.text === "5" && (
                        <span className="absolute bottom-0 right-0 bg-green-300 text-xs p-1 rounded-full">✔</span>
                      )}
                    </button>
                    <span className="text-gray-800 ">{btn.info}</span>
                  </div>
                ))}
              </div>


              <button 
                className="mt-4 bg-blue-200 border-blue-200 hover:bg-blue-100 border-2 h-10 w-50 m-2 mb-2 rounded-sm"
                onClick={() => onClickHandler("/testui")}
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Instructions;