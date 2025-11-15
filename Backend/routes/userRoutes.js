const express = require('express');
const { adminOnly, protect } = require('../middlewares/authMiddleware');
const { getUsers, getUserById, deleteUser, getUsersByAdmin } = require('../controllers/userController');

const router = express.Router();

// User Management Routes

router.get('/', protect, getUsers); // get all users (admin only);
router.get('/:id', protect, getUserById); //Get a specific user
router.delete(':id', protect, adminOnly, deleteUser); // Delete User (admin only);
router.get('/admin',protect, adminOnly, getUsersByAdmin);

module.exports = router;