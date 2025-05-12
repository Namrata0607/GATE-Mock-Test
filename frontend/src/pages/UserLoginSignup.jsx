import React from 'react'
import { useState, useEffect } from "react";
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
    const [branches, setBranches] = useState([]); // State to store branches

    const navigate = useNavigate();

    useEffect(() => {
      // Fetch branches from the backend
      const fetchBranches = async () => {
          try {
              const response = await fetch("http://localhost:3000/api/branches");
              if (!response.ok) {
                  throw new Error("Failed to fetch branches");
              }
              const data = await response.json();
              // console.log("Fetched Branches:", data); // Debug log
              setBranches(data); // Set branches in state
          } catch (error) {
              console.error("Error fetching branches:", error.message);
          }
      };

      fetchBranches();
  }, []);
  
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
        // console.log("Raw Response:", text);
        
        const data = JSON.parse(text);
  
        if (response.ok && data.token) {
            if (data.role === "user") {
              localStorage.setItem("userToken", data.token);
              localStorage.setItem("userName", data.user.name);
            } else if (data.role === "staff") {
              localStorage.setItem("staffToken", data.token);
              localStorage.setItem("staffName", data.staff.name);
            }
          
            if (isSignup) {
              alert("Welcome " + data.user.name + " !!! You have successfully signed up.");
              setIsSignup(false);
              navigate("/uloginsignup"); // Redirect to user login page
            } else {
              alert("Welcome " + data.user.name + " !!! You are now logged in.");
              navigate("/userDashboard"); // Redirect to user dashboard
            }
        } else {
          alert(data.message );
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        alert("Error connecting to the server. Check console.");
      }
    };
  
    return (
      <div className='flex flex-col items-center justify-center lg:flex-row lg:justify-between lg:items-center lg:mt-10 lg:mr-10 lg:mb-10'>
        <div className="flex items-center justify-center md:justify-left mt-0 mb-20 md:mt-0 min-h-screen lg:ml-10 lg:-mt-20">
          <div className="border-2 border-gray-200 shadow-xl px-12 py-10 rounded-sm w-full mx-5 md:w-2/3 lg:w-2/3">
            <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
              {isSignup ? "Signup" : "Login"} For Mock Tests
            </h2>
    
            <form onSubmit={handleSubmit} className="space-y-4 lg:px-10">
              {isSignup && (
                <>
                  <input type="text" name="name" placeholder="Enter Full Name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded hover:border-gray-500" required />
                  {/* console.log("Branches State:", branches); // Debug log */}
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded hover:border-gray-500"
                    required
                  >
                  <option value="" disabled className="text-red-500">
                    Select Branch
                  </option>
                  {branches.map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.branchName}
                    </option>
                    
                  ))}
                  </select>
                  <input type="tel" name="mobile" placeholder="Enter Mobile Number" value={formData.mobile} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded hover:border-gray-500" required />
                </>
              )}
              <input type="email" name="email" placeholder="Enter Email Address" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded hover:border-gray-500" required />
              <input type="password" name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded hover:border-gray-500" required />
              {isSignup && (
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded hover:border-gray-500" required />
              )}
              <button type="submit" className="w-full text-lg font-semibold font-[sans] bg-white text-gray-800 p-2 rounded transition ease-in-out duration-400 border-3 border-blue-950  hover:bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 hover:text-white hover:border-blue-900">{isSignup ? "Sign Up" : "Log In"}</button>
            </form>
    
            <p className="text-center text-gray-600 mt-4">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button onClick={() => setIsSignup(!isSignup)} className="text-gray-800 hover:underline">{isSignup ? "Login" : "Signup"}</button>
            </p>
          </div>
        </div>
        <div className='flex items-center justify-center mb-18 -mt-20 md:-mt-20 md:mb-20'>
          <img src="/Images/login-img.png" alt="GATE_2025" className="h-100 md:h-150 md:w-150 object-cover" />
        </div>
      </div>
    );
}

export default ULoginSignup;