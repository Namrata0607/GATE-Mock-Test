// SectionTabs.jsx
import React from "react";

const SectionTabs = ({ currentSection, setCurrentSection }) => {
return (
    <div className="flex justify-left space-x-2 mb-4 top-0 left-0">
      <button
        onClick={() => setCurrentSection("Aptitude")}
        className={`px-4 py-2 rounded ${
          currentSection === "Aptitude"
            ? "bg-blue-200 text-black border border-blue-300"
            : "bg-gray-200 text-black"
        }`}
      >
        General Aptitude
      </button>
      <button   
        onClick={() => setCurrentSection("Technical")}
        className={`px-4 py-2 rounded ${
          currentSection === "Technical"
            ? "bg-blue-200 text-black border border-blue-300"
            : "bg-gray-200 text-black"
        }`}
      >
        Technical
      </button>
    </div>
  );
};

export default SectionTabs;
