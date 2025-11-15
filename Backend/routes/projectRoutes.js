const express = require('express');
const { protect, adminOnly} = require('../middlewares/authMiddleware');
const { createNewProject, getDashboardData, getUserDashboardData, getProjects, getProjectsById, updateProject, updateProjectStatus, deleteProject, updateProjectStatusAndProgress } = require('../controllers/ProjectController');

const router = express.Router();

// project routes
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get('/', protect, getProjects); // get all projects (Admin : all, User: assigned)
router.get('/:id',protect, getProjectsById); // get projects by ID
router.post('/', protect, adminOnly, createNewProject); // create a project (admin only);
router.put('/:id', protect, adminOnly, updateProject); // update project details
router.put('/:id/status', protect,adminOnly, updateProjectStatusAndProgress); //update project status 
// the above status should be auto completed based on child status
router.delete('/:id', protect, adminOnly, deleteProject); // delete the project.

module.exports = router;