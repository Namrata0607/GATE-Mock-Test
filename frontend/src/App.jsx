import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ExamGuide from "./pages/ExamGuide";
import ULoginSignup from "./pages/ULoginSignup";
import Instructions from "./pages/Instructions";
import PreQuestionP from "./pages/PreQuestionP";
import TestUI from "./pages/TestInterface";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/examguide" element={<ExamGuide />} />
        <Route path="/uloginsignup" element={<ULoginSignup />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/prequestionp" element={<PreQuestionP />} />
        <Route path="/testui" element={<TestUI />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;