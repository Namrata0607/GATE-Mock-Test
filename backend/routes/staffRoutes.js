const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffauthController');
const { uploadQuestions } = require('../controllers/questionsController');
// console.log('uploadQuestions:', uploadQuestions);
const fileUploadMiddleware = require('../middlewares/fileUploadMiddleware');    


router.post('/staffsignin', staffController.staffLogin);
router.post('/staffsignup', staffController.staffSignup);
router.post('/upload-questions', fileUploadMiddleware.single('file'), uploadQuestions);
// .single('file') is used to handle single file uploads
// 'file' is the name of the file input field in the form

module.exports = router;