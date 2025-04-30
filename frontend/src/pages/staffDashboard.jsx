import React from "react";
import { useNavigate } from "react-router-dom";
// import "./staffDashboard.css"; // Assuming you will style the cards in this CSS file

function StaffDashboard() {

    const navigate = useNavigate();

    const branches = [
        { branch: "Computer Science" },
        { branch: "Data Science" },
        { branch: "Artificial Intelligence and Machine Learning" },
        { branch: "Electronics and Telecommunication" },
        { branch: "Civil Engineering" },
        { branch: "Mechanical Engineering" },
    ];

    const handleCardClick = (branch) => {   
        navigate(`/set-marks/${branch._id}`);
    }

return (
    <div className="dashboard-container items-center flex flex-col h-full w-full mb-20">
        <h1 className="text-gray-800 font-bold text-3xl text-center m-10 font-[sans]">Branches available</h1>
        <div className="cards-container grid grid-cols-3 gap-10">
            {branches.map((branch, index) => (
                <div 
                    key={index}
                    className="card border-5 border-blue-100 bg-blue-200 shadow-2xl rounded-xl flex flex-col items-center 
                    justify-center lg:h-45 lg:w-85 p-3 text-center transition-all duration-200 ease-in-out hover:scale-105"
                    onClick={() => handleCardClick(branch.branch)}
                >
                    <p className="text-xl font-bold text-gray-800">{branch.branch}</p>
                    <p className="font-semibold text-gray-600 p-2">Proceed to set marks of each subject!</p>

                </div>
            ))}
        </div>
        <div className="upload-container mt-20 border-2 rounded-xl border-gray-400 px-10 py-10 h-80 w-220 flex flex-col items-center">
            <h1 className="text-gray-800 font-bold text-3xl text-center my-5 font-[sans]">Upload Questions</h1> 
            <input
                type="file"
                accept=".xlsx"
                className="border-2 border-blue-500 rounded-lg p-2"
                placeholder="Upload your file here"
            />
            <p className="text-gray-600 mt-3 text-center">Upload file in only .xlsx file format!</p>
        </div>
    </div>
);
}

export default StaffDashboard;