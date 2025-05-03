const express = require('express');
const router = express.Router();
const { getTestQuestions } = require('../controllers/testController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/getTestQuestions', authMiddleware, getTestQuestions);

module.exports = router;