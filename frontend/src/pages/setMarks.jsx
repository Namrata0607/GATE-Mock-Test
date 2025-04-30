import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function SetMarks() {
  const { branchId } = useParams(); // Get the branch name from the URL
  const [subjects, setSubjects] = useState([]); // State to store subjects
  const [marks, setMarks] = useState({}); // State to store marks for each subject

  useEffect(() => {
    // Fetch subjects for the selected branch from the backend
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/staff/getSubjectsByBranch/${branchId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch subjects");
        }
        const data = await response.json();
        setSubjects(data.subjects); // Set subjects in state
      } catch (error) {
        console.error("Error fetching subjects:", error.message);
      }
    };

    fetchSubjects();
  }, [branchId]);

  useEffect(() => {
    console.log("Subjects state updated:", subjects); // Debug log
  }, [subjects]);

  const handleMarksChange = (subjectId, value) => {
    setMarks({ ...marks, [subjectId]: value }); // Update marks for the subject
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/marks/${branchId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ marks }),
      });

      if (response.ok) {
        alert("Marks updated successfully!");
      } else {
        alert("Failed to update marks");
      }
    } catch (error) {
      console.error("Error updating marks:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Set Marks for {branchId} Branch
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-4xl">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Subject</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Marks</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length > 0 ? (
                subjects.map((subject) => (
                <tr key={subject._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{subject.subjectName}</td>
                    <td className="border border-gray-300 px-4 py-2">
                    <input
                        type="number"
                        placeholder="Enter marks"
                        value={marks[subject._id] || ""}
                        onChange={(e) => handleMarksChange(subject._id, e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        required
                    />
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="2" className="text-center py-4 text-gray-500">
                    No subjects found for this branch.
                </td>
                </tr>
            )}
        </tbody>
        </table>
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Save Marks
          </button>
        </div>
      </form>
    </div>
  );
}

export default SetMarks;