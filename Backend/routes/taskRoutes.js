const express = require('express');
const { protect, adminOnly} = require('../middlewares/authMiddleware');
const { getTasks, getTasksById, createNewTask, updateTask, deleteTask } = require('../controllers/taskController');

const router = express.Router();

// Task Routes
router.get('/', protect, getTasks); // get all tasks (Admin : all, User: assigned)
router.get('/:id',protect, getTasksById); // get tasks by ID
router.post('/', protect, adminOnly, createNewTask); // create a task (admin only);
router.put('/:id', protect, updateTask); // update task details
//router.put('/:id/status', protect, updateTaskStatus); //update task status 
// the above status should be auto completed based on child status
router.delete('/:id', protect, adminOnly, deleteTask); // delete the task.

module.exports = router;
