const express = require('express');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { getUserDetails } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.register);
router.post('/signin', authController.login);
router.post('/logout', authController.logout); 

// Protected route to fetch user details
router.get('/userdetails', authMiddleware, getUserDetails); 

module.exports = router;