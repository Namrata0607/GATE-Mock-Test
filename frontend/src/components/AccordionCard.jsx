// import { Link , useLocation } from "react-router-dom"; 
import { useState } from "react";
import "../App.css";

function AccordionCard({ title, description }) {
    const [expanded, setExpanded] = useState(false);
  
    return (
      <div className="mb-10 hover:cursor-pointer transition-all duration-300 ease-in-out ">
        <button
          onClick={() => setExpanded(!expanded)}
          className="rounded-t-2xl w-full h-15 text-left px-4 py-2 bg-blue-200 text-gray-800 hover:text-gray-900 font-bold flex justify-between items-center hover:bg-blue-300 hover:cursor-pointer tranition align-baseline"
        >
          <span>{title}</span>
          <span className="text-2xl">
            <img
              src={
                expanded ? "/Images/minimizeIcon.png" : "/Images/maximize.png"
              }
              alt={expanded ? "Collapse" : "Expand"}
              style={{ width: 22, height: 22 , transition: "transition-all duration-300 ease-in-out"}}
            />
          </span>
        </button>
        {expanded && (
          <div className="px-4 py-2 bg-gray-100 text-gray-700 rounded-b-2xl">
            {description}
          </div>
        )}
      </div>
    );
  }

export default AccordionCard;
