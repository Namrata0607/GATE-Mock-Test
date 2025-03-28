const express = require('express');
const staffController = require('../controllers/staffauthController');
const router = express.Router();

router.post('/staffsignup', staffController.staffSignup);
router.post('/staffsignin', staffController.staffLogin);

module.exports = router;