import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../App.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false); // State to manage menu visibility
  const location = useLocation();

  const linkClass = "font-bold text-xl m-10 transition duration-100 px-4 py-1";
  const activeClass = "border-b-2 border-gray-800";
  const inactiveClass = "";

  return (
    <nav className="bg-gray-100 border-b-2 border-gray-200 shadow-2xs-gray flex flex-row justify-between items-center text-gray-800 px-6 h-30 w-full sticky">
      <h1 className="font-[Open_Sans] font-bold text-3xl animate-shimmer bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
        GATEPrep
      </h1>
      {/* Desktop Links */}
      <div className="hidden md:flex space-x-5 justify-between">
        <Link
          to="/"
          className={`${linkClass} ${
            location.pathname === "/" ? activeClass : inactiveClass
          }`}
        >
          Home
        </Link>
        <Link
          to="/examguide"
          className={`${linkClass} ${
            location.pathname === "/examguide" ? activeClass : inactiveClass
          }`}
        >
          Exam Guide
        </Link>
        <Link
          to="/prequestionp"
          className={`${linkClass} ${
            location.pathname === "/prequestionp" ? activeClass : inactiveClass
          }`}
        >
          Previous Question Papers
        </Link>
      </div>
      {/* Mobile Menu */}
      <div className="md:hidden relative">
        <button
          className="text-gray-800 text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)} // Toggle menu visibility
        >
          ☰
        </button>
        {menuOpen && (
          <div className=" right-0 top-10 bg-gray-100 shadow-lg rounded-md w-48">
            <Link
              to="/"
              className="block px-4 py-2 hover:bg-gray-200"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/examguide"
              className="block px-4 py-2 hover:bg-gray-200"
              onClick={() => setMenuOpen(false)}
            >
              Exam Guide
            </Link>
            <Link
              to="/prequestionp"
              className="block px-4 py-2 hover:bg-gray-200"
              onClick={() => setMenuOpen(false)}
            >
              Previous Question Papers
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;