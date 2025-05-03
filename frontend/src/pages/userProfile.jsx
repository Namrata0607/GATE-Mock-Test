import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2"; // For the line graph
import "chart.js/auto"; // Required for Chart.js
import { fetchData } from '../utils/UserDetails';

function UserProfile() {

  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [testHistory, setTestHistory] = useState([]); // Dummy test data
  const [rankDetails, setRankDetails] = useState(null); // Dummy rank data
  const navigate = useNavigate();

const handleLogout = async () => {
    try {
      // Call the backend logout route
      const response = await fetch("http://localhost:3000/api/users/logout/", {
        method: "POST",
        credentials: "include", // Ensure cookies are included
      });
      
      const data = await response.json();
      
        if (response.ok) {
          alert(data.message);
          
          const role = localStorage.getItem("userToken") ? "user" : "staff";
            if (role === "user") {
              localStorage.removeItem("userToken");
              localStorage.removeItem("userName");
            } else if (role === "staff") {
              localStorage.removeItem("staffToken");
              localStorage.removeItem("staffName");
            }
            window.location.href = "/"; // Redirect to login page
          } else {
            alert("Logout failed: " + data.message);
          }
        } catch (error) {
          console.error("Logout error:", error);
        }
      };
  
  // Fetch user details
  useEffect(() => {

    // Fetch user data from API
    const fetchUserData = async () => {
      try {
          const data = await fetchData('http://localhost:3000/api/users/userdetails');
          console.log('Fetched User Details:', data); // Debug log
          setUserDetails(data);
      } catch (err) {
          console.error('Error fetching user details:', err.message);
          setError(err.message);
      }
  };
      
          fetchUserData();

    // Dummy test history data
    setTestHistory([
      { testName: "Test 1", marks: 70, date: "2025-04-01" },
      { testName: "Test 2", marks: 85, date: "2025-04-15" },
      { testName: "Test 3", marks: 60, date: "2025-04-30" },
    ]);

    // Dummy rank details
    setRankDetails({
      rank: 5,
      totalUsers: 50,
      branch: "Computer Science",
    });
  }, []);

  // Line graph data
  const lineGraphData = {
    labels: testHistory.map((test) => test.testName), // X-axis: Test names
    datasets: [
      {
        label: "Marks",
        data: testHistory.map((test) => test.marks), // Y-axis: Marks
        borderColor: "black",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        pointBackgroundColor: "black",
        pointBorderColor: "black",
        tension: 0.4, // Smooth curve
      },
    ],
  };

  if (error) return <p>Error: {error}</p>;
  if (!userDetails) return <p>Loading...</p>;


  return (
    <div className="flex flex-col lg:flex-row h-full w-full p-5 bg-gray-100">
      {/* Left Section: User Profile */}
      <div className="w-full lg:w-1/4 bg-white shadow-md rounded-lg p-5">
        {userDetails ? (
          <>
            <img
              src="/Images/default-profile.png"
              alt="Profile"
              className="h-24 w-24 rounded-full mx-auto mb-4"
            />
            <h2 className="text-center text-xl font-bold">{userDetails.name}</h2>
            <p className="text-center text-gray-600">{userDetails.branchName}</p>
            <p className="text-center text-gray-600">{userDetails.email}</p>
            <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg w-full">
              Edit Profile
            </button>
            <button onClick={handleLogout} className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg w-full">
              Logout
            </button>
          </>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-3/4 flex flex-col gap-5 lg:pl-5">
        {/* Row: Test Performance and Rank Comparison */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Test Performance Section */}
          <div className="w-full lg:w-1/2 bg-white shadow-md rounded-lg p-5">
            <h2 className="text-xl font-bold mb-4">Test Performance</h2>
            <div className="h-48">
              <Line data={lineGraphData} />
            </div>
          </div>

          {/* Rank Comparison Section */}
          <div className="w-full lg:w-1/2 bg-white shadow-md rounded-lg p-5">
            <h2 className="text-xl font-bold mb-4">Rank Comparison</h2>
            {rankDetails ? (
              <div className="flex flex-col items-center">
                <p className="text-2xl font-bold">
                  Rank: {rankDetails.rank} / {rankDetails.totalUsers}
                </p>
                <p className="text-gray-600">Branch: {rankDetails.branch}</p>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{
                      width: `${(rankDetails.rank / rankDetails.totalUsers) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ) : (
              <p>Loading rank details...</p>
            )}
          </div>
        </div>

        {/* Test History Table */}
        <div className="bg-white shadow-md rounded-lg p-5">
          <h2 className="text-xl font-bold mb-4">Test History</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b-2 p-2 text-left">Test Name</th>
                <th className="border-b-2 p-2 text-left">Date</th>
                <th className="border-b-2 p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testHistory.map((test, index) => (
                <tr key={index}>
                  <td className="border-b p-2">{test.testName}</td>
                  <td className="border-b p-2">{test.date}</td>
                  <td className="border-b p-2">
                    <button
                      onClick={() => navigate(`/test-details/${test.testName}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;