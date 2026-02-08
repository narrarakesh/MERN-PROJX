import React, { memo, useContext, useState } from 'react'
import moment from 'moment'
// import fallBackImage from '../../assets/fallbackImage.jpg'
import AvatarGroup from '../AvatarGroup';
import { LuPen, LuTrash } from 'react-icons/lu';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import TaskDetails from '../TaskDetails';
import Modals from './Modals';
import toast from 'react-hot-toast';
import DeleteAlert from './DeleteAlert';
import { UserContext } from './../../context/userContext';


const TaskListTable = ({tableData, windowLocation='Dashboard', reloadFunction = () => {} }) => {


    const {user} = useContext(UserContext);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskDetails, setTaskDetails] = useState({});
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
    const [deletionId, setDeletionId] = useState('');

    const getTaskDetails = async (id)=>{
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
            if(response.data){
                setTaskDetails(response.data.task);
                setIsModalOpen(true);
            }

        } catch (error) {
            console.log("Error fetching project details ", error);
        }
    }

    const deleteTask = async () =>{
        try {
            const response = await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(deletionId));
            if(response.status == 201){
            toast.success("Task deleted Successfully");
            setOpenDeleteAlert(false);
            reloadFunction();
      } 
        } catch (error) {
            console.log("Error Deleting the Task",error.response?.data?.message || error.message);
        }
    }

    const getStatusBadgeColor = (status)=>{
        switch(status){
            case 'Completed': return 'bg-green-100 text-green-500 border border-green-200';
            case 'Yet to Start': return 'bg-purple-100 text-purple-500 border border-purple-200';
            case 'In Progress': return 'bg-cyan-100 text-cyan-500 border border-cyan-200';
            default : return 'bg-gray-100 text-gray-500 border border-gray-200';
        }
    }

    const getPriorityBadgeColor = (priority)=>{
        switch(priority){
            case 'High': return 'bg-red-100 text-red-500 border border-red-200';
            case 'Medium': return 'bg-orange-100 text-orange-500 border border-orange-200';
            case 'Low': return 'bg-yellow-100 text-yellow-500 border border-yellow-200';
            default : return 'bg-gray-100 text-gray-500 border border-gray-200';
        }
    }

  return (

    

    <>
    <div className='overflow-x-auto p-0 rounded-lg mt-3'>
        <table className='min-w-full'>
            <thead>
                <tr className='text-center'>
                    <th className='py-3 px-4 text-gray-800 font-meduim text-[13px]'>Name</th>
                    <th className='py-3 px-4 text-gray-800 font-meduim text-[13px]'>Status</th>
                    <th className='py-3 px-4 text-gray-800 font-meduim text-[13px] '>Priority</th>
                    {windowLocation =="Dashboard" ? <th className='py-3 px-4 text-gray-800 font-meduim text-[13px]'>Project</th>:'' }
                    <th className='py-3 px-4 text-gray-800 font-meduim text-[13px] hidden md:table-cell'>Created on</th>
                    <th className='py-3 px-4 text-gray-800 font-meduim text-[13px]'>Assigned To</th>
                    <th className='py-3 px-4 text-gray-800 font-meduim text-[13px] hidden md:table-cell'>Start Date</th>
                    <th className='py-3 px-4 text-gray-800 font-meduim text-[13px] hidden md:table-cell'>Estimated Hours</th>
                    {windowLocation == "projectDetails" ? <th className=''></th>: ""}
                </tr>
            </thead>
            <tbody>
                {tableData.map((task)=>{
                  return  <tr key={task._id} className='border-t border-gray-200 text-center'>
                        <td className='my-3 mx-4 text-gray-700 text-xs md:text-[13px] line-clamp-2 overflow-hidden flex flex-col items-center'><>{task.title}</></td>
                        <td className='py-4 px-4'>
                          <span className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColor(task.status)}`}>{task.status}</span>
                        </td>
                        <td className='py-4 px-4'>
                          <span className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColor(task.priority)}`}>{task.priority}</span>
                        </td>
                        {
                            windowLocation == "Dashboard" ?
                            <td className='my-3 mx-4 text-gray-700 text-xs md:text-[13px] line-clamp-2 overflow-hidden'>{task.projectId?.name || ""}</td> : ''
                        }
                        <td className='py-4 px-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell'>{task.createdAt ? moment(task.createdAt).format('Do MMM YYYY'): 'N/A'}</td>
                        <td>
                            <div className="flex -space-x-2 justify-center">
                                {/* {task.assignedTo.map(user => (
                                <img
                                    key={user._id}
                                    src={user.profileImageUrl || fallBackImage}
                                    alt={user.name}
                                    title={user.name}
                                    className="w-10 h-10 rounded-full border-2 border-white"
                                />
                                ))} */}
                                <AvatarGroup avatars={task.assignedTo.map((user)=> user.profileImageUrl)}/>
                            </div>
                        </td>
                        <td className='py-4 px-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell'>{task.startDate ? moment(task.startDate).format('Do MMM YYYY'): 'N/A'}</td>
                        <td className='py-4 px-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell'>{task.estimatedHours}</td>
                        <td className='py-4 px-4 flex flex-col gap-1 items-center justify-center  cursor-pointer'>
                            <>
                                    <button className="table-edit-btn flex gap-0.5 items-center justify-center"
                                        onClick={()=> getTaskDetails(task._id)}
                                        >
                                        <LuPen className='w-3 h-3 text-blue-900'/>
                                        <span className='hidden md:block'>Edit</span>

                                    </button>
                                    {
                                        user.role === 'Admin' && (
                                            <button className="table-delete-btn flex gap-0.5 items-center justify-center"
                                                onClick={()=> {
                                                    setDeletionId(task._id);
                                                    setOpenDeleteAlert(true);
                                                }}
                                                >
                                                <LuTrash className='w-3 h-3 text-red-800'/>
                                                <span className='hidden md:block'>Delete</span>
                                            </button>
                                        )
                                    }
                                    
                            </>
                        </td>
                    </tr>
                })}
            </tbody>
        </table>
    </div>

    { isModalOpen && (
        <Modals isOpen={isModalOpen}
            onClose={()=> setIsModalOpen(false)}
            title = 'Update Task'
        >
            <TaskDetails task={taskDetails} windowLocation="projectDetails" projectID ={taskDetails.projectID} refetchProject={reloadFunction} onClose={()=>setIsModalOpen(false)}/>

        </Modals>
        )
    }

    {
        openDeleteAlert && (
            <Modals 
                isOpen={openDeleteAlert}
                onClose={()=> setOpenDeleteAlert(false)}
                title= "Delete Task" >
                    <DeleteAlert 
                    content = "Are you sure you want to delete this task"
                    onDelete={deleteTask}
                    />
            </Modals>
        )
    }


    </>

  )
}

export default memo(TaskListTable)