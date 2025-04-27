// SectionTabs.jsx
import React from "react";

const SectionTabs = ({ currentSection, setCurrentSection }) => {
return (
    <div className="flex justify-left space-x-2 mb-4 top-0 left-0">
      <button
        onClick={() => setCurrentSection("Aptitude")}
        className={`px-2 py-0 rounded text-sm font-[sans] font-semibold ${
          currentSection === "Aptitude"
            ? "bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-white transition duration-200 ease-in-out"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        General Aptitude
      </button>
      <button   
        onClick={() => setCurrentSection("Technical")}
        className={`px-2 py-2 rounded text-sm font-[sans] font-semibold ${
          currentSection === "Technical"
            ? "bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-white transition duration-200 ease-in-out"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        Technical
      </button>
    </div>
  );
};

export default SectionTabs;
