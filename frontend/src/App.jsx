import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import './App.css';
import Navbar from "./components/Navbar";
import ProfileNavbar from "./components/ProfileNavbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ExamGuide from "./pages/ExamGuide";
import ULoginSignup from "./pages/UserLoginSignup";
import Instructions from "./pages/Instructions";
import PreQuestionP from "./pages/PreQuestionP";
import TestUI from "./pages/TestInterface";
import Admin from "./pages/admin";

// function App() {
//   const location = useLocation();

//   // Define routes where the Navbar should not appear
//   const hideNavbarRoutes = ["/testui"];
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/admin" element={<Admin />} />
//         <Route path="/" element={<Home />} />
//         <Route path="/examguide" element={<ExamGuide />} />
//         <Route path="/uloginsignup" element={<ULoginSignup />} />
//         <Route path="/instructions" element={<Instructions />} />
//         <Route path="/prequestionp" element={<PreQuestionP />} />
//         <Route path="/testui" element={<TestUI />} />
//       </Routes>
//       <Footer/>
//     </Router>
//   );
// }

function AppContent() {
  const location = useLocation();

  // Define routes where the Navbar should not appear
  const hideNavbarAndFooterRoutes = ["/testui"];
  // const hideFooter = ["/testui"];

  // Manage user login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status from localStorage or sessionStorage
  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Replace "authToken" with your token key
    setIsLoggedIn(!!token); // Set to true if token exists, otherwise false
  }, []);


  return (
    <>
      {/* {!hideNavbarAndFooterRoutes.includes(location.pathname) && <Navbar />} */}

      {/* Conditionally render Navbar or ProfileNavbar */}
      {!hideNavbarAndFooterRoutes.includes(location.pathname) &&
        (isLoggedIn ? <ProfileNavbar /> : <Navbar />)}

      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Home />} />
        <Route path="/examguide" element={<ExamGuide />} />
        <Route path="/uloginsignup" element={<ULoginSignup />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/prequestionp" element={<PreQuestionP />} />
        <Route path="/testui" element={<TestUI />} />
      </Routes>
      {!hideNavbarAndFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;