import {React} from 'react'
import { Link , useLocation } from "react-router-dom"; 
import { useEffect, useState } from 'react';
import { fetchData } from '../utils/UserDetails';
import "../App.css";

function ProfileNavbar(){

    const location = useLocation();

    const linkClass = "font-bold text-xl m-10 transition duration-100 px-4 py-1";

    const [user, setUser] = useState({ name: ''});
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
      
return(
    <nav className="bg-gray-100 border-b-2 border-gray-200 shadow-2xs-gray h-15 md:h-16 lg:h-16 w-full flex justify-between items-center text-gray-800 p-5 ">
    <h1 className="font-[Open_Sans] font-bold text-lg md:text-xl lg:text-2xl ">Welcome {user.name} !</h1>
    <div className="flex space-x-5 justify-between">
        {/* <button onClick={handleLogout} 
        className='relative border-2 border-blue-950 h-8 w-28 rounded-sm bg-white bg-border-blue-950 hover:bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 hover:text-white 
        font-[Sans] font-semibold md:text-lg md:w-30 md:h-9 lg:h-10 lg:w-32 ease-in-out duration-400'>
          Log Out
        </button> */}

        <div>
          {location.pathname !== "/staffLogin" && (
              <Link to="/userProfile" className={linkClass}>
                <img src="/Images/profile-staff.png" alt="staff-profile" className="h-10" />
              </Link>
          )}
        </div>

    </div>
  </nav>
    );
}

export default ProfileNavbar;