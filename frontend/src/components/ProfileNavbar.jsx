import {React} from 'react'
// import { Link , useLocation } from "react-router-dom"; 
import { useEffect, useState } from 'react';
import { fetchData } from '../utils/UserDetails';
import "../App.css";

function ProfileNavbar(){

  // const location = useLocation();
  
  // const linkClass = "font-bold text-xl m-10 transition duration-100 px-4 py-1";
  // const activeClass = "border-b-2 border-gray-800"; 
  // const inactiveClass = ""; 
  // gradient-to-r from-blue-200 via-purple-300 to-blue-200

    const [user, setUser] = useState({ name: '', branch: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
      // Fetch user data from API
      const fetchUserData = async () => {
        try {
          const data = await fetchData('http://localhost:3000/api/users/userdetails');
          setUser(data);
        } catch (err) {
          setError(err.message);
        }
      };
  
      fetchUserData();
    }, []);
    
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>Loading...</p>;

  const handleLogout = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/users/logout/", {
            method: "POST",
            credentials: "include", // Ensure cookies are included
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            localStorage.removeItem("token"); // Clear token from storage
            window.location.href = "/"; // Redirect to login page
        } else {
            alert("Logout failed: " + data.message);
        }
    } catch (error) {
        console.error("Logout error:", error);
    }
};
  
return(
    <nav className="bg-gray-100 border-b-2 border-gray-200 shadow-2xs-gray  h-17 md:h-20 lg:h-20 w-full flex justify-between items-center text-gray-800 p-5 ">
    <h1 className="font-[Open_Sans] font-bold text-lg md:text-xl lg:text-3xl ">Welcome {user.name} !</h1>
    <div className="flex space-x-5 justify-between">
        <button onClick={handleLogout} 
        className='relative border-2 h-10 w-30 rounded-sm bg-blue-200 border-blue-200 hover:bg-blue-100 font-[Open_Sans] font-bold md:text-lg md:w-35 lg:text-xl lg:h-12 lg:w-40'>
          Log Out
        </button>
    </div>
  </nav>
    );
}

export default ProfileNavbar;