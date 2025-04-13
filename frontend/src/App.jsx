import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import './App.css';
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
import Admin from "./pages/admin";
import StaffUpload from "./pages/Staff";

function AppContent() {
  const location = useLocation();

  const hideNavbarAndFooterRoutes = ["/testui"];
  const authRoutes = ["/instructions"]; // update as needed
  const staffRoutes = ["/staff-upload"]; // for staff access

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <>
      {
        !hideNavbarAndFooterRoutes.includes(location.pathname) &&
        (
          staffRoutes.includes(location.pathname)
            ? <StaffNavbar /> // 👈 show custom navbar for staff
            : (isLoggedIn && authRoutes.includes(location.pathname)
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
        <Route path="/staff-upload" element={<StaffUpload />} />
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
