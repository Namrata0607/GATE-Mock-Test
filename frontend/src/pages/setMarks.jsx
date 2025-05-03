import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

function SetMarks() {
  const { branchId } = useParams(); // Get the branch name from the URL
  const [subjects, setSubjects] = useState([]); // State to store subjects
  const [marks, setMarks] = useState({}); // State to store updated marks for each subject

  const fetchSubjects = useCallback(async () => {
    try {
      console.log("Fetching subjects..."); // Debug log

      const token = localStorage.getItem("staffToken");
      console.log("Token from localStorage:", token); // Debug log

      const response = await fetch(
        `http://localhost:3000/api/staff/getSubjectsByBranch/${branchId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }

      const data = await response.json();
      setSubjects(data.subjects); // Set subjects with current marks
    } catch (error) {
      console.error("Error fetching subjects:", error.message);
    }
  }, [branchId]); // Add branchId as a dependency

  useEffect(() => {
    fetchSubjects(); // Call fetchSubjects to fetch data on component mount
  }, [fetchSubjects]); // Add fetchSubjects to the dependency array

  const handleMarksChange = (subjectId, value) => {
    console.log(`Updating marks for subject ${subjectId} with value: ${value}`); // Debug log
    setMarks({ ...marks, [subjectId]: value }); // Update marks for the subject
  };

  const handleSetMarks = async (branchId, marks) => {
    try {
      console.log("Branch ID:", branchId); // Debug log
      console.log("Marks Object:", marks); // Debug log

      const token = localStorage.getItem("staffToken"); // Retrieve the token from localStorage
      console.log("Token from localStorage:", token);

      const response = await fetch(
        `http://localhost:3000/api/staff/setMarks/${branchId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
          body: JSON.stringify({ marks }), // Send the marks object in the request body
        }
      );

      const data = await response.json();
      console.log("Response Data:", data); // Debug log

      if (response.ok) {
        alert("Marks updated successfully!");
        fetchSubjects(); // Refresh the subjects to show updated marks
      } else {
        console.error("Error response from server:", data);
        alert("Failed to update marks: " + data.msg);
      }
    } catch (error) {
      console.error("Error updating marks:", error);
      alert("An error occurred while updating marks.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Set Marks for {branchId} Branch
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent the default form submission behavior
          handleSetMarks(branchId, marks); // Pass branchId and marks to the function
        }}
        className="w-full max-w-4xl"
      >
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Subject
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Current Marks
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Update Marks
              </th>
            </tr>
          </thead>
          <tbody>
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <tr key={subject._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {subject.subjectName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {subject.subjectMarks || "0"} {/* Display current marks */}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      placeholder="Enter marks"
                      value={marks[subject._id] || ""}
                      onChange={(e) =>
                        handleMarksChange(subject._id, e.target.value)
                      }
                      className="border border-gray-300 rounded p-2 w-full"
                      required
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No subjects found for this branch.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="flex hover:bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-2 border-blue-900 hover:text-white text-gray-800 font-semibold px-6 py-2 rounded justify-center items-center hover:bg-white transition duration-300 ease-in-out align-center"
          >
            Save Marks
          </button>
        </div>
      </form>
    </div>
  );
}

export default SetMarks;