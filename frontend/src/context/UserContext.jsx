// // src/context/UserContext.js
// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // Store user info
//   const [loading, setLoading] = useState(true); // Handle loading state

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/api/users/userdetails", {
//           withCredentials: true, // Important for sending cookies/token
//           headers: {
//             Authorization: localStorage.getItem("token"), // If using token-based auth
//           },
//         });
//         setUser(res.data);
//       } catch (err) {
//         console.error("Error fetching user:", err.response?.data?.message || err.message);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, loading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// // Custom hook to use user context
// // export const useUser = () => useContext(UserContext);
