import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ULoginSignup() {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      branch: "",
      mobile: "",
      attemptedTests: "",
    });

    const navigate = useNavigate();
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (isSignup && formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
  
      const apiUrl = isSignup 
      ? "http://localhost:3000/api/users/signup/" 
      : "http://localhost:3000/api/users/signin/";
  
      const requestData = isSignup
      ? {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        branch: formData.branch,
        mobile: formData.mobile,
        attemptedTests: formData.attemptedTests,
      }
      : {
        email: formData.email,
        password: formData.password,
      };
  
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify(requestData),
        });
  
        const text = await response.text();  // Read raw response
        console.log("Raw Response:", text);
        
        const data = JSON.parse(text);
  
        if (response.ok) {
          // Save the token to localStorage
          localStorage.setItem("authToken", data.token);
          // localStorage.setItem("userName", data.user.name); // Store the username

          alert("Welcome "+ data.user.name + " !!! You are now logged in.");
          if (isSignup) {
            setIsSignup(false);
          } else {
            navigate("/instructions");
          }
        } else {
          alert(data.error || "Something went wrong");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        alert("Error connecting to the server. Check console.");
      }
    };
  
    return (
      <>
        <div className="flex items-center justify-left min-h-screen ml-50 w-1/2 top-0">
          <div className="border-2 border-gray-200 shadow-2xl px-17 py-10 rounded-sm w-100 mt-0">
            <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
              {isSignup ? "Signup" : "Login"} For Mock Tests
            </h2>
    
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <>
                  <input type="text" name="name" placeholder="Enter Full Name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded hover:border-gray-500" required />
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded hover:border-gray-500"
                    required
                  >
                    <option value="" disabled className='text-gray-500'>Select Branch</option>
                    <option value="CSE">Computer Science (CSE)</option>
                    <option value="IT">Information Technology (IT)</option>
                    <option value="ECE">Electronics and Communication (ECE)</option>
                    <option value="EEE">Electrical and Electronics (EEE)</option>
                    <option value="ME">Mechanical Engineering (ME)</option>
                    <option value="CE">Civil Engineering (CE)</option>
                    {/* Add more branches as needed */}
                  </select>
                  <input type="tel" name="mobile" placeholder="Enter Mobile Number" value={formData.mobile} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded hover:border-gray-500" required />
                </>
              )}
              <input type="email" name="email" placeholder="Enter Email Address" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded hover:border-gray-500" required />
              <input type="password" name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded hover:border-gray-500" required />
              {isSignup && (
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded hover:border-gray-500" required />
              )}
              <button type="submit" className="w-full bg-blue-200  text-gray-800 p-2 rounded hover:bg-blue-100 transition border-2 border-blue-300">{isSignup ? "Sign Up" : "Log In"}</button>
            </form>
    
            <p className="text-center text-gray-600 mt-4">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button onClick={() => setIsSignup(!isSignup)} className="text-gray-800 hover:underline">{isSignup ? "Login" : "Signup"}</button>
            </p>
          </div>
        </div>
        <div>
          <img src="/Images/login.png" alt="GATE_2025" className="absolute top-25 right-0 w-1/2 h-auto object-cover" />
        </div>
      </>
    );
}

export default ULoginSignup;