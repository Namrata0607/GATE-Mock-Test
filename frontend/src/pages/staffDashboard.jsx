import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StaffDashboard() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]); // State to store branches
  const [selectedBranches, setSelectedBranches] = useState([]); // State for selected branches
  const [file, setFile] = useState(null); // State for the uploaded file
  const [error, setError] = useState(null); // State to handle errors

  // Fetch branches from the API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/branches");
        if (!response.ok) {
          throw new Error("Failed to fetch branches");
        }
        const data = await response.json();
        setBranches(data); // Set the fetched branches in state
      } catch (err) {
        console.error("Error fetching branches:", err.message);
        setError(err.message);
      }
    };

    fetchBranches();
  }, []);

  const handleCardClick = (branchName) => {
    navigate(`/set-marks/${branchName}`);
  };

  const handleBranchSelection = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedBranches(selected);
    console.log("Selected Branches:", selected); // Debug log
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    console.log("Selected File:", uploadedFile); // Debug log
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    if (selectedBranches.length === 0) {
      alert("Please select at least one branch.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("branches", JSON.stringify(selectedBranches)); // Send branches as JSON

    try {
      const response = await fetch("http://localhost:3000/api/staff/upload-questions", {
        method: "POST",
        body: formData, // Send file and branches
      });

      const data = await response.json();
      if (response.ok) {
        alert("File uploaded successfully!");
      } else {
        alert("File upload failed: " + data.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="dashboard-container items-center flex flex-col h-full w-full mb-20">
      <h1 className="text-gray-800 font-bold text-3xl text-center m-10 font-[sans]">
        Branches available
      </h1>
      <div className="cards-container grid grid-cols-3 gap-10">
        {branches.map((branch) => (
          <div
            key={branch._id}
            className="card border-5 border-blue-100 bg-blue-200 shadow-2xl rounded-xl flex flex-col items-center 
                    justify-center lg:h-45 lg:w-85 p-3 text-center transition-all duration-200 ease-in-out hover:scale-105"
            onClick={() => handleCardClick(branch.branchName)}
          >
            <p className="text-xl font-bold text-gray-800">{branch.branchName}</p>
            <p className="font-semibold text-gray-600 p-2">
              Proceed to set marks of each subject!
            </p>
          </div>
        ))}
      </div>
      <div className="upload-container mt-20 border-2 rounded-xl border-gray-300 bg-gray-50 px-10 py-10 h-auto w-220 flex flex-col items-center">
        <h1 className="text-gray-800 font-bold text-3xl text-center my-5 font-[sans]">
            Upload Questions
        </h1>

        {/* File input */}
        <input
            type="file"
            accept=".xlsx"
            className="border-2 border-gray-400 rounded-lg p-2 w-full mb-4"
            placeholder="Upload your file here"
            onChange={handleFileChange}
        />

        <p className="text-gray-500 mb-4 -mt-2">
            Upload file in only .xlsx file format!
        </p>

        {/* Checkbox group for branches */}
        <label className="text-gray-800 font-semibold mb-5 text-xl">
            Select Branches:
        </label>
        <div className="checkbox-group grid grid-cols-2 gap-4 w-full mb-4">
            {branches.map((branch) => (
            <div key={branch._id} className="flex items-center">
                <input
                type="checkbox"
                id={branch._id}
                value={branch.branchName}
                onChange={(e) => handleBranchSelection(e)}
                className="mr-2"
                />
                <label htmlFor={branch._id} className="text-gray-800">
                {branch.branchName}
                </label>
            </div>
            ))}
        </div>

        {/* Submit button */}
        <button
            onClick={handleFileUpload}
            className="w-70 text-lg font-semibold font-[sans] bg-white text-gray-800 p-2 rounded transition ease-in-out duration-400 border-3 border-blue-950  hover:bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 hover:text-white hover:border-blue-900"
        >
            Submit
        </button>
        </div>
    </div>
  );
}

export default StaffDashboard;