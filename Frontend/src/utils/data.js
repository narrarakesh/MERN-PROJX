import {
    LuLayoutDashboard, 
    LuUsers,
    LuFolderPlus,
    LuLayers,
    LuLogOut

} from 'react-icons/lu';

export const Side_Menu_Data =[


    {
        id:'01',
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: LuLayoutDashboard
    },
    {
        id:'02',
        label: 'Manage Projects',
        path: '/admin/projects',
        icon: LuLayers
    },
    {
        id:'03',
        label: 'Create Project',
        path: '/admin/create-project',
        icon: LuFolderPlus 
    },
    {
        id:'04',
        label: 'Team Members',
        path: '/admin/users',
        icon:LuUsers
    },
    {
        id:'05',
        label: 'Logout',
        path: 'logout',
        icon: LuLogOut
    }

]

export const Side_Menu_User_Data = [
    {
        id:'01',
        label: 'Dashboard',
        path: '/user/dashboard',
        icon: LuLayoutDashboard
    },
    {
        id:'02',
        label: 'My Projects',
        path: '/user/projects',
        icon: LuLayers
    },
    {
        id:'03',
        label: 'Logout',
        path: 'logout',
        icon: LuLogOut
    }
]

export const Priority_Data =[
    { label: 'Low', value: 'Low'},
    { label: 'Medium', value: 'Medium'},
    { label: 'High', value: 'High'}
]

export const Status_Data = [
    { label: 'Pending', value: 'Pending'},
    { label: 'In Progress', value: 'In Progress'},
    { label: 'Completed', value: 'Completed'}
]


export const Task_Status_Data =[
    { label: 'Todo', value: 'Todo'},
    { label: 'In Progress', value: 'In Progress'},
    { label: 'Completed', value: 'Completed'}
]