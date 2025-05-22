const mongoose = require("mongoose"); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Staff = require('../models/staff');
const Subject = require('../models/subjects');
const Branch = require('../models/branch');

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
            role: "staff",
            staff: {
                id: staff._id,
                name: staff.name,
                email: staff.email
            }
        })
     }catch(error){
        next(error);
    }
}

const staffLogout = async (req, res) => {
    try {
      return res.status(200).json({
        message: "Staff logged out successfully!",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error logging out",
        error,
      });
    }
  };
  
const getStaffDetails = async (req, res, next) => {
    try {
        const staff = await Staff.findById(req.staff.staffId); 
        if (!staff) {
            return res.status(404).json({ 
                message: "Staff not found" 
            });
        }

        const response = {
            name: staff.name,
            email: staff.email,
        };

        // Include password if needed (e.g., for change password functionality)
        // if (req.query.includePassword === 'true') {
        //     response.password = staff.password;
        // }

        res.json(response);

    } catch (error) {
        console.error("Error fetching staff details:", error.message);
        next(error);
    }
};


const getSubjectsByBranch = async (req, res, next) => {
    try {
      const { branch } = req.params;
  
      // Find the ObjectId for the branch name
      const branchDoc = await Branch.findOne({ branchName: branch }); // Use branchName instead of name
      if (!branchDoc) {
        return res.status(404).json({ msg: "Branch not found" });
      }
  
      const branchId = branchDoc._id; // Get the ObjectId of the branch
  
      // Query the subjects collection using the branch ObjectId
      const subjects = await Subject.find({ branches: branchId });
  
      if (!subjects || subjects.length === 0) {
        return res.status(404).json({ msg: "No subjects found for this branch" });
      }
  
      res.status(200).json({ msg: "Subjects fetched successfully", subjects });
    } catch (error) {
      console.error("Error in getSubjectsByBranch:", error.message);
      res.status(500).json({ msg: "Internal Server Error", error: error.message });
    }
  };

const updateMarks = async (req, res, next) => {
    try {

      console.log("Branch ID:", req.params.branchId); // Debug log
      console.log("Marks Object:", req.body.marks); // Debug log

      const { branchId } = req.params; // Get branchId from the URL
      const { marks } = req.body; // Get marks from the request body
  
      // Loop through the marks object and update each subject
      for (const subjectId in marks) {
        const mark = marks[subjectId];
        console.log(`Updating subject ${subjectId} with marks: ${mark}`); // Debug log
        await Subject.findByIdAndUpdate(
          subjectId,
          { subjectMarks: mark },
          { new: true } // Return the updated document
        );
      }
  
      res.status(200).json({ msg: "Marks updated successfully!" });
    } catch (error) {
      console.error("Error updating marks:", error.message);
      res.status(500).json({ msg: "Internal Server Error", error: error.message });
      next(error);
    }
};

const editStaffProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const staffId = req.staff.staffId;

        // Find the staff member by ID
        const staff = await Staff.findById(staffId);
        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }

        // Update the staff member's details
        staff.name = name || staff.name;
        staff.email = email || staff.email;

        await staff.save();

        res.status(200).json({ message: "Profile updated successfully", staff });
    } catch (error) {
        console.error("Error updating profile:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

// const fetchUploadedFiles = async (req, res, next) => {
//     try {
//       const staff = await Staff.findById(req.staff.staffId);
//       if (!staff) {
//         return res.status(404).json({ message: "Staff not found" });
//       }
//       res.status(200).json(staff.uploadedFiles);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching uploaded files", error });
//     }
// }

module.exports = { staffSignup, staffLogin, staffLogout, getStaffDetails, 
                  getSubjectsByBranch, updateMarks, editStaffProfile };