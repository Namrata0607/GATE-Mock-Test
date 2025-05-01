const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffauthController');
const { uploadQuestions } = require('../controllers/questionsController');
// console.log('uploadQuestions:', uploadQuestions);
const fileUploadMiddleware = require('../middlewares/fileUploadMiddleware');
const { staffAuthMiddleware } = require('../middlewares/staffAuthMiddleware');    


router.post('/staffsignin', staffController.staffLogin);
router.post('/staffsignup', staffController.staffSignup);

// protected routes
router.post('/staffLogout',staffAuthMiddleware, staffController.staffLogout);
router.get('/getSubjectsByBranch/:branch', staffAuthMiddleware, staffController.getSubjectsByBranch);
router.post('/setMarks/:branchId', staffAuthMiddleware, staffController.updateMarks);
router.get('/getStaffDetails', staffAuthMiddleware, staffController.getStaffDetails);
router.get('/getUploadedFiles', staffAuthMiddleware, staffController.fetchUploadedFiles);


router.post('/upload-questions',staffAuthMiddleware, fileUploadMiddleware.single('file'), uploadQuestions);
// .single('file') is used to handle single file uploads
// 'file' is the name of the file input field in the form

module.exports = router;