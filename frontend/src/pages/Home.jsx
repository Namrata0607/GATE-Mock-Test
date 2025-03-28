import React, { useEffect,useState } from "react";
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
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/questions/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Corrected key syntax
      },
    })
      .then((response) => response.json()) // Ensure response is parsed
      .then((data) => {
        setQuestions(data.questions)
        console.log(data);
      }) // Handle data
      .catch((error) => console.error("Error fetching data:", error)); // Handle errors
  }, []);

  const cardData = [
    { imgSrc: "/Images/emoji1.png", title: "Improve Time Management", description: "Practice tests help enhance speed and accuracy for real" },
    { imgSrc: "/Images/emoji2.png", title: "Analyze Weaknesses", description: "Practice teste helps to identify areas of improvement." },
    { imgSrc: "/Images/emoji3.png", title: "Real Exam Experience", description: "Practice tests help you get familiar with the exam pattern." },
    { imgSrc: "/Images/emoji4.png", title: "Reduce Exam Anxiety", description: "Practice tests help reduce anxiety and stress before exams." },
    { imgSrc: "/Images/emoji5.png", title: "Track Progress", description: "Practice teste helps to track your progress and performance." },
    { imgSrc: "/Images/emoji6.png", title: "Learn from Mistakes", description: "Practice tests help you learn from your mistakes and improve." }
  ];

  return (
    <>
      {/* bg-green-50 */}
      <div className=" h-full w-full">
        {/* <marquee behavior="" direction="" className="text-2xl text-red-600">
          Any Notice or Sentence</marquee> */}

        <div className="flex flex-row items-center text-center">
          <img
            src="/Images/girllaptop.jpeg"
            alt="Background"
            className="w-230 h-150"
          />
          <div className="flex flex-col items-center">
            <AnimatedHeading />
            <button
              onClick={onClickHandler}
              className="mt-6 mr-20 px-6 py-3 w-100 bg-white border-3 border-blue-200
             text-gray-800 font-semibold text-2xl rounded-lg hover:bg-blue-200
               not-only: transition ease-in-out "
            >
              {/* hover:scale-[1.1] transition */}
              Proceed To Test
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center">
      <div className="flex-col items-center justify-center h-200 w-300 mb-20 mt-20 pt-0">
        <h1 className="relative text-5xl font-[Open_Sans] text-gray-800 font-bold mt-10 mb-10 text-center">
          Why to give mock tests?
        </h1>
        {/* Render Cards Dynamically */}
        <div className="flex flex-wrap justify-center gap-20 mt-15">
          {cardData.map((card, index) => (
            <IndexCard key={index} imgSrc={card.imgSrc} title={card.title} description={card.description} />
          ))}
        </div>
      </div>
    </div>
        <div className="flex p-32 gap-20 ">
          {questions.map((question)=>{
            return <div className="flex flex-col bg-gray-100 hover:bg-gray-200 rounded-xl p-10 transition-all ease-in">
                <p className="text-xl font-bold uppercase">{question.question}</p>
                <p className="text-sm">{question.options}</p>
                {/* <p>{question.correctAnswer}</p> */}
            </div>
          })}
        </div>
      </div>
    </>
  );
}

export default Home;