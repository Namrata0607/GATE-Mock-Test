const express = require('express');
const questionsController = require('../controllers/questionsController');  // Import the body controller
const router = express.Router();


// Route to get all projects
router.get('/', questionsController.getQuestions);

// // Route to get a project by ID
// router.get('/project/:id', authMiddleware(), projectController.getProjectById);

// Route to add a new project
// router.post('/question', questionsController.addQuestion);
router.post('/question', questionsController.uploadQuestions);

// Route to update a project by ID
// router.put('/project/:id', authMiddleware(), projectController.updateProject);

// // Route to delete a project by ID
// router.delete('/project/:id', authMiddleware(), projectController.deleteProject);

module.exports = router;