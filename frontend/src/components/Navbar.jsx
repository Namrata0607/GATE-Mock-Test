import { Link , useLocation } from "react-router-dom"; 
import "../App.css";

function Navbar(){

  const location = useLocation();
  
  const linkClass = "font-bold text-xl m-10 transition duration-100 px-4 py-1";
  const activeClass = "border-b-2 border-gray-800"; 
  const inactiveClass = ""; 
  // gradient-to-r from-blue-200 via-purple-300 to-blue-200
  return(
    <nav className="bg-gray-100 border-b-2 border-gray-200 shadow-2xs-gray  h-17 w-full flex justify-between items-center text-gray-800 p-5 ">
    <h1 className="font-bold text-2xl">GATEPrep</h1>
    <div className="flex space-x-5 justify-between">
      <Link to="/" className={`${linkClass} ${location.pathname === "/" ? activeClass : inactiveClass}`}>Home</Link>
      <Link to="/examguide" className={`${linkClass} ${location.pathname === "/examguide" ? activeClass : inactiveClass}`}>Exam Guide</Link>
      <Link to="/prequestionp" className={`${linkClass} ${location.pathname === "/prequestionp" ? activeClass : inactiveClass}`}>Previous Question Papers</Link>
    </div>
  </nav>
    );
}

export default Navbar;


