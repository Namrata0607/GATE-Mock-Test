// import React, { useState } from "react";

// export default function Admin() {
//   const [file, setFile] = useState(null);

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleUpload = () => {
//     if (file) {
//       alert(`File "${file.name}" uploaded successfully!`);
//       // Add logic to process the file (e.g., send to backend)
//     } else {
//       alert("Please select a file first.");
//     }
//   };

//   return (
//     <>
//       <div className="flex flex-col items-center justify-center p-6">
//         <h2 className="text-2xl font-bold mb-4">Upload Excel File</h2>
//         <input
//           type="file"
//           accept=".xlsx, .xls"
//           onChange={handleFileChange}
//           className="mb-4 border p-2 rounded"
//         />
//         <button
//           onClick={handleUpload}
//           className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//         >
//           Upload
//         </button>
//       </div>
//     </>
//   );
// }


// import React, { useState } from "react";
// import * as XLSX from "xlsx";

// export default function Admin() {
//   const [file, setFile] = useState(null);
//   const [questions, setQuestions] = useState([]);

//   const handleFileChange = (event) => {
//     setFile(event.target.files[0]);
//   };

//   const handleUpload = () => {
//     if (!file) {
//       alert("Please select a file first.");
//       return;
//     }

//     const reader = new FileReader();
//     reader.readAsBinaryString(file);
//     reader.onload = (event) => {
//       const binaryStr = event.target.result;
//       const workbook = XLSX.read(binaryStr, { type: "binary" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const data = XLSX.utils.sheet_to_json(sheet);
//       setQuestions(data);
//     };
//   };

//   return (
//     <div className="flex flex-col items-center justify-center p-6">
//       <h2 className="text-2xl font-bold mb-4">Upload Excel File</h2>
//       <input
//         type="file"
//         accept=".xlsx, .xls"
//         onChange={handleFileChange}
//         className="mb-4 border p-2 rounded"
//       />
//       <button
//         onClick={handleUpload}
//         className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//       >
//         Upload
//       </button>
//       <div className="mt-6 w-full max-w-4xl">
//         <h3 className="text-xl font-bold mb-2">Extracted Questions:</h3>
//         <ul>
//           {questions.map((q, index) => (
//             <li key={index} className="border p-3 mb-2 rounded bg-gray-100">
//               <p className="font-semibold">{q.question}</p>
//               <ul className="list-disc pl-5">
//                 <li>Option 1: {q.option1}</li>
//                 <li>Option 2: {q.option2}</li>
//                 <li>Option 3: {q.option3}</li>
//                 <li>Option 4: {q.option4}</li>
//               </ul>
//               <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
//               <p><strong>Type:</strong> {q.queType}</p>
//               <p><strong>Marks:</strong> {q.mark}</p>
//               <p><strong>Negative Marking:</strong> {q.negativeMark ? "Yes" : "No"}</p>
//               <p><strong>Subject:</strong> {q.subject}</p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

export default function Admin() {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      setQuestions(data);
    };
  };

  const handleInsertToDB = async () => {
    try {
      const formattedQuestions = questions.map(q => ({
        question: q.question,
        queImg: q.queImg || "",
        options: [q.option1, q.option2, q.option3, q.option4].filter(Boolean),
       
        correctAnswer: q.correctAnswer.split(","),
        queType: q.queType,
        negativeMark: q.negativeMark === "true" || q.negativeMark === true,
        mark: Number(q.mark),
        subject: q.subject || "OS"
      }));

      const response = await axios.post("http://localhost:3000/api/questions/question", formattedQuestions);
      alert("Questions inserted successfully!");
    } catch (error) {
      alert("Failed to insert questions.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold mb-4">Upload Excel File</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="mb-4 border p-2 rounded"
      />
      <button
        onClick={handleUpload}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Upload
      </button>
      <div className="mt-6 w-full max-w-4xl">
        <h3 className="text-xl font-bold mb-2">Extracted Questions:</h3>
        <ul>
          {questions.map((q, index) => (
            <li key={index} className="border p-3 mb-2 rounded bg-gray-100">
              <p className="font-semibold">{q.question}</p>
              <ul className="list-disc pl-5">
                <li>Option 1: {q.option1}</li>
                <li>Option 2: {q.option2}</li>
                <li>Option 3: {q.option3}</li>
                <li>Option 4: {q.option4}</li>
              </ul>
              <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
              <p><strong>Type:</strong> {q.queType}</p>
              <p><strong>Marks:</strong> {q.mark}</p>
              <p><strong>Negative Marking:</strong> {q.negativeMark ? "Yes" : "No"}</p>
              <p><strong>Subject:</strong> {q.subject}</p>
            </li>
          ))}
        </ul>
      </div>
      {questions.length > 0 && (
        <button
          onClick={handleInsertToDB}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Insert to Database
        </button>
      )}
    </div>
  );
}
