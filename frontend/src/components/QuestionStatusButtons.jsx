import React from "react";

const statusStyles = {
  notVisited: "bg-gray-300 border border-gray-400 text-black rounded-md",
  notAnswered: "bg-red-500 border border-red-700 text-white rounded-b-lg rounded-t-none",
  answered: "bg-green-500 border border-green-700 text-white rounded-t-lg rounded-b-none",
  marked: "bg-purple-500 border border-purple-700 text-white rounded-full",
  answeredMarked: "bg-purple-500 border border-purple-700 text-white rounded-full relative",
};

const QuestionButton = ({ number, onClick , status}) => {
  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 m-1 font-bold flex items-center justify-center ${statusStyles[status]}`}
      title={`Question ${number}`}
    >
      {number}
      {status === "answeredMarked" && (
        <span className="absolute -bottom-1 -right-1 text-xs bg-green-300 text-black px-1 rounded-full">
          ✔
        </span>
      )}
    </button>
  );
};

export default QuestionButton;
