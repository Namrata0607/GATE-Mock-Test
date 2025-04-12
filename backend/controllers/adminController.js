const {Admin, Question} = require("../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const adminSignup = async (req, res, next) => {
    try{
        const { email, password, confirmPassword, branch } = req.body;
        if(password !== confirmPassword){
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }
        let admin = await Admin.findOne({ email });
        if(admin){
            return res.status(400).json({
                message: "Admin already exists"
            });
        }

        admin = new Admin({ email, password, branch });
        await admin.save();
        res.status(201).json({
            message: "Admin registered successfully"
        });

    }catch(error){
        next(error);
    }
};

const adminLogin = async (req, res, next) => {
    try{
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: "Please provide email and password"
            });
        }
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ 
                message: "Invalid credentials" 
            });
        }
        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch){
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({
            message: "Admin logged in successfully",
            token,
            admin: {
                id: admin._id,
                email: admin.email
            }
        });
        
    }
    catch(error){
        next(error);
    }
};

// const addQuestion = async (req, res, next) => {
//     try{
//         const { email, branch, question, options, correctAnswer, quetype, marks, negativeMark } = req.body;

//         if (!email || !branch || !question || !options || options.length !== 4 || 
//             !correctAnswer || !quetype || marks === undefined, negativeMark === undefined) {
//             return res.status(400).json({ 
//                 message: "All fields are required" 
//             });
//         }
//         const admin = await Admin.findOne({ email });
//         if (!admin) {
//             return res.status(401).json({ 
//                 message: "Invalid credentials" 
//             });
//         }
//         if(admin.branch !== branch){
//             return res.status(401).json({ 
//                 message: "You are not authorized to add questions for this branch" 
//             });
//         }

//         const newQuestion = {
//             branch,
//             question,
//             options,
//             correctAnswer,
//             quetype,
//             marks,
//             negativeMark,
//         };

//         admin.questions.push( newQuestion );
//         await admin.save();
//         res.status(201).json({
//             message: "Question added successfully"
//         });
//     }catch(error){
//         next(error);
//     }
// };

// const getQuestions = async (req, res, next) => {
//     try{
//         console.log("Request Body:", req.body);
//         const { branch } = req.body;
//         if (!branch) {
//             return res.status(400).json({ 
//                 message: "Branch is required" 
//             });
//         }
//         const data = await Admin.find({ branch });
        
//         console.log("Database Response:", data); // Debugging log

//         if (!data) {
//             return res.status(404).json({ message: "No questions found for this branch" });
//         }
//         console.log(data.questions)
//         res.status(200).json(data[0].questions);
//     }catch(error){
//         next(error);
//     }
// };

module.exports = { adminSignup, adminLogin };