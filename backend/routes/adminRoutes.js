const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();

router.post("/adminSignup", adminController.adminSignup);
router.post("/adminLogin", adminController.adminLogin);
// router.post("/addquestion", adminController.addQuestion);
// router.post("/getquestions", adminController.getQuestions);

module.exports = router;