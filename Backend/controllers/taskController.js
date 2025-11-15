const Project = require('../models/Project');
const Task = require('../models/Task');
const { updateProjectStatusAndProgress } = require('./ProjectController');

//@ desc Get all tasks (admin : all, user: only assigned)
// @route GET api/tasks/
// @ access private

const getTasks = async (req, res)=>{
    try {

        let tasks;
        if(req.user.role === 'Admin'){
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        }else{
            tasks = await Project.find({...filter, assignedTo: req.user._id}).populate(
                "assignedTo",
                "name email profileImageUrl"
            )
        }

        // need to add tasks related data here to find to total pending tasks and completed and inprogress tassks (1:08:00)
        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
}

// @desc GET project By ID 
// @route GET api/tasks/:id
// @access private

const getTasksById = async (req, res)=>{
    try {
        const task = await Task.findById(req.params.id);
        if(!task){
            return res.status(400).json({message: 'Task Not Found'});
        }
        res.status(200).json({task});
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
}


// @desc DELETE tasks
// @route DELETE api/tasks/:id
// @access privte (admin only)

const deleteTask = async (req, res)=>{
    try {
        const taskID = req.params.id;
        const deletedTask = await Task.findByIdAndDelete(taskID);
        if(!deletedTask){
            return res.status(400).json({message: 'Task Not Found'});
        }
        res.status(201).json({message: 'Task deleted successfully', deletedTask});
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
}

// @desc CREATE new task
// @route POST api/tasks/
// @access private (admin only)

const createNewTask = async (req, res)=>{
    try {
        const {
            title,
            description,
            projectId,
            assignedTo,
            priority,
            startDate,
            dueDate,
            estimatedHours,
            attachments
        } = req.body;

        if(assignedTo && !Array.isArray(assignedTo)){
           return res.status(400).json({messaage: 'Task Members should be an array of user IDs'});
        }

        const newTask = await Task.create({
            title,
            description,
            projectId,
            assignedTo,
            priority,
            startDate,
            dueDate,
            estimatedHours,
            createdBy: req.user._id,
            attachments
        })

        res.status(201).json({message: 'Task created successfully', newTask});

    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
}


// @desc update task details
// @route PUT api/tasks/:id
// @access private (admin only)

const updateTask = async (req, res)=>{
    try {
        const task = await Task.findById(req.params.id);
        // console.log(task);
        if(!task) return res.status(400).json({message: 'Task Not Found'});

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.startDate = req.body.startDate || task.startDate;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.status = req.body.status || task.status;
        task.attachments = req.body.attachments  || task.attachments;
        task.estimatedHours = req.body.estimatedHours || task.estimatedHours;

        if(req.body.assignedTo){
            if(req.body.assignedTo && !Array.isArray(req.body.assignedTo)){
                return res.status(400).json({
                    message: 'Task Members must be an array of User IDs'
                });
            }
        }

        task.assignedTo = req.body.assignedTo || task.assignedTo;

        const updatedTask =await task.save();

        //code to update members automatically based on task members
        const project = await Project.findById(task.projectId);

        if (!project) {
            return res.status(404).json({ message: 'Associated Project Not Found' });
        }

        if (req.body.assignedTo && Array.isArray(req.body.assignedTo)) {

            const newMembers = req.body.assignedTo.filter(userId =>
                !project.members.map(id => id.toString()).includes(userId.toString())
            );

            if (newMembers.length > 0) {
                project.members.push(...newMembers);
                
            }
        }

        // code to update project status and progres

        const totalTasks = await Task.countDocuments({projectId: task.projectId});
        const inprogressCount = await Task.countDocuments({status: 'In Progress',projectId: task.projectId});
        const completedCount = await Task.countDocuments({status: 'Completed',projectId: task.projectId});

        if (totalTasks === 0) {
            project.status = "Yet to Start";
        } else if (completedCount === totalTasks) {
            project.status = "Completed";
        } else if (inprogressCount > 0 || completedCount > 0) {
            project.status = "In Progress";
        } else {
            project.status = "Yet to Start";
        }
        
        project.progress = totalTasks === 0 ? 0 : Math.ceil((completedCount / totalTasks) * 100);
        
        await project.save();
        //await updateProjectStatusAndProgress(task.projectId);

        res.status(200).json({message: 'Task updated successfully', updatedTask});
    } catch (error) {
        res.status(500).json({message: 'Server Error', error: error.message});
    }
}

module.exports= {
    createNewTask,
    updateTask,
    deleteTask,
    getTasks,
    getTasksById
}