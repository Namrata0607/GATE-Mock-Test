import React from 'react'
import '../App.css'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

function Instructions() {
  const [isChecked, setIsChecked] = useState(false);
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
            window.location.href = "/login"; // Redirect to login page
        } else {
            alert("Logout failed: " + data.message);
        }
    } catch (error) {
        console.error("Logout error:", error);
    }
};

  return (
    <div>
      <button onClick={handleLogout} className='mr border-2 h-10 w-50 m-2 mb-2 rounded-sm bg-blue-200 border-blue-200 hover:bg-blue-100'>Log Out</button>
      <div className='container text-center border-2 border-black p-4 m-4 w-350 mx-auto h-90'>
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
              <li>Unanswered questions won’t be scored.</li>
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
          <button onClick={onClickHandler}
        className={`border-2 h-10 w-50 m-2 mb-2 rounded-sm ${
          isChecked
            ? "bg-blue-200 border-blue-200 hover:bg-blue-100"
            : "bg-gray-300 border-gray-300 cursor-not-allowed"
        }`}
        disabled={!isChecked}
      >I Agree and Proceed</button>
      <h1 className='text-gray-600'>Please check ckeck box to proceed further</h1>
        </div>
      </div>
    </div>
  );
}

export default Instructions;