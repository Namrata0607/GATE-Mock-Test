const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res, next) => {
    try{
        const { name, email, password ,confirmPassword, branch, mobile } = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        let user = await User.findOne({ email });
//findOne() is a mongoose method that returns the first document that matches the query

        if(user){
            return res.status(400).json({ 
                message: "User already exists" 
            });
        };
        
        user = new User({ 
            name, 
            email, 
            password,
            confirmPassword, 
            branch, 
            mobile,
            attemptedTests: null
        });
        await user.save();

        res.status(201).json({
            message: "User registered successfully"
        });
    }catch(error){
        next(error);
    }
};

const login = async (req, res ,next) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if(!user){
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({
            token,
            user : {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    }catch(error){
        next(error);
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("token"); // Clear JWT token from cookies
        return res.status(200).json({ 
            message: "User logged out successfully!" 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: "Error logging out", 
            error 
        });
    }
};

module.exports = { register , login , logout };