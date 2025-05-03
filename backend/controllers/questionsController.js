const XLSX = require('xlsx');
const Branch = require('../models/branch');
const Subject = require('../models/subjects');
const Question = require('../models/questions');

const processExcelRow = (row) => {
    const { correctAnswer, queType } = row;

    let processedAnswer;
    if (queType === "MCQ" || queType === "NAT") {
        processedAnswer = [correctAnswer]; // Single-element array
    } else if (queType === "MSQ") {
        // Ensure correctAnswer is always an array, even if it contains only one value
        processedAnswer = correctAnswer.includes(",")
            ? correctAnswer.split(",").map((ans) => ans.trim()) // Split into an array and trim spaces
            : [correctAnswer.trim()]; // Single value wrapped in an array
    }

    return processedAnswer;
};


const uploadQuestions = async (req, res, next) => {
    try {
        console.log("Uploaded File:", req.file); // Log the uploaded file
        console.log("Request Body:", req.body); // Log the raw request body

        // Validate uploaded file
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Parse branches
        let selectedBranchNames = req.body.selectedBranches;

        // Handle both string and JSON array formats
        if (typeof selectedBranchNames === 'string') {
            try {
                if (selectedBranchNames.startsWith('[') && selectedBranchNames.endsWith(']')) {
                    selectedBranchNames = JSON.parse(selectedBranchNames); // Parse JSON array string
                } else {
                    selectedBranchNames = [selectedBranchNames]; // Treat as single branch name
                }
            } catch (error) {
                console.error("Error parsing branches:", error);
                return res.status(400).json({ message: "Invalid branches format in request body" });
            }
        }

        if (!Array.isArray(selectedBranchNames) || selectedBranchNames.length === 0) {
            console.error("No branches provided:", selectedBranchNames);
            return res.status(400).json({ message: "No branches provided in the request body" });
        }
        console.log("Parsed Branches:", selectedBranchNames);

        // Read the Excel file
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ message: "The uploaded Excel file is empty or invalid" });
        }
        console.log("Excel Data:", data);

        // Debug: Check the "Computer Networks" subject and its questions
const subject = await Subject.findOne({ subjectName: "Computer Networks" }).populate('questions');
if (!subject) {
    console.error("Subject not found: Computer Networks");
} else {
    console.log("Questions for Computer Networks:", subject.questions.length);
    console.log("Questions:", subject.questions); // Log the actual questions if needed
}

        // Fetch or create branches
        let existingBranches = await Branch.find({ branchName: { $in: selectedBranchNames } });
        existingBranches = existingBranches || [];
        const existingBranchNames = existingBranches.map(branch => branch.branchName);

        const branchesToCreate = selectedBranchNames.filter(name => !existingBranchNames.includes(name));
        const newBranches = await Branch.insertMany(
            branchesToCreate.map(name => ({ branchName: name, subjects: [] }))
        );

        const allBranches = [...existingBranches, ...newBranches];

        // Process each row in the Excel file
        for (const row of data) {
            const {
                subjectName,
                question,
                queImg,
                option1,
                option2,
                option3,
                option4,
                correctAnswer,
                queType,
                negativeMark,
                mark
            } = row;

            // Validate required fields
            if (!subjectName || !question || !queType || !mark) {
                console.error("Invalid row data:", row);
                return res.status(400).json({ message: "Invalid data in Excel file. Missing required fields." });
            }

            const options = [option1, option2, option3, option4].filter(opt => opt && opt.trim() !== "");

            // Process the correctAnswer based on queType
            const processedAnswer = processExcelRow({ correctAnswer, queType });

            // Subject logic
            let subject = await Subject.findOne({ subjectName: subjectName });

            if (!subject) {
                subject = await Subject.create({
                    subjectName: subjectName,
                    branches: allBranches.map(b => b._id),
                    questions: []
                });
                console.log(`Subject created: ${subjectName}`);
            } else {
                if (!subject.branches) subject.branches = [];
                for (const branch of allBranches) {
                    if (!subject.branches.includes(branch._id)) {
                        subject.branches.push(branch._id);
                    }
                }
                await subject.save();
                console.log(`Subject updated with branches: ${subjectName}, Branch IDs: ${subject.branches}`);
            }

            // Check if the question already exists
            const existingQuestion = await Question.findOne({
                question,
                queType,
                subject: subject._id
            });

            if (existingQuestion) {
                console.log(`Skipping duplicate question: ${question}`);
                continue;
            }

            // Handle queImg: Set to null if blank
            const image = queImg && queImg.trim() !== "" ? queImg : null;

            // Create the question
            const newQuestion = await Question.create({
                question,
                queImg: image,
                options,
                correctAnswer: processedAnswer,
                queType,
                negativeMark: String(negativeMark).toLowerCase() === 'true',
                mark,
                subject: subject._id,
            });
            console.log(`Question created: ${newQuestion._id}, Subject: ${subjectName}`);

            subject.questions.push(newQuestion._id);
            await subject.save();
            console.log(`Question added to subject: ${subjectName}, Question ID: ${newQuestion._id}`);
        }

        res.status(200).json({ message: "Questions uploaded successfully!" });

    } catch (error) {
        console.error("Error in uploadQuestions controller:", error);
        res.status(500).json({ message: "Upload failed", error: error.message });
    }
};

module.exports = { uploadQuestions };