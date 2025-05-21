// QuestionStatusButtons.jsx
import React from "react";

const statusStyles = {
  notVisited: {
    class: "bg-gray-200 border-gray-400 text-black rounded-md",
    info: "You have NOT visited the question yet.",
  },
  notAnswered: {
    class: "bg-red-500 border-red-700 text-white rounded-b-lg rounded-t-none",
    info: "You have NOT answered the question yet.",
  },
  answered: {
    class: "bg-green-500 border-green-700 text-white rounded-t-lg rounded-b-none",
    info: "You have answered the question. This will be evaluated.",
  },
  marked: {
    class: "bg-purple-500 border-purple-700 text-white rounded-full",
    info: "You have NOT answered the question but marked it for review.",
  },
  answeredMarked: {
    class: "bg-purple-700 border-purple-900 text-white rounded-full relative",
    info: "You have answered the question and marked it for review. This will also be evaluated.",
  },
};

const QuestionStatusButtons = ({ number, status, onClick }) => {
  const style = statusStyles[status] || statusStyles.notVisited;

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-12 h-12 border-2 font-bold flex items-center justify-center ${style.class}`}
        title={`Question ${number}`}
      >
        {number}
        {status === "answeredMarked" && (
          <span className="absolute -bottom-1 -right-1 text-xs bg-green-300 text-black px-1 rounded-full">
            ✔
          </span>
        )}
      </button>
      {/* Tooltip */}
      <div className="absolute z-10 hidden group-hover:block bg-black text-white text-xs rounded-md px-2 py-1 w-52 top-14 left-1/2 transform -translate-x-1/2">
        {style.info}
      </div>
    </div>
  );
};

export default QuestionStatusButtons;
