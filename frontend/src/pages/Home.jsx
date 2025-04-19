// import React, { useEffect,useState } from "react";
import "../App.css";
import AnimatedHeading from "../components/AnimatedHeading";
import IndexCard from "../components/Indexcard";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const onClickHandler = () => {
    navigate("/uloginsignup");
  };

  //axios
  // const [questions, setQuestions] = useState([]);
  // useEffect(() => {
  //   fetch("http://localhost:3000/api/questions/", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json", // Corrected key syntax
  //     },
  //   })
  //     .then((response) => response.json()) // Ensure response is parsed
  //     .then((data) => {
  //       setQuestions(data.questions)
  //       console.log(data);
  //     }) // Handle data
  //     .catch((error) => console.error("Error fetching data:", error)); // Handle errors
  // }, []);

  const cardData = [
    { imgSrc: "/Images/clock-1.png", title: "Improve Time Management", description: "Practice tests help enhance speed and accuracy for real" },
    { imgSrc: "/Images/analysis-2.png", title: "Analyze Weaknesses", description: "Practice teste helps to identify areas of improvement." },
    { imgSrc: "/Images/target-3.png", title: "Real Exam Experience", description: "Practice tests help you get familiar with the exam pattern." },
    { imgSrc: "/Images/anxiety-4.png", title: "Reduce Exam Anxiety", description: "Practice tests help reduce anxiety and stress before exams." },
    { imgSrc: "/Images/growth-5.png", title: "Track Progress", description: "Practice teste helps to track your progress and performance." },
    { imgSrc: "/Images/notepad-6.png", title: "Learn from Mistakes", description: "Practice tests help you learn from your mistakes and improve." }
  ];

  return (
    <>
      {/* bg-green-50 */}
      <div className=" h-full w-full">
        {/* <marquee behavior="" direction="" className="text-2xl text-red-600">
          Any Notice or Sentence</marquee> */}

        <div className="flex flex-col items-center text-center md:flex-row md:justify-between md:items-center md:mt-2 lg:mt-5 lg:mb-4">
          <img 
            src="/Images/index-exam.png"
            alt="Background"
            className="w-140 h-90 mt-5 mb-8 md:w-120 md:h-80 md:mt-5 md:mb-10 lg:w-200 lg:h-160 lg:-mt-8 lg:mb-10 lg:ml-30"
          />
          <div className="flex flex-col items-center">
            <AnimatedHeading />
            <button
              onClick={onClickHandler}
              className="w-70 h-14 bg-white border-3 border-blue-950
             text-gray-800 font-[sans] font-semibold text-2xl rounded-lg hover:bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 hover:text-white hover:border-blue-950
              transition ease-in-out duration-400 text-center lg:text-2xl lg:w-80 lg:h-15 lg:mt-10 lg:mb-10 "
            >
              Proceed To Test
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center">
      <div className="flex-col items-center justify-center h-450 w-300 lg:h-320 mt-10 md:mt-0">
        <h1 className="relative text-3xl font-[Open_Sans] text-gray-800 font-bold mt-10 mb-10 text-center md:text-4xl lg:text-5xl lg:mb-30">
          Why to give mock tests?
        </h1>
        {/* Render Cards Dynamically */}
        <div className="flex flex-wrap justify-center gap-15 mt-15 lg:gap-30">
          {cardData.map((card, index) => (
            <IndexCard key={index} imgSrc={card.imgSrc} title={card.title} description={card.description} />
          ))}
        </div>
      </div>
    </div>
      </div>
    </>
  );
}

export default Home;