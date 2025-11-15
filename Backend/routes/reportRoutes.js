const express = require('express');
const { protect, adminOnly} = require('../middlewares/authMiddleware');
const { exportProjectsReport, exportUserReports } = require('../controllers/reportController');

const router  = express.Router();

router.get('/export/projects', protect, adminOnly, exportProjectsReport); // export all projects and tasks as excel/pdf
router.get('/export/users', protect, adminOnly, exportUserReports); // export user-task report

module.exports = router;


