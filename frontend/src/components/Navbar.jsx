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
    <nav className="bg-gray-100 border-b-2 border-gray-200 shadow-2xs-gray flex flex-row justify-between items-center text-gray-800 px-6 h-15 md:h-16 lg:h-16 w-full sticky">
      <h1 className="font-[Open_Sans] font-bold text-3xl animate-shimmer bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
        GATEPrep
      </h1>
      {/* Mobile Menu */}
      <div className="lg:hidden">
        <button
          className="text-2xl focus:outline-none text-purple-500 hover:text-purple-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        {menuOpen && (
          <div className="right-5 top-20 bg-gray-100 shadow-lg rounded-sm w-48 mt-20 border-2 border-gray-200">
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
      {/* desktop Links */}
      <div className="hidden lg:flex space-x-5 justify-between items-center">
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
    </nav>
  );
}

export default Navbar;