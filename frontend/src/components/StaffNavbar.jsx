// src/components/StaffNavbar.jsx
import { Link } from "react-router-dom";

function StaffNavbar() {
  return (
    <nav className="flex flex-col md:flex-row justify-between items-center p-4 md:p-6 bg-white shadow-md">
  <h1 className="text-lg md:text-2xl font-bold">GATEPrep</h1>
  <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-4 md:mt-0">
    <a href="/" className="text-sm md:text-base hover:underline">Home</a>
    <a href="/prequestionp" className="text-sm md:text-base hover:underline">Previous Papers</a>
  </div>
</nav>
  );
}

export default StaffNavbar;
