const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { getUserDetails } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/signup', authController.register);
router.post('/signin', authController.login);
router.post('/logout', authController.logout); 

// Protected route to fetch user details
router.get('/userdetails', authMiddleware, getUserDetails); 
router.put('/editprofile', authMiddleware, authController.editProfile); // Protected route to edit user profile

module.exports = router;