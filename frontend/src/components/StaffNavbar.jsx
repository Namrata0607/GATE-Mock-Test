// src/components/StaffNavbar.jsx
import { Link } from "react-router-dom";

function StaffNavbar() {
  return (
    <nav className="bg-gray-100 p-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold">Staff Panel</h1>
      <div>
        <Link to="/prequestionp" className="text-lg font-medium hover:underline">Previous Question Papers</Link>
      </div>
    </nav>
  );
}

export default StaffNavbar;
