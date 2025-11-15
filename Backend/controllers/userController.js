const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const Project = require('../models/Project');


// @desc Get all users (admin only)
// @route Get/api/users/
// @access private (admin)

const getUsers = async (req, res)=>{
    try {
        const users = await User.find({role: 'Member'}).select('-password');

        // Add task counts to each user


        const userWithCounts = await Promise.all(users.map (async (user)=>{

            const pendingTasks = await Task.countDocuments({assignedTo: user._id, status: 'Todo'});
            const inProgressTasks = await Task.countDocuments({assignedTo: user._id, status: 'In Progress'});
            const completedTasks = await Task.countDocuments({assignedTo: user._id, status: 'Completed'});

            // project counts for a user

            // Project counts
            const totalProjects = await Project.countDocuments({ members: user._id });
            const completedProjects = await Project.countDocuments({ members: user._id, status: 'Completed' });
            const inProgressProjects = await Project.countDocuments({ members: user._id, status: 'In Progress' });
            const pendingProjects = await Project.countDocuments({ members: user._id, status: 'Yet to Start' });

            return {
                ...user._doc,
                pendingTasks,
                inProgressTasks,
                completedTasks,
                totalProjects,
                inProgressProjects,
                completedProjects,
                pendingProjects
            };
        }));

        res.json(userWithCounts);
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message});
    }
}

// @desc GET user by ID
// @route GET /api/users/:id
// @access private

const getUserById = async (req, res)=>{
    try {
        const user = await User.findById(req.params.id).select('-password');
        if(!user){
            return res.status(404).json({message: 'User Not Found'});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message});
    }
}

// @desc DELETE user by ID
// @route DELETE /api/users/:id
// @access private (admin only)

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc get users (admin calssified)
// @route get /api/users/admin
// @access private (admin only)
const getUsersByAdmin = async (req, res)=>{
    try {

        const adminId = req.user._id;
        // Get all projects created by this admin
        const adminProjects = await Project.find({ createdBy: adminId });
        const memberIds = [
        ...new Set(adminProjects.flatMap((project) => project.members)),
        ];

        // Fetch only those users who are part of these projects
        const users = await User.find({
        _id: { $in: memberIds },
        role: 'Member',
        }).select('-password');

        const userWithCounts = await Promise.all(users.map (async (user)=>{

            const pendingTasks = await Task.countDocuments({assignedTo: user._id, status: 'Todo'});
            const inProgressTasks = await Task.countDocuments({assignedTo: user._id, status: 'In Progress'});
            const completedTasks = await Task.countDocuments({assignedTo: user._id, status: 'Completed'});

            // project counts for a user

            // Project counts
            const totalProjects = await Project.countDocuments({ members: user._id });
            const completedProjects = await Project.countDocuments({ members: user._id, status: 'Completed' });
            const inProgressProjects = await Project.countDocuments({ members: user._id, status: 'In Progress' });
            const pendingProjects = await Project.countDocuments({ members: user._id, status: 'Yet to Start' });

            return {
                ...user._doc,
                pendingTasks,
                inProgressTasks,
                completedTasks,
                totalProjects,
                inProgressProjects,
                completedProjects,
                pendingProjects
            };
        }));

        res.json(userWithCounts);
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message});
    }
}


module.exports = {getUsers, getUserById, deleteUser, getUsersByAdmin};