import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaPercentage,
  FaChartLine,
  FaBook,
  FaUserCheck,
  FaUserTimes,
  
  FaClipboardCheck,
  FaPen,
  FaClipboardList ,
  FaQuestionCircle,
  FaBullseye,
  FaExclamationTriangle
} from "react-icons/fa";
import { AiOutlineBarChart } from "react-icons/ai";
import { MdOutlineQuiz } from "react-icons/md";

export default function TestAnalysis() {
  const { testId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const token = localStorage.getItem("userToken");
      const payload = { testId };

      try {
        const response = await fetch("http://localhost:3000/api/test/testAnalysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (response.ok) {
          setAnalysis({
            ...data.summary,
            additionalCalculations: data.additionalCalculations,
          });
        } else {
          setError(data.message || "Failed to fetch test analysis.");
        }
      } catch (err) {
        setError("An error occurred while fetching test analysis.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [testId]);

  if (loading) return <div className="text-center text-lg font-semibold">Loading...</div>;
  if (error) return <div className="text-center text-red-500 font-semibold">{error}</div>;

  return (
  <div className="p-6 max-w-6xl mx-auto">
  {/* Page Header */}
  <h1 className="text-4xl font-extrabold mb-8 flex items-center gap-3 text-gray-700">
    <FaClipboardCheck className="text-gray-500 text-3xl" />
    Test Analysis
  </h1>

  {/* Summary Card */}
  <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-green-700">
      <AiOutlineBarChart className="text-green-600 text-2xl" />
      Summary
    </h2>

    <div className="grid sm:grid-cols-2 gap-6 text-base sm:text-lg">
      <p className="flex items-center gap-2">
        <FaStar className="text-yellow-500 text-xl" />
        <span>Total Marks:</span> 
        <span className="font-bold text-gray-800">{analysis.totalMarks}</span>
      </p>

      <p className="flex items-center gap-2">
        <FaPercentage className="text-pink-500 text-xl" />
        <span>Percentage:</span>
        <span className="font-bold text-gray-800">{analysis.additionalCalculations.percentage}%</span>
      </p>

      <p className="flex items-center gap-2 col-span-2 sm:col-span-1">
        {analysis.additionalCalculations.qualified ? (
          <>
            <FaUserCheck className="text-green-500 text-xl" />
            <span className="text-green-700 font-semibold">Qualified</span>
          </>
        ) : (
          <>
            <FaUserTimes className="text-red-500 text-xl" />
            <span className="text-red-600 font-semibold">Not Qualified</span>
          </>
        )}
      </p>

      <p className="flex items-center gap-2">
        <FaChartLine className="text-indigo-500 text-xl" />
        <span>GATE Score Estimate:</span>
        <span className="font-bold text-gray-800">{analysis.additionalCalculations.gateScoreEstimate}</span>
      </p>
    </div>

    {/* Section-wise Marks */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-700">
            <FaBook className="text-gray-600 text-xl" />
            Section-wise Marks
          </h3>
          <ul className="list-disc ml-6 space-y-1 text-base text-gray-800">
            {Object.entries(analysis.sectionwiseMarks).map(([section, marks]) => (
              <li key={section}>
            {section.charAt(0).toUpperCase() + section.slice(1)}: <span className="font-semibold">{marks.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
            

        <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-700">
            <FaClipboardList className="text-gray-600 text-xl" />
            Subject-wise Marks
              </h3>
              <ul className="list-disc ml-6 space-y-1 text-base text-gray-800">
            {Object.entries(
              analysis.detailedAnalysis.reduce((acc, question) => {
                const subject = question.subject;
                if (!acc[subject]) {
                  acc[subject] = { obtained: 0, total: 0 };
                }
                acc[subject].obtained += question.obtainedMarks;
                acc[subject].total += question.totalMarks;
                return acc;
              }, {})
            ).map(([subject, marks]) => (
              <li key={subject}>
                {subject.charAt(0).toUpperCase() + subject.slice(1)}:{" "}
                <span className="font-semibold">
                  {marks.obtained.toFixed(2)} / {marks.total.toFixed(2)}
                </span>
              </li>
            ))}
              </ul>
            </div>
          </div>
          
          {/* Detailed Analysis */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <FaClipboardList  className="text-purple-600" />
          Detailed Analysis
        </h2>

            {analysis.detailedAnalysis.map((question, index) => {
                const optionLabels = ["A", "B", "C", "D", "E", "F"];

                const hasOptions = Array.isArray(question.options) && question.options.length > 0;

                return (
                    <div
                    key={index}
                    className={`relative group border-l-4 ${
                        question.obtainedMarks > 0
                        ? "border-green-500"
                        : question.attemptedStatus
                        ? "border-red-400"
                        : "border-gray-300"
                    } bg-white rounded-xl p-6 mb-6 shadow-md hover:shadow-xl transition-all duration-300`}
                    >
                    {/* Header: Question + Marks + Subject */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                        <span className="text-blue-600 font-bold mr-2">Q{question.questionIndex}:</span>
                        {question.questionText}
                        </h3>
                        <div className="mt-2 md:mt-0 flex items-center gap-4 text-sm md:text-base">
                        <span className="bg-blue-50 text-blue-600 font-semibold px-3 py-1 text-sm rounded-full border border-blue-200">
                        {question.subject}
                        </span>
                        <span className="bg-green-50 text-green-700 font-semibold px-3 py-1 rounded-full border text-sm border-green-200">
                        Marks:  {question.obtainedMarks} / {question.totalMarks}
                        </span>
                        </div>
                    </div>

                    {/* Question Image */}
                    {question.questionImage && (
                        <img
                        src={question.questionImage}
                        alt={`Question ${question.questionIndex}`}
                        className="mb-4 w-full rounded-lg border"
                        />
                    )}


{/* correct for value as answer */}
                    {/* Options or Direct Answer */}
            {hasOptions && question.options.some(option => option !== null) && (
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Options:</h4>
                        {question.correctAnswer}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {question.options.map((option, idx) => {
                        const normalizedOption = option?.toString().trim().toLowerCase();
                        const isCorrect = question.correctAnswer.some(
                        (ans) => ans?.toString().trim().toLowerCase() === normalizedOption
                        );

                        return (
                        <div
                            key={idx}
                            className={`border rounded-md px-3 py-2 text-sm flex items-start gap-2 ${
                            isCorrect
                                ? "bg-green-50 border-green-500 text-green-800 font-medium"
                                : "bg-gray-50 border-gray-300 text-gray-800"
                            }`}
                        >
                            <span className="font-bold">
                            {optionLabels[idx] || String.fromCharCode(65 + idx)}.
                            </span>
                            <span>{option ?? "N/A"}</span>
                        </div>
                        );
                    })}
                    </div>
                </div>
                )}


                {/* correct for a, b, c, d answers  */}
            {/* {hasOptions && question.options.some(option => option !== null) && (
              <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Options:</h4>
                  {question.correctAnswer}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {question.options.map((option, idx) => {
                            const optionLabel = optionLabels[idx]?.toLowerCase(); // "a", "b", "c", etc.
                    const isCorrect = question.correctAnswer.map(ans => ans.toLowerCase()).includes(optionLabel);

                        return (
                        <div
                            key={idx}
                            className={`border rounded-md px-3 py-2 text-sm flex items-start gap-2 ${
                            isCorrect
                                ? "bg-green-50 border-green-500 text-green-800 font-medium"
                                : "bg-gray-50 border-gray-300 text-gray-800"
                            }`}
                        >
                            <span className="font-bold">
                            {optionLabels[idx] || String.fromCharCode(65 + idx)}.
                            </span>
                            <span>{option ?? "N/A"}</span>
                        </div>
                        );
                    })}
                    </div>
                </div>
                )} */}

                

                {(!hasOptions || question.options.every(opt => !opt || opt === "N/A")) && (
                <div className="mb-4 flex items-center gap-2 text-xl"> 
                    <h4 className=" font-semibold text-gray-600 mb-1">Correct Answer:</h4>
                    <p className="font-mono text-green-700 ">
                    {question.correctAnswer.join(", ")}
                    </p>
                </div>
                )}

                        {/* Attempted, Negative Marking */}
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 mb-2">
                        <p>
                        <span className="font-semibold text-gray-800">Attempted:</span>{" "}
                        {question.attemptedStatus ? (
                            <span className="inline-flex items-center text-green-600 font-semibold">
                            <FaCheckCircle className="mr-1" /> Yes
                            </span>
                        ) : (
                            <span className="inline-flex items-center text-red-500 font-semibold">
                            <FaTimesCircle className="mr-1" /> No
                            </span>
                        )}
                        </p>
                        <p>
                        <span className="font-semibold text-gray-800">Negative Marking:</span>{" "}
                        {question.negativeMarking ? (
                            <span className="text-red-500 font-semibold">Yes</span>
                        ) : (
                            <span className="text-green-500 font-semibold">No</span>
                        )}
                        </p>
                    </div>

                    {/* Your Answer */}
                    <div className="mt-3  text-gray-700 text-md">
                        <span className="font-semibold text-gray-800">Your Answer:</span>{" "}
                        {question.chosenAnswer.length > 0 ? (
                        <span className="font-mono text-blue-600">{question.chosenAnswer.join(", ")}</span>
                        ) : (
                        <span className="italic text-gray-400">Not Answered</span>
                        )}
                    </div>

                    {/* Badge at bottom right */}
                    <div className="absolute bottom-3 right-4 text-xs text-gray-500 italic group-hover:text-gray-700 transition-all">
                        <FaQuestionCircle className="inline mr-1 text-blue-400" />
                        Question #{question.questionIndex}
                    </div>
                    </div>
                );
                })}



      </div>
    </div>
  );
}
