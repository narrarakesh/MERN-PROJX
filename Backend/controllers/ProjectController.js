const Project = require('../models/Project');
const Task = require('../models/Task');


//@ desc Get all projects (admin : createdby, user: only assigned)
// @route GET api/projects/
// @ access private

const getProjects = async (req, res)=>{
    try {
        const {status} = req.query;
        let filter ={};
        if(status){
            filter.status = status;
        }

        let projects;
        if(req.user.role === 'Admin'){
            projects = await Project.find({...filter, createdBy: req.user._id}).populate(
                "members",
                "name email profileImageUrl"
            ).sort({createdAt: -1});
        }else{
            projects = await Project.find({...filter, members: req.user._id}).populate(
                "members",
                "name email profileImageUrl"
            ).sort({createdAt: -1});
        }

        // Loop through projects and attach task counts
        const projectsWithTaskCounts = await Promise.all(
            projects.map(async (project) => {
                const [totalTasks, completedTasks] = await Promise.all([
                    Task.countDocuments({ projectId: project._id }),
                    Task.countDocuments({ projectId: project._id, status: 'Completed' })
                ]);

                return {
                    ...project.toObject(),
                    totalTasks,
                    completedTasks
                };
            })
        );

        // Build base filter condition based on role
        const baseCondition = req.user.role === 'Admin'
        ? { createdBy: req.user._id } // Admin sees their own created projects
        : { members: req.user._id };  // Users see projects where they are members

        // Count queries
        const totalProjects = await Project.countDocuments({
        ...baseCondition,
        });

        const pendingProjects = await Project.countDocuments({
        ...filter,
        ...baseCondition,
        status: 'Yet to Start',
        });

        const completedProjects = await Project.countDocuments({
        ...filter,
        ...baseCondition,
        status: 'Completed',
        });

        const inProgressProjects = await Project.countDocuments({
        ...filter,
        ...baseCondition,
        status: 'In Progress',
        });

        res.status(200).json({ projects : projectsWithTaskCounts,
            statusSummary: {
                all: totalProjects,
                pendingProjects,
                completedProjects,
                inProgressProjects
            }
         });
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
}

// @desc GET project By ID 
// @route GET api/projetcs/:id
// @access private

const getProjectsById = async (req, res)=>{
    try {
        const project = await Project.findById(req.params.id).populate('members','name email profileImageUrl');
        if(!project){
            return res.status(400).json({message: 'Project Not Found'});
        }

        const tasks = await Task.find({ projectId: req.params.id }).populate('assignedTo','name email profileImageUrl').sort({ startDate: 1 });


        res.status(200).json({project, tasks});
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
}

// @desc CREATE new project
// @route POST api/projects/
// @access private (admin only)

const createNewProject = async (req, res)=>{
    try {
        const {
            name,
            description,
            priority,
            startDate,
            endDate,
            members,
            attachments
        } = req.body;

        if(members && !Array.isArray(members)){
           return res.status(400).json({messaage: 'Project Members should be an array of user IDs'});
        }

        const newProject = await Project.create({
            name,
            description,
            priority,
            startDate,
            endDate,
            createdBy: req.user._id,
            members,
            attachments
        })

        res.status(201).json({message: 'Project created successfully', newProject});

    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
}

// @desc update project details
// @route PUT api/projects/:id
// @access private (admin only)

const updateProject = async (req, res)=>{
    try {
        const project = await Project.findById(req.params.id);
        if(!project) return res.status(400).json({message: 'Project Not Found'});

        project.name = req.body.name || project.name;
        project.description = req.body.description || project.description;
        project.priority = req.body.priority || project.priority;
        project.startDate = req.body.startDate || project.startDate;
        project.endDate = req.body.endDate || project.endDate;
        project.attachments = req.body.attachments  || project.attachments;

        if(req.body.members){
            if(req.body.members && !Array.isArray(req.body.members)){
                return res.status(400).json({
                    message: 'Members must be an array of User IDs'
                });
            }
        }

        project.members = req.body.members || project.members;

        const updatedProject =await project.save();
        res.status(200).json({message: 'Project updated successfully', updatedProject});
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
}

// @desc DELETE project
// @route DELETE api/projects/:id
// @access privte (admin only)

const deleteProject = async (req, res)=>{
    try {
        const projectId = req.params.id;
        const deletedTasks = await Task.deleteMany({projectId});
        const deletedProject = await Project.findByIdAndDelete(projectId);
        if(!deletedProject){
            return res.status(400).json({message: 'Project Not Found'});
        }
        res.status(200).json({message: 'Project deleted successfully', deletedProject});
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
}

// @desc update project status
// @route PUT api/projects/:id/status
// @access privte (admin only)

const updateProjectStatusAndProgress = async (req, res)=>{
    try {
        const project = await Project.findById(req.params.id);
        if(!project) return res.status(400).json({message: 'Project Not Found'});

        const member = project.members.some((userID)=> userID.toString()=== req.user._id.toString());
        if(!member && req.user.role !== 'Admin'){
            return res.status(403).json({message: 'Not authorized'});
        }

        const totalTasks = await Task.countDocuments({projectId: req.params.id});
        const inprogressCount = await Task.countDocuments({status: 'In Progress',projectId: req.params.id});
        const completedCount = await Task.countDocuments({status: 'Completed',projectId: req.params.id});

        if (totalTasks === 0) {
            project.status = "Yet To Start";
        } else if (completedCount === totalTasks) {
            project.status = "Completed";
        } else if (inprogressCount > 0 || completedCount > 0) {
            project.status = "In Progress";
        } else {
            project.status = "Yet To Start";
        }
        
        project.progress = totalTasks === 0 ? 0 : Math.ceil((completedCount / totalTasks) * 100);

        await project.save()
        res.json({message: "Project status updated", project});
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
}

// @desc GET  dashboard-data
// @route POST api/dashboard-data/
// @access privte

const getDashboardData = async (req, res)=>{
    try {
        const adminId = req.user._id;


        //ensure all the statuses are included
        const projectStatus = ['Yet to Start', 'In Progress','Completed'];

        // const totalProjects = await Project.countDocuments({ createdBy: adminId });
        // const pendingProjects = await Project.countDocuments({ status: 'Yet to Start', createdBy: adminId });
        // const completedProjects = await Project.countDocuments({ status: 'Completed', createdBy: adminId });
        // const inProgressProjects = await Project.countDocuments({ status: 'In Progress', createdBy: adminId });

        const count = await Project.aggregate([
            {
                $match: { createdBy: adminId}
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum : 1}
                }
            }
        ])

        const totalProjects = count.reduce((sum, item) => sum + item.count, 0);

        const projectStats = {};
        projectStatus.forEach(status => {
            projectStats[status] = count.find(c => c._id === status)?.count || 0;
        });

        //ensure all the statuses are included
        const tasKStatus = ['Todo', 'In Progress','Completed'];

        const totalTasks = await Task.countDocuments({ createdBy: adminId });
        const pendingTasks = await Task.countDocuments({ status: 'Todo', createdBy: adminId });
        const completedTasks = await Task.countDocuments({ status: 'Completed', createdBy: adminId });
        const inProgressTasks = await Task.countDocuments({ status: 'In Progress', createdBy: adminId });
        const overdueTasks = await Task.countDocuments({
        status: { $ne: 'Completed' },
        dueDate: { $lte: new Date() },
        createdBy: adminId
        });

        
        const projectDistributionRaw = await Project.aggregate([
            {
                $match:{
                    createdBy: adminId
                }
            },
            {
                $group: {
                    _id:"$status",
                    count: { $sum : 1},
                }
            }
        ]);
        const projectDistribution = projectStatus.reduce((acc, status)=>{
            const formattedKey = status.replace(/\s+/g,""); // remove spaces for responsive keys
            acc[formattedKey]= projectDistributionRaw.find((item)=> item._id === status)?.count || 0;
            return acc;
        },{});
        projectDistribution['All']= totalProjects; // Add total count to projectDistribution

        // Get all project IDs created by this admin and filter taskdistribution and priority distributuion
        const adminProjectIds = await Project.find({ createdBy: adminId }).distinct('_id');

        //ensure all the statuses are included
        const taskStatus = ['Todo', 'In Progress','Completed'];
        const taskDistributionRaw = await Task.aggregate([
            { $match: { projectId: { $in: adminProjectIds } } },
            {
                $group: {
                    _id:"$status",
                    count: { $sum : 1},
                }
            }
        ]);

        const taskDistribution = taskStatus.reduce((acc, status)=>{
            const formattedKey = status.replace(/\s+/g,""); // remove spaces for responsive keys
            acc[formattedKey]= taskDistributionRaw.find((item)=> item._id === status)?.count || 0;
            return acc;
        },{});
        taskDistribution['All']= totalTasks; // Add total count to taskDistribution

        //ensure all the priorities are included
        const taskPriorities = ['Low', 'Medium','High'];
        const priorityDistributionRaw = await Task.aggregate([
            { $match: { projectId: { $in: adminProjectIds } } },
            {
                $group: {
                    _id:"$priority",
                    count: { $sum : 1},
                }
            }
        ]);

        const priorityDistribution = taskPriorities.reduce((acc, priority)=>{ // to convert arary of objects to single objects
            acc[priority]= priorityDistributionRaw.find((item)=> item._id === priority)?.count || 0;
            return acc;
        },{});
        
        // fetch recent 10 tasks;
        const recentTasks = await Task.find({ projectId : {$in : adminProjectIds} }).sort({createdAt: -1}).limit(10).populate('projectId','name').populate('assignedTo','name email profileImageUrl');

        res.status(200).json({ statistics: {
            totalProjects,
            pendingProjects: projectStats['Yet to Start'],
            completedProjects: projectStats['Completed'],
            inProgressProjects:projectStats['In Progress'],
            totalTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
            overdueTasks,
        },
        charts: {
            taskDistribution,
            projectDistribution,
            priorityDistribution
        },
        recentTasks
        })

        
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
}

// @desc GET  dashboard-user-data
// @route POST api/dashboard-data/
// @access privte

const getUserDashboardData = async (req, res)=>{
    try {
        const userID = req.user._id;
        const totalProjects = await Project.countDocuments({members: userID});
        const pendingProjects = await Project.countDocuments({members: userID, status : 'Yet to Start'});
        const completedProjects = await Project.countDocuments({members: userID, status : 'Completed'});
        const inProgressProjects = await Project.countDocuments({members: userID, status : 'Inprogress'});

        const totalTasks = await Task.countDocuments({assignedTo: userID});
        const pendingTasks  = await  Task.countDocuments({assignedTo: userID, status: 'Todo'});
        const completedTasks  = await  Task.countDocuments({assignedTo: userID, status: 'Completed'});
        const inProgressTasks  = await  Task.countDocuments({assignedTo: userID, status: 'Inprogress'});
        const overdueTasks = await Task.countDocuments({
            assignedTo: userID,
            status: { $ne : 'Completed'},
            dueDate: { $lte : new Date()},
        });

        //ensure all the statuses are included
        const projectStatus = ['Yet to Start', 'In Progress','Completed'];
        const projectDistributionRaw = await Project.aggregate([
            {
                $match: {
                members: userID // only include projects where the current user is a member
                }
            },
            {
                $group: {
                    _id:"$status",
                    count: { $sum : 1},
                }
            }
        ]);
        const projectDistribution = projectStatus.reduce((acc, status)=>{
            const formattedKey = status.replace(/\s+/g,""); // remove spaces for responsive keys
            acc[formattedKey]= projectDistributionRaw.find((item)=> item._id === status)?.count || 0;
            return acc;
        },{});
        projectDistribution['All']= totalProjects; // Add total count to projectDistribution

        //ensure all the statuses are included
        const taskStatus = ['Todo', 'In Progress','Completed'];
        const taskDistributionRaw = await Task.aggregate([
            {
                $match: {assignedTo: userID}
            },
            {
                $group: {
                    _id:"$status",
                    count: { $sum : 1},
                }
            }
        ]);

        const taskDistribution = taskStatus.reduce((acc, status)=>{
            const formattedKey = status.replace(/\s+/g,""); // remove spaces for responsive keys
            acc[formattedKey]= taskDistributionRaw.find((item)=> item._id === status)?.count || 0;
            return acc;
        },{});
        taskDistribution['All']= totalTasks; // Add total count to taskDistribution

        //ensure all the priorities are included
        const taskPriorities = ['Low', 'Medium','High'];
        const priorityDistributionRaw = await Task.aggregate([
            {
                $match: {assignedTo: userID}
            },
            {
                $group: {
                    _id:"$priority",
                    count: { $sum : 1},
                }
            }
        ]);

        const priorityDistribution = taskPriorities.reduce((acc, priority)=>{
            acc[priority]= priorityDistributionRaw.find((item)=> item._id === priority)?.count || 0;
            return acc;
        },{});
        
        // fetch recent 10 tasks;
        const recentTasks = await Task.find({assignedTo: userID}).sort({createdAt: -1}).limit(10).populate('projectId','name').populate('assignedTo','name email profileImageUrl');

        res.status(200).json({ statistics: {
            totalProjects,
            pendingProjects,
            completedProjects,
            inProgressProjects,
            totalTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
            overdueTasks,
        },
        charts: {
            taskDistribution,
            projectDistribution,
            priorityDistribution
        },
        recentTasks
        })

    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
}

module.exports = {
    getProjects,
    getProjectsById,
    createNewProject,
    updateProject,
    deleteProject,
    updateProjectStatusAndProgress,
    getDashboardData,
    getUserDashboardData
}