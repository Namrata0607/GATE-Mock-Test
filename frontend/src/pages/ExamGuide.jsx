import '../App.css';
import AccordionCard from "../components/AccordionCard";

function ExamGuide() {
  const sections = [
    {
      title: "What is GATE?",
      description:
      <>
        <p><b className='text-gray-700'>GATE (Graduate Aptitude Test in Engineering)</b>  is a national-level exam conducted by the IITs and IISc on a rotational basis. It is a computer-based test that evaluates the comprehensive understanding of various undergraduate subjects in engineering and science.</p>
        <br/><p>It is a gateway for candidates to secure admission to postgraduate programs like M.Tech, M.E., Ph.D., etc., in prestigious institutions like IITs, NITs, IIITs, and other universities across India.</p>
      </>
    },
    {
      title: "Exam Pattern & Structure",
      description:
      <ul className="list-none space-y-3">
      {[
        { label: "Total Marks", value: "100" },
        { label: "Total Questions", value: "65" },
        { label: "Duration", value: "3 Hours" },
        { label: "Sections", isHeader: true },
        { label: "General Aptitude", value: "15 Marks" },
        { label: "Core Subject", value: "85 Marks" },
        { label: "Question Types", isHeader: true },
        { label: "MCQs", value: "Each carries 1 or 2 marks." },
        { label: "MSQs", value: "May have more than one correct answer." },
        { label: "NAT", value: "Requires candidates to enter numerical answers." },
        { label: "Marking Scheme", isHeader: true },
        { label: "Correct Answer", value: "+1 or +2 marks, based on question type." },
        { label: "Negative Marking", isHeader: true },
        { label: "1-mark MCQs", value: "-0.33 marks for every wrong answer." },
        { label: "2-mark MCQs", value: "-0.66 marks for wrong responses." },
        { label: "Note", value: "No negative marking for MSQs and NATs." }
      ].map((item, index) => (
        <li key={index} className="flex items-start">
          {!item.isHeader && (
            <span className="w-2 h-2 bg-gray-700 rounded-full mr-3 mt-2"></span>
          )}
          <span className={item.isHeader ? "text-gray-700 text-base" : "text-base  text-gray-700"}>
            <strong>{item.label}:</strong> {item.value}
          </span>
        </li>
      ))}
    </ul>
    },
    {
      title: "Exam Preparation Tips",
      description:
        <>
        <ul className="list-none space-y-3">
          {[
            { label: "Understand the Syllabus & Weightage", value: "Carefully review the official GATE syllabus and prioritize topics based on their importance and past frequency." },
            { label: "Consistent Practice", value: "Integrate mock tests into your daily routine, solving both topic-wise and full-length tests to improve speed and confidence." },
            { label: "Revise Regularly", value: "Create short notes, flashcards, or summary sheets for quick revision, focusing on formulas, key concepts, and problem-solving techniques." },
            { label: "Time Management", value: "Practice pacing yourself during mock tests and develop strategies like solving easy questions first before tackling difficult ones." },
            { label: "Stress Management", value: "Use relaxation techniques such as deep breathing and short breaks during study sessions while maintaining a balanced lifestyle with sleep, exercise, and social activities." }
          ]
          .map((item, index) => (
            <li key={index} className="flex items-start">
            <span className="text-gray-700 font-bold text-lg mr-3">✔</span>
            <span className='text-base text-gray-700'>
                <strong>{item.label}:</strong><br /> {item.value}
              </span>
            </li>
          ))}
        </ul>
        </>
    },
    {
      title: "Additional Resources & Strategies",
      description:
      <>
      <ul className="list-none space-y-3">
        {[
          { label: "Official Websites & Forums", value: "Stay updated by visiting the official GATE website for notifications and engage in online forums for peer support." },
          { label: "Coaching & Online Courses", value: "Consider enrolling in coaching classes or online courses for structured learning and expert guidance." },
          { label: "Mock Test Reviews", value: "After each test, review answers, learn from explanations, and use performance reports to refine your study plan." }
        ].map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-gray-700 font-bold text-base mr-3">◆</span>
            <span className="text-base text-gray-700">
              <strong>{item.label}:</strong><br /> {item.value}
            </span>
          </li>
        ))}
      </ul>
      </>
    },
    {
      title: "Key Features of Our Mock Tests",
      description:
      <>
  <ul className="list-none space-y-3">
    {[
      { label: "Real Exam Interface", value: "Experience an exam environment that mimics the actual GATE test, with timer settings and realistic question formats." },
      { label: "Multiple Practice Modes", value: "Choose between timed tests for exam simulation or untimed sessions for focused practice on specific topics." },
      { label: "Detailed Performance Analysis", value: "Get insights into your performance with analytics that highlight strengths, pinpoint weaknesses, and track progress over time." },
      { label: "Extensive Question Bank", value: "Access a vast collection of questions, including previous GATE questions and curated problems to sharpen your skills." },
      { label: "Interactive Explanations", value: "Each mock test provides detailed solutions and explanations to help you learn from mistakes and strengthen your understanding." }
    ].map((item, index) => (
      <li key={index} className="flex items-start">
            <span className="text-gray-700 font-bold text-lg mr-3">✔</span>
            <span className='text-base text-gray-700'>
          <strong>{item.label}:</strong><br /> {item.value}
        </span>
      </li>
    ))}
  </ul>
</>

    },
  ];

  return (
    <div className=" h-full w-full pb-50">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-[Open_Sans] font-bold drop-shadow-xs mb-13 mt-5 text-center text-gray-800">Exam Guide</h1>
        {sections.map((sec, idx) => (
          <AccordionCard key={idx} title={sec.title} description={sec.description} />
        ))}
      </div>
    </div>
  );
}

// component for accordion card
// used here props, useState ..props are used to pass data from parent to child component



export default ExamGuide;
