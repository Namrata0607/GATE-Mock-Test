const express = require('express');
const router = express.Router();
const { uploadTests, submitUserTest } = require('../controllers/testController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/uploadTest', authMiddleware, uploadTests);
router.post('/submitTest', authMiddleware, submitUserTest);

module.exports = router;