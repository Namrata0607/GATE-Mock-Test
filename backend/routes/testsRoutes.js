const express = require('express');
const router = express.Router();
const { uploadTests, submitUserTest,evaluateTest,getTestAnalysis, avgMarks, getBranchRank } = require('../controllers/testController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/uploadTest', authMiddleware, uploadTests);
router.post('/submitTest', authMiddleware, submitUserTest);
router.post('/evaluateTest', authMiddleware, evaluateTest);
router.post('/testAnalysis', authMiddleware, getTestAnalysis);
router.get('/avgMarks', authMiddleware, avgMarks);
router.get('/branchRank', authMiddleware, getBranchRank);


module.exports = router;