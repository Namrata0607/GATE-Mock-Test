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
      <div className="flex items-center justify-center min-h-screen">
        <div className=" shadow-2xl p-8 rounded-lg w-96 mt-0">
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
            {isSignup ? "Signup" : "Login"} to GATE Mock Test
          </h2>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                <input type="text" name="branch" placeholder="Branch" value={formData.branch} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                <input type="tel" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
              </>
            )}
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
            {isSignup && (
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
            )}
            <button type="submit" className="w-full bg-blue-200  text-gray-800 p-2 rounded hover:bg-gray-100 transition border-2 border-blue-300">{isSignup ? "Sign Up" : "Log In"}</button>
          </form>
  
          <p className="text-center text-gray-600 mt-4">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignup(!isSignup)} className="text-gray-800 hover:underline">{isSignup ? "Login" : "Signup"}</button>
          </p>
        </div>
      </div>
    );
}

export default ULoginSignup;