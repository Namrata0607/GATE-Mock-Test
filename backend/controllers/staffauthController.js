const Staff = require('../models/staff');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const staffSignup = async (req, res, next) => {
    try{
        const { name, email, password , confirmPassword } = req.body;
        if(password !== confirmPassword){
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }
        let staff = await Staff.findOne({ email });
        if(staff){
            return res.status(400).json({
                msg: "Staff already exists"
            })
        }
        staff = new Staff({ name, email, password });
        await staff.save();
        res.status(201).json({
            msg: "Staff registered successfully"
        })
    }catch(error){
        next(error);
    }
}

const staffLogin = async (req, res, next) => {
    try{
        const { email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                msg: "Please provide email and password"
            });
        }
        const staff = await Staff.findOne({ email });
        if(!staff){
            return res.status(401).json({
                msg: "Invalid credentials"
            });
        }
        const isMatch = await bcrypt.compare(password, staff.password);
        if(!isMatch){
            return res.status(401).json({
                msg: "Invalid credentials"
            });
        }

        const token = jwt.sign({ staffId: staff._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({
            msg: "Staff logged in successfully",
            token,
            staff: {
                id: staff._id,
                email: staff.email
            }
        })
     }catch(error){
        next(error);
    }
}

module.exports = { staffSignup, staffLogin }