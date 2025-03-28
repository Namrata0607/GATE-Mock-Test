import React from 'react'
import { useState } from "react";


function PreQuestionP() {
  const [selectedYear, setSelectedYear] = useState(2022);
  const [selectedPdf, setSelectedPdf] = useState(null);

  const papers = {
    2020: [{ name: "GATE CS 2020", url: "/Pdfs/sample.pdf" }],
    2021: [{ name: "GATE CS 2021", url: "/Pdfs/sample.pdf" }],
    2022: [{ name: "GATE CS 2022", url: "/Pdfs/sample.pdf" }],
    2023: [{ name: "GATE CS 2023", url: "/Pdfs/sample.pdf" }],
  };
  
  return (
    <div>
      <h1 className="text-5xl font-[Open_Sans] font-bold drop-shadow-xs mb-13 mt-10 text-center text-green-950">GATE Question Papers</h1>
      {/* <h2 className="text-2xl font-bold mb-4 align-text-top text-center text-green-950">GATE Question Papers</h2> */}
      <div className='max-w-6xl mx-auto p-5 bg-green-100 rounded-lg shadow-md mb-20'>

        {/* year selection */}
        <div className='flex space-x-3'>
          {/* papers is an object containing years as keys and corresponding PDF lists as values.
          Object.keys(papers) extracts all years (["2020", "2021", "2022", "2023"]).
          .map((year) => (...)) loops through each year and generates a button. */}
          {Object.keys(papers).map((year) => (
            <button
              key={year}
              // Updates the selectedYear state when clicked.
              onClick={() => {
                setSelectedYear(year);
                setSelectedPdf(null); // Reset PDF when year changes
              }}
              className={`px-4 py-2 rounded-md border ${
                selectedYear == year ? "bg-green-800 text-white" : "bg-gray-100 text-green-900 font-bold"
              }`}
            >
              {year}
            </button>
          ))}
        </div>

          {/* pdf display area */}
          <div className='rounded-md shadow-md p-4 bg-white my-5'>
          {papers[selectedYear] ? (
            <ul className="list-disc pl-5">
              {papers[selectedYear].map((pdf, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                <span  className="cursor-pointer text-blue-600 underline"
                    onClick={() => setSelectedPdf(pdf.url)}
                    >
                      {pdf.name}
                    </span>
                <a href={pdf.url} download className="px-3 py-1 bg-green-800 text-white rounded-md">
                  Download
                </a>
              </li>
              ))}
            </ul>
          ) : (
            <p>No question papers available for this year.</p>
          )}
          </div>

            {/* PDF Viewer */}
          {selectedPdf && (
            <div className="mt-4 border rounded-md overflow-hidden">
              <embed
              src={selectedPdf}
              type="application/pdf"
              className="w-full h-[500px] border"
            />
            </div>
          )}
      </div>
    </div>
  )
}

export default PreQuestionP;