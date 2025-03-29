import React from 'react'
import '../App.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

function Instructions() {
  const [isChecked, setIsChecked] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const buttons = [
    { text: "1", color: "bg-gray-200 border-gray-400 text-black rounded-md", info: "You have NOT visited the question yet." },
    { text: "2", color: "bg-red-500 border-red-700 text-white rounded-b-lg rounded-t-none", info: "You have NOT answered the question yet." },
    { text: "3", color: "bg-green-500 border-green-700 text-white rounded-t-lg rounded-b-none", info: "You have answered the question.This will be evaluated." },
    { text: "4", color: "bg-purple-500 border-purple-700 text-white rounded-full", info: "You have NOT answered the question but marked it for review." },
    { text: "5", color: "bg-purple-500 border-purple-700 text-white rounded-full relative", info: "You have answered the question and marked it for review.This will also be evaluated." },
  ];

  // const [userName, setUserName] = useState("");

  // useEffect(() => {

  //   fetch("http://localhost:3000/api/users")
  //   .then(response => {
  //     console.log("Raw Response:", response);
  //     return response.json(); // Convert to JSON
  //   })
  //   .then(data => {
  //     console.log("User Data:", data); // Debugging
  //     setUserName(data.name);
  //   })
  //   .catch(error => console.error("Error fetching user data:", error));
  
  // }, []);
  
  const navigate = useNavigate();
  const onClickHandler = () => {
    navigate("/testui");
  };

  const handleLogout = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/users/logout/", {
            method: "POST",
            credentials: "include", // Ensure cookies are included
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            localStorage.removeItem("token"); // Clear token from storage
            window.location.href = "/"; // Redirect to login page
        } else {
            alert("Logout failed: " + data.message);
        }
    } catch (error) {
        console.error("Logout error:", error);
    }
};

  return (
    <div>
      <div className='container text-right pr-2 mx-auto'>
        {/* <h2>Welcome User! See your test details here.</h2> */}
        <button onClick={handleLogout} 
        className='relative top-2  border-2 h-10 w-50 m-2 mb-2 rounded-sm bg-blue-200 border-blue-200 hover:bg-blue-100'>
          Log Out
        </button>
      </div>
      <div className='container text-center border-2 border-gray-300 w-250 mx-auto h-100'>
        <h1>Test Attempted details</h1>
        <p className="text-lg font-semibold">Welcome!</p>
        {/* <p>{localStorage.getItem('username')}</p> */}
      </div>
      <div className='container text-center border-2 border-gray-300 p-4 m-4 w-250 mx-auto h-150 relative'>
        <h1 className='text-gray-800 text-3xl font-bold font-[Open_Sans]'>Instructions</h1>
        <div className='h-70 mt-2 p-4 text-left flex-col'>
    
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
        <div className='absolute bottom-4 right-4'>
          <input
          type="checkbox"
          className="h-5 w-5 m-2"
          onChange={(e) => setIsChecked(e.target.checked)}
          />
          <button onClick={() => setIsPopupOpen(true)}
        className={`border-2 h-10 w-50 m-2 mb-2 rounded-sm ${
          isChecked
            ? "bg-blue-200 border-blue-200 hover:bg-blue-100"
            : "bg-gray-300 border-gray-300 cursor-not-allowed"
        }`}
        disabled={!isChecked}
      >I Agree and Proceed</button>
      <h1 className='text-gray-600 text-sm'>Please mark the check box to proceed further.</h1>
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