const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const register = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword, branch, mobile } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long and contain at least one number and one special character"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            return res.status(400).json({
                message: "Mobile number must be exactly 10 digits"
            });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ 
                message: "User already exists" 
            });
        }

        // Create and save the new user
        user = new User({ 
            name, 
            email, 
            password,
            confirmPassword, 
            branch, 
            mobile,
            attemptedTests: [],
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                name: user.name,
                email: user.email,
                branch: user.branch,
            }
        });
    } catch (error) {
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

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });
        console.log('Generated Token:', token); // Debug log
        res.json({
            token,
            role: "user",
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
      return res.status(200).json({
        message: "User logged out successfully!",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error logging out",
        error,
      });
    }
  };

const getUserDetails = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).populate('branch','branchName'); // Populate the branch field with branchName
        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }
        // console.log('user data:',user);
        res.json({
            name: user.name,
            branchId: user.branch._id, // Send branch ID
            branchName: user.branch.branchName, // Send branch name
            _id: user._id, // Send user ID
            email: user.email,
            attemptedTests: user.attemptedTests,
            mobile: user.mobile,
            avgMarks: user.avgMarks,
        });

        // console.log(user.branch),
        // console.log(user.name)
    } catch (error) {
        next(error);
    }
};

const editProfile = async (req, res, next) => {
    try {
        const { name, email, branch, mobile } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        user.name = name;
        user.email = email;
        user.branch = branch;
        user.mobile = mobile;

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                name: user.name,
                email: user.email,
                branch: user.branch,
                mobile: user.mobile,
            }
        });
    } catch (error) {
        next(error);
    }
};

const getUsersByBranch = async (req, res, next) => {
    try {
        const { branch } = req.params;
        const users = await User.find({ branch: branchId }).select("name avgMarks attemptedTests");
        // Map users to include attemptedTestsCount
        const usersWithAttemptedTestsCount = users.map(user => ({
            name: user.name,
            avgMarks: user.avgMarks,
            attemptedTestsCount: user.attemptedTests ? user.attemptedTests.length : 0
        }));
        res.json({ users: usersWithAttemptedTestsCount });

    } catch (error) {
        next(error);
    }
};

module.exports = { register , login , logout , getUserDetails , editProfile, getUsersByBranch };