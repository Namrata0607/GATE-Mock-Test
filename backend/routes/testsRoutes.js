const express = require('express');
const router = express.Router();
const { uploadTests, submitUserTest,evaluateTest,getTestAnalysis } = require('../controllers/testController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/uploadTest', authMiddleware, uploadTests);
router.post('/submitTest', authMiddleware, submitUserTest);
router.post('/evaluateTest', authMiddleware, evaluateTest);
router.post('/testAnalysis', authMiddleware, getTestAnalysis);



module.exports = router;