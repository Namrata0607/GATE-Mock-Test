const Questions = require('../models/questions')
// const dotenv = require('dotenv');
// const { validateInput } = require("../utils/validateInput");
// const z = require("zod");


// Load environment variables
// dotenv.config();

// const projectSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String
//     },
//     status: {
//         type: String,
//         required: true
//     },
//     date: {
//         type: Date,
//         required: true
//     },
// }, { timestamps: true });

// Zod schemas
// const projectSchema = z.object({
//     title: z.string().min(3, "Title must contain at least 3 characters"),
//     description: z.string().min(5, "Description must contain at least 5 characters"),
//     status: z.enum(["Ongoing", "Completed"], "Status must be either 'Ongoing' or 'Completed'"),
//     date: z.date()
// });

//add new Project
const addQuestion = async (req, res, next) => {
    try {
        console.log(req.body);
        const { question, options, correctAnswer } = req.body;
        if(!question || !options || !correctAnswer){
            res.status(401).send("Invalid inputs");
            return 
        }
        // Save project
        const questions = new Questions({ question, options, correctAnswer });
        await questions.save();

        res.status(201).json({ message: "Question added successfully" });
    } catch (error) {
        next(error);
    }
};

// Get all projects
const getQuestions = async (req, res, next) => {
    try {
        const questions = await Questions.find({});
        res.status(200).json({ questions });
    } catch (error) {
        next(error);
    }
}

// Get project by ID
// const getProjectById = async (req, res, next) => {
//     try {
//         const project = await Project.findById(req.params.id);
//         if (!project) {
//             return res.status(404).json({ error: 'Project not found' });
//         }
//         res.status(200).json({ project });
//     }
//     catch (error) {
//         next(error);
//     }
// };


// // Update project by ID
// const updateProject = async (req, res, next) => {
//     try {

//         if (typeof req.body.date === 'string') {
//             req.body.date = new Date(req.body.date);
//         }
//         // Validate input
//         const { title, description, status, date } = validateInput(projectSchema, req.body);

//         // Find project by ID and update
//         const project = await Project.findByIdAndUpdate(req.params.id, { title, description, status, date }, { new: true });
//         if (!project) {
//             return res.status(404).json({ error: 'Project not found' });
//         }

//         res.status(200).json({ message: 'Project updated successfully' });
//     } catch (error) {
//         next(error);
//     }
// };

// // Delete project by ID
// const deleteProject = async (req, res, next) => {
//     try {
//         const project = await Project.findByIdAndDelete(req.params.id);
//         if (!project) {
//             return res.status(404).json({ error: 'Project not found' });
//         }
//         res.status(200).json({ message: 'Project deleted successfully' });
//     } catch (error) {
//         next(error);
//     }
// };


module.exports = { addQuestion, getQuestions };