import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2"; // For the line graph
import "chart.js/auto"; // Required for Chart.js
import { fetchData } from '../utils/UserDetails';

function UserProfile() {

  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [testHistory, setTestHistory] = useState([]); 
  const [rankDetails, setRankDetails] = useState(null);
  const [showRankList, setShowRankList] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State to manage editing mode
  const [editableUserDetails, setEditableUserDetails] = useState({ // State for editable data
    name: "",
    email: "",
    branch: "", // Use 'branch' to store the branch ID
    mobile: "", // Add mobile to state
  });
  const [availableBranches, setAvailableBranches] = useState([]); // State to store branches for dropdown
  const [avgMarksData, setAvgMarksData] = useState(null); // holds avgMarks + attemptedTests
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
  const fetchUserData = async () => {
    try {
      const userData = await fetchData('http://localhost:3000/api/users/userdetails');
      console.log('Fetched User Details:', userData); // Debug log
      setUserDetails(userData);

      // Initialize editable details with fetched data, using branch ID
        setEditableUserDetails({
          name: userData.name || "",
          email: userData.email || "",
          branch: userData.branch?._id || "", // Use branch ID
          mobile: userData.mobile || "", // Initialize mobile
        });

        // Fetch Available Branches for dropdown
        const branchesResponse = await fetch("http://localhost:3000/api/branches");
        if (!branchesResponse.ok) {
          throw new Error("Failed to fetch branches for dropdown");
        }
        const branchesData = await branchesResponse.json();
        setAvailableBranches(branchesData);

    } catch (err) {
      console.error('Error fetching user details:', err.message);
      setError(err.message);
    }
  };

  fetchUserData();
  // alert("User details fetched successfully!");
}, []);

// Process userDetails when it changes
useEffect(() => {
  if (userDetails && userDetails.attemptedTests) {
    const tests = userDetails.attemptedTests.map((test, index) => ({
      testName: `Test ${index + 1}`,
      testId: test.testId,
      marks: test.totalTestMarks || 0,
      date: test.testDate ? new Date(test.testDate).toLocaleDateString() : new Date().toLocaleDateString(), // Human-readable date
      time: test.testDate ? new Date(test.testDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Human-readable time
      // status: test.status || "Completed", // Example additional key
    }));
    console.log('Test History:', tests); // Debug log
    setTestHistory(tests);
    // alert("Test history fetched successfully!");
  }

  // Dummy rank details
  // setRankDetails({
  //   rank: 5,
  //   totalUsers: 50,
  //   branch: "Computer Science",
  // });
}, [userDetails]);

useEffect(() => {
  const token = localStorage.getItem("userToken");
  const fetchRankDetails = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/test/branchRank/", {
        headers: {
          Authorization: `Bearer ${token}`, // pass token if required
        },
      });
      const data = await res.json();
      setRankDetails(data);
    } catch (error) {
      console.error("Error fetching rank details:", error);
    }
  };

  if (userDetails) {
    fetchRankDetails();
  }
}, [userDetails]);

  
 // Handle input changes in the edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUserDetails({
      ...editableUserDetails,
      [name]: value,
    });
  };

  // Toggle editing mode
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Handle saving changes
  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("userToken"); // Get the user token
      const response = await fetch("http://localhost:3000/api/users/editprofile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include the token
        },
        body: JSON.stringify(editableUserDetails), // Send the updated data (includes branch ID and mobile)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");
        // Update displayed details with response data, which now includes the updated user object
        setUserDetails(data.user); // Changed from data.updatedUser to data.user
        setIsEditing(false); // Exit editing mode
      } else {
        alert("Failed to update profile: " + data.message);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      alert("An error occurred while updating profile.");
    }
  };

  // Handle canceling edit
  const handleCancelClick = () => {
    // Reset editable details to current user details and exit editing mode
    setEditableUserDetails({
      name: userDetails.name || "",
      email: userDetails.email || "",
      branch: userDetails.branch?._id || "", // Reset to current branch ID
      mobile: userDetails.mobile || "", // Reset mobile
    });
    setIsEditing(false);
  };

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

  useEffect(() => {
    const fetchAvgMarks = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await fetch("http://localhost:3000/api/test/avgMarks/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {  
          setAvgMarksData(data);
        } else {
          setError("Failed to fetch avgMarks: " + data.message);
        }
      } catch (err) {
        console.error("Failed to fetch avgMarks:", err);
        setError("Error loading test data");
      }
    };

    fetchAvgMarks();
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!userDetails) return <p>Loading...</p>;

  return (
    <div className="flex flex-col lg:flex-row h-full w-full p-5 bg-gray-100">
      {/* Left Section: User Profile */}
      <div className="lg:h-150 h-full w-full lg:w-1/4 bg-white hover:bg-gray-100 shadow-md rounded-lg p-5 mb-5">
        {/* Conditionally render based on isEditing state */}
        {isEditing ? (
          // Edit Form
          <>
            <h2 className="text-center text-xl font-bold mb-4 font-[sans]">
              Edit Profile
            </h2>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editableUserDetails.name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={editableUserDetails.email}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              {" "}
              {/* Added margin-bottom */}
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="mobile"
              >
                Mobile: {/* Added Mobile Label */}
              </label>
              <input
                type="text" // Use text for mobile, add validation if needed
                id="mobile"
                name="mobile"
                value={editableUserDetails.mobile}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="branch"
              >
                Branch:
              </label>
              {/* Use a select dropdown for branches */}
              <select
                id="branch"
                name="branch" // Name should match the backend expectation (branch ID)
                value={editableUserDetails.branch} // Value is the selected branch ID
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select Branch</option> {/* Default option */}
                {availableBranches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSaveClick}
              className="mb-4 px-4 py-2 w-full text-lg font-semibold font-[sans] bg-white text-white rounded
            transition ease-in-out duration-400 border-3 bg-gradient-to-r
            from-blue-900 via-blue-800 to-blue-900 hover:text-gray-300 border-blue-900 cursor-pointer"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancelClick}
              className="px-4 py-2 w-full text-lg font-semibold font-[sans] bg-white text-gray-800 rounded
              transition ease-in-out duration-400 border-3 border-gray-500  hover:bg-gray-200 hover:text-gray-800 cursor-pointer"
            >
              Cancel
            </button>
          </>
        ) : (
          // Display Profile Details
          <>
            <h2 className="text-center text-xl font-bold font-[Sans]">
              Your Profile Details
            </h2>
            <img
              src="/Images/square-profile.png"
              alt="Profile"
              className="h-30 w-30 mx-auto mb-2 mt-5"
            />
            <h2 className="text-center text-xl font-bold text-gray-800">
              {userDetails.name}
            </h2>
            <div className="flex items-center justify-left text-gray-600 mt-2 ml-5">
              <img
                src="/Images/icon-email.png"
                alt="Email"
                className="h-5 w-5 mr-2"
              />
              <p>{userDetails.email}</p>
            </div>
            <div className="flex items-center justify-left text-gray-600 mt-2 ml-5">
              <img
                src="/Images/icon-phone-call.png"
                alt="Phone"
                className="h-5 w-5 mr-2"
              />
              <p>{userDetails.mobile}</p>
            </div>
            <div className="flex items-center justify-left text-gray-600 mt-2 ml-5">
              <img
                src="/Images/icon-college.png"
                alt="Branch"
                className="h-5 w-5 mr-2"
              />
              <p>{userDetails.branchName}</p>
            </div>
            <div className="flex flex-col items-center mt-4">
              <button
                onClick={handleEditClick}
                className="mb-4 px-4 py-2 w-60 h-10 text-lg font-semibold font-[sans] text-white text-center rounded
              transition ease-in-out duration-400 border-3 bg-gradient-to-r
              from-blue-900 via-blue-800 to-blue-900 hover:text-gray-300 border-blue-900 cursor-pointer flex items-center justify-center"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 w-60 h-10 text-lg font-semibold font-[sans] text-white text-center rounded
              transition ease-in-out duration-400 border-3 bg-gradient-to-r
              from-blue-900 via-blue-800 to-blue-900 hover:text-gray-300 border-blue-900 cursor-pointer flex items-center justify-center"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-3/4 flex flex-col gap-5 lg:pl-5">

        {/* Row: Test Performance and Rank Comparison */}
        <div className="flex flex-col lg:flex-row gap-5 ">
          {/* Test Performance Section */}
          <div className="w-full lg:w-1/2 bg-white hover:bg-gray-100 shadow-md rounded-lg p-5">
            <h2 className="mb-4 text-center text-xl font-bold font-[Sans]">
              Test Performance
            </h2>
            <div className="h-75 w-full">
              {/* Graph */}
              <Line data={lineGraphData} />

              {/* Avg Marks Info */}
              <div className="mt-5 flex flex-col items-center text-base font-bold text-gray-800 bg-blue-100 py-2 rounded">
                {error ? (
                  <p className="text-red-500">{error}Failed to fetch avg marks...</p>
                ) : avgMarksData ? (
                  <div  className="flex flex-row justify-between gap-20 items-center">
                    <p>Total Attempted Tests: <span className="text-gray-800 font-bold">{avgMarksData.attemptedTestsCount}</span></p>
                    <p>Average Marks: <span className="text-gray-800 font-bold">{avgMarksData.avgMarks}</span></p>
                  </div>
                ) : (
                  <p>Loading avg marks...</p>
                )}
              </div>
            </div>

          </div>

          {/* Rank Comparison Section */}
          <div className="w-full lg:w-1/2 bg-white hover:bg-gray-100 shadow-md rounded-lg p-5">
            <h2 className="mb-4 text-center text-xl font-bold font-[Sans]">
              Your Rank
            </h2>

            {rankDetails ? (
              <div className="flex flex-col items-center">
                {/* Display crown or number */}
                {rankDetails.userRank <= 3 ? (
                  <img
                    src={`/Images/winnerBadge-${rankDetails.userRank}.png`} // crown1.png, crown2.png...
                    alt={`Rank ${rankDetails.userRank}`}
                    className="w-35 h-35 mb-2"
                  />
                ) : (
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {rankDetails.userRank}
                  </div>
                )}

                {/* <p className="text-gray-600 mb-2">
                Branch: {rankDetails.currentUser.branch || "N/A"}
              </p> */}

                <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{
                      width: `${
                        ((rankDetails.rankList.length -
                          rankDetails.userRank +
                          1) /
                          rankDetails.rankList.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>

                {/* Toggle Button for Rank List */}
                <button
                  onClick={() => setShowRankList(!showRankList)}
                  className="mt-4 px-3 py-1 lg:w-45 text-sm lg:text-lg font-semibold font-[sans] bg-white p-2 
                        rounded transition ease-in-out duration-400 border-3 bg-gradient-to-r from-blue-900 
                        via-blue-800 to-blue-900 text-white border-blue-900 cursor:pointer hover:text-gray-300"
                >
                  {showRankList ? "Hide Rank List" : "View Rank List"}
                </button>

                {/* Rank List */}
                {showRankList && (
                  <div className="w-full mt-4">
                    <h3 className="text-center font-semibold mb-2 font-[Sans]">
                      Rank List
                    </h3>
                    <ul className="space-y-1">
                      {rankDetails.rankList.map((item, index) => (
                        <li
                          key={index}
                          className={`flex justify-between px-4 py-2 rounded ${
                            item.name === rankDetails.currentUser.name
                              ? "bg-blue-100 font-bold"
                              : "bg-gray-100"
                          }`}
                        >
                          <span>{item.name}</span>
                          <span>Rank {item.rank}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p>Loading rank details...</p>
            )}
          </div>
        </div>

        {/* Test History Table */}
        <div className="bg-white hover:bg-gray-100 shadow-md rounded-lg p-5 pb-25">
          <h2 className="mb-4 text-center text-xl font-bold font-[Sans]">
            Test History
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b-2 p-2 text-left">Test Name</th>
                <th className="border-b-2 p-2 text-left">Date</th>
                <th className="border-b-2 p-2 text-left">Time</th>
                <th className="border-b-2 p-2 text-left">Marks</th>
                <th className="border-b-2 p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Latest test history in reverse order */}
              {testHistory
                .slice()
                .reverse()
                .map((test, index) => (
                  <tr key={index}>
                    <td className="border-b p-2">{test.testName}</td>
                    <td className="border-b p-2">{test.date}</td>
                    <td className="border-b p-2">{test.time}</td>
                    <td className="border-b p-2">{test.marks}</td>
                    <td className="border-b p-2">
                      <button
                        onClick={() => navigate(`/test-details/${test.testId}`)}
                        className="px-3 py-1 lg:w-45 text-sm lg:text-lg font-semibold font-[sans] bg-white p-2 
                        rounded transition ease-in-out duration-400 border-3 bg-gradient-to-r from-blue-900 
                        via-blue-800 to-blue-900 text-white border-blue-900 cursor:pointer hover:text-gray-300"
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