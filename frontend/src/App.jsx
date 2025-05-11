import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import './App.css';
import { matchPath } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProfileNavbar from "./components/ProfileNavbar";
import StaffNavbar from "./components/StaffNavbar"; 
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ExamGuide from "./pages/ExamGuide";
import ULoginSignup from "./pages/UserLoginSignup";
import Instructions from "./pages/userDashboard";
import PreQuestionP from "./pages/PreQuestionP";
import TestUI from "./pages/TestInterface";
// import Admin from "./pages/admin";
// import StaffUpload from "./pages/StaffLogin";
import StaffLogin from "./pages/StaffLogin";
import StaffDashboard from "./pages/staffDashboard";
import StaffProfile from "./pages/staffProfile"; 
import SetMarks from "./pages/setMarks";
import UserProfile from "./pages/userProfile";
import TestAnalysis from "./pages/TestAnalysis"; // Import the TestAnalysis component 
function AppContent() {
  const location = useLocation();

  const hideNavbarAndFooterRoutes = ["/testui"];
  const userRoutes = ["/userDashboard","/userProfile"]; // update as needed for user access
  const staffRoutes = ["/staffLogin","/staffDashboard","/staffProfile","/set-marks/:branchId"]; // for staff access

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token);
  }, []);

  // Check if the current route matches any staff route
  const isStaffRoute = staffRoutes.some((route) => matchPath(route, location.pathname));

  // Check if the current route matches any user route
  const isUserRoute = userRoutes.some((route) => matchPath(route, location.pathname));

  return (
    <>
      {
        !hideNavbarAndFooterRoutes.includes(location.pathname) &&
        (
          isStaffRoute
            ? <StaffNavbar /> // Show custom navbar for staff
            : (isLoggedIn && isUserRoute
              ? <ProfileNavbar /> // Show ProfileNavbar for logged-in users on user routes
              : <Navbar /> // Default navbar
            )
        )
      }
      <Routes>
        {/* Define routes */}
        <Route path="/" element={<Home />} />
        <Route path="/examguide" element={<ExamGuide />} />
        <Route path="/uloginsignup" element={<ULoginSignup />} />
        <Route path="/userDashboard" element={<Instructions />} />
        <Route path="/prequestionp" element={<PreQuestionP />} />
        <Route path="/testui" element={<TestUI />} />
        <Route path="/staffLogin" element={<StaffLogin />} />
        <Route path="/staffDashboard" element={<StaffDashboard />} />
        <Route path="/staffProfile" element={<StaffProfile />} />
        <Route path="/set-marks/:branchId" element={<SetMarks />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/test-details/:testId" element={<TestAnalysis/>} />
        {/* Add more routes as needed */}

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
