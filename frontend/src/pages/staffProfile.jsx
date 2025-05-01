import React, { useEffect, useState } from "react";

function StaffProfile() {

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [staffDetails, setStaffDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      try {
        const token = localStorage.getItem("staffToken");
        if (!token) {
          throw new Error("No token found. Please log in again.");
        }

        const response = await fetch("http://localhost:3000/api/staff/getUploadedFiles", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch uploaded files");
        }

        const data = await response.json();
        setUploadedFiles(data); // Set the uploaded files in state
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUploadedFiles();
  }, []);

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const token = localStorage.getItem("staffToken"); // Retrieve token from localStorage 
        console.log("Staff Token:", token); // Debug log

        if (!token) {
          throw new Error("No token found. Please log in again.");
        }

        const response = await fetch("http://localhost:3000/api/staff/getStaffDetails", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch staff details");
        }

        const data = await response.json();
        setStaffDetails(data); // Set staff details in state
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStaffDetails();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("staffToken"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch("http://localhost:3000/api/staff/staffLogout", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
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
            window.location.href = "/staffLogin"; // Redirect to login page
          } else {
            alert("Logout failed: " + data.message);
          }
        } catch (error) {
          console.error("Logout error:", error);
        }
    };

  
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!staffDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* <h1>Staff Profile</h1> */}
        <div className="flex flex-row items-center justify-center h-screen">   
            <div className="m-2 w-1/4 border-2 h-120 justify-left rounded-lg p-4">
                <h1 className="text-4xl font-bold mb-4">Staff Profile</h1>
                    <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
                    <p><strong>Name:</strong> {staffDetails.name}</p>
                    <p><strong>Email:</strong> {staffDetails.email}</p>
                    <button onClick={handleLogout}
                    className="relative border-2 border-blue-950 h-8 w-28 rounded-sm bg-white bg-border-blue-950 hover:bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 hover:text-white 
                    font-[Sans] font-semibold md:text-lg md:w-30 md:h-9 lg:h-10 lg:w-32 ease-in-out duration-400"
                    >
                      Logout
                    </button>
            </div>
            <div className="flex flex-row justify-center items-center border-2 rounded-lg h-120 w-1/4">
                <div className="mb-6">
                <h2 className="text-2xl font-semibold">Uploaded Files</h2>
                {uploadedFiles.length === 0 ? (
                  <p>No files uploaded yet.</p>
                ) : (
                  <ul>
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="mb-2">
                        <strong>File:</strong> {file.fileName} <br />
                        <strong>Uploaded On:</strong> {new Date(file.uploadedAt).toLocaleDateString()} <br />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
        </div>
    </div>
  );
}

export default StaffProfile;