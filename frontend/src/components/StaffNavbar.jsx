// src/components/StaffNavbar.jsx
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Logo from "../components/Logo";
import React from "react";

function StaffNavbar() {
  const location = useLocation();

  const linkClass = "font-bold text-xl m-10 transition duration-100 px-4 py-1";

  return (
    <nav className="bg-gray-100 border-b-2 border-gray-200 shadow-2xs-gray flex flex-row justify-between items-center text-gray-800 px-6 h-15 md:h-16 lg:h-16 w-full sticky">
      <Logo></Logo>
      <div>
        {location.pathname !== "/stafflogin" && (
          <Link to="/staffProfile" className={linkClass}>
            <img src="/Images/profile-staff.png" alt="staff-profile" className="h-10" />
          </Link>
        )}
      </div>
    </nav>
  );
}

export default StaffNavbar;
