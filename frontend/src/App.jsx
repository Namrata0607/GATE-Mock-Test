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
import Instructions from "./pages/Instructions";
import PreQuestionP from "./pages/PreQuestionP";
import TestUI from "./pages/TestInterface";
// import Admin from "./pages/admin";
// import StaffUpload from "./pages/StaffLogin";
import StaffLogin from "./pages/StaffLogin";
import StaffDashboard from "./pages/staffDashboard";
import StaffProfile from "./pages/staffProfile"; 
import SetMarks from "./pages/setMarks";

function AppContent() {
  const location = useLocation();

  const hideNavbarAndFooterRoutes = ["/testui"];
  const userRoutes = ["/instructions"]; // update as needed for user access
  const staffRoutes = ["/staffLogin","/staffDashboard","/staffProfile","/set-marks/:branchId"]; // for staff access

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  // Check if the current route matches any staff route
  const isStaffRoute = staffRoutes.some((route) => matchPath(route, location.pathname));

  return (
    <>
       {
        !hideNavbarAndFooterRoutes.includes(location.pathname) &&
        (
          isStaffRoute
            ? <StaffNavbar /> // Show custom navbar for staff
            : (isLoggedIn && userRoutes.includes(location.pathname)
              ? <ProfileNavbar />
              : <Navbar />
            )
        )
      }
      <Routes>
        {/* <Route path="/admin" element={<Admin />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/examguide" element={<ExamGuide />} />
        <Route path="/uloginsignup" element={<ULoginSignup />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/prequestionp" element={<PreQuestionP />} />
        <Route path="/testui" element={<TestUI />} />
        <Route path="/staffLogin" element={<StaffLogin />} />
        <Route path="/staffDashboard" element={<StaffDashboard />} />
        <Route path="/staffProfile" element={<StaffProfile />} /> 
        <Route path="/set-marks/:branchId" element={<SetMarks />} /> {/* Pass branchId as a URL parameter */}
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
