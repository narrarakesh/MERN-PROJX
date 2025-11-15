const Task  = require('../models/Task');
const User = require('../models/User');
const excelJS = require('exceljs');

// @desc export all tasks as an Excel file
// @route GET api/reports/export/tasks
// @access priivate (admin only)
const exportProjectsReport = async (req, res)=>{
    try {
        const adminId = req.user._id;

        // Find all project IDs created by this admin
        const projects = await Project.find({ createdBy: adminId }).sort({ createdAt: 1 }).select('_id');

        const projectIds = projects.map(p => p._id);
        // Create map to track project order
        const projectOrderMap = new Map();
        projects.forEach((project, index) => {
        projectOrderMap.set(project._id.toString(), index);
        });

        
        // Sort tasks based on project creation order
        tasks.sort((a, b) => {
        const orderA = projectOrderMap.get(a.projectId?._id?.toString()) ?? Infinity;
        const orderB = projectOrderMap.get(b.projectId?._id?.toString()) ?? Infinity;
        return orderA - orderB;
        });

        // Find tasks only for those projects
        const tasks = await Task.find({ projectId: { $in: projectIds } })
        .populate('projectId', 'name')
        .populate('assignedTo', 'name email');

        // Proceed to create workbook
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Tasks Report');

        worksheet.columns = [
        { header: 'Task ID', key: '_id', width: 24 },
        { header: 'Title', key: 'title', width: 30 },
        { header: 'Description', key: 'description', width: 40 },
        { header: 'Project Name', key: 'projectName', width: 30 },
        { header: 'Assigned To', key: 'assignedTo', width: 40 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Priority', key: 'priority', width: 10 },
        { header: 'Start Date', key: 'startDate', width: 20 },
        { header: 'Due Date', key: 'dueDate', width: 20 },
        { header: 'Estimated Hours', key: 'estimatedHours', width: 20 },
        { header: 'Created At', key: 'createdAt', width: 20 },
        { header: 'Updated At', key: 'updatedAt', width: 20 },
        ];

        tasks.forEach(task => {
        const assignedNames = task.assignedTo.map(user => user.name).join(', ');
        worksheet.addRow({
            _id: task._id.toString(),
            title: task.title,
            description: task.description || '',
            projectName: task.projectId?.name || 'No Project',
            assignedTo: assignedNames || 'Unassigned',
            status: task.status,
            priority: task.priority,
            startDate: task.startDate ? new Date(task.startDate).toLocaleDateString() : '',
            dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '',
            estimatedHours: task.estimatedHours,
            createdAt: task.createdAt.toLocaleDateString(),
            updatedAt: task.updatedAt.toLocaleDateString(),
        });
        });

        res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
        'Content-Disposition',
        `attachment; filename=tasks_report.xlsx`
        );

        await workbook.xlsx.write(res);
        res.status(200).end();
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

// @desc export user-task report
// @route GET api/reports/export/user
// @access private (admin only)

const exportUserReports = async(req, res)=>{
    try {
        const users = await User.find().select("name email _id").lean();
        const UserTasks = await Tasks.find().populate("assignedTo", "name email _id");

        const userTaskMap = {};
        users.forEach((user)=>{
            userTaskMap[user._id]={
                name: user.name,
                email: user.email,
                taskcount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            }
        });
        UserTasks.forEach((task)=>{
            if(task.assignedTo){
                task.assignedTo.forEach((assignedUser)=>{
                    if(userTaskMap[assignedUser._id]){
                        userTaskMap[assignedUser._id].taskcount +=1;
                        if(task.status == "Todo"){
                            userTaskMap[assignedUser._id].pendingTasks +=1;
                        }else if( task.status == "Inprogress"){
                            userTaskMap[assignedUser._id].inProgressTasks +=1;
                        }else if( task.status == "Completed"){  
                            userTaskMap[assignedUser._id].completedTasks +=1;
                        }
                    }
                })
            }
        });

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Users Report');

        worksheet.columns = [
            {header: "User Name", key: "name", width: 30},
            {header: "Email", key: "email", width: 40},
            {header: "Total Assigned Tasks", key: "totalTasks", width: 20},
            {header: "Pending Tasks", key: "pendingTasks", width: 20},
            {header: "In Progress Tasks", key: "inProgressTasks", width: 20},
            {header: "Completed Tasks", key: "completedTasks", width: 20},
        ];

        Object.values(userTaskMap).forEach((user)=>{
            worksheet.addRow(user);
        });
        res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
        'Content-Disposition',
        `attachment; filename=tasks_report.xlsx`
        );

        await workbook.xlsx.write(res);
        res.status(200).end();

    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message})
    }
}

module.exports={
    exportProjectsReport,
    exportUserReports
}