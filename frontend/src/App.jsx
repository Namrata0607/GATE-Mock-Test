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

function AppContent() {
  const location = useLocation();

  const hideNavbarAndFooterRoutes = ["/testui"];
  const authRoutes = ["/instructions"]; // update as needed

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <>
      {
        !hideNavbarAndFooterRoutes.includes(location.pathname) &&
        (isLoggedIn && authRoutes.includes(location.pathname) ? <ProfileNavbar /> : <Navbar />)
      }

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
