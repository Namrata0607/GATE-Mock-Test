// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs'); // Ensure bcrypt is imported

// // Define Questions Schema
// const questionsSchema = new mongoose.Schema({
//     branch: {
//         type: String,
//         enum: ["Computer Science and Information Technology", "Data Science and Artificial Intelligence",
//             "Civil Engineering", "Electronics and Communication Engineering", "Mechanical Engineering"],
//         required: true
//     },
//     question: {
//         type: String,
//         required: true
//     },
//     options: [{
//         type: String,
//         required: true
//     }], // Array of 4 options
//     correctAnswer: {
//         type: String,
//         required: true
//     }, // Store the correct answer
//     quetype: {
//         type: String,
//         enum: ["MCQ", "MSQ", "NAT"],
//         required: true
//     },
//     marks: {
//         type: Number,
//         required: true
//     },
//     negativeMark: {
//         type: Boolean,
//         default: false
//     },

// }, { timestamps: true });

// // Define Admin Schema
// const adminSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     branch: {
//         type: String,
//         enum: ["Computer Science and Information Technology", "Data Science and Artificial Intelligence",
//             "Civil Engineering", "Electronics and Communication Engineering", "Mechanical Engineering"],
//     }, // Admin selects a branch
//     questions: [questionsSchema], // Questions for the branch
// }, { timestamps: true });

// // Hash Password Before Saving
// adminSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//         return next();
//     }
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });

// // Export Models
// console.log(mongoose.models);
// const Admin = mongoose.model('Admin', adminSchema);
// const Question = mongoose.models.Question || mongoose.model('Question', questionsSchema);

// module.exports = { Admin, Question };




import React, { useState } from "react";
import * as XLSX from "xlsx";

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
    </div>
  );
}
