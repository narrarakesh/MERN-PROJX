import React, { useCallback, useContext, useEffect, useState } from 'react'
import SelectedUsers from './inputs/SelectedUsers'
import AddAttachmentsInput from './inputs/AddAttachmentsInput'
import toast from 'react-hot-toast'
import { Priority_Data, Task_Status_Data } from '../utils/data'
import SelectDropdown from './inputs/SelectDropdown'
import { API_PATHS } from '../utils/apiPaths'
import axiosInstance from '../utils/axiosInstance'
import moment from 'moment'
import { UserContext } from '../context/userContext'

const TaskDetails = ({ task = null , projectID, refetchProject, onClose}) => {
  const initialState = {
    title: '',
    description: '',
    projectId: projectID,
    assignedTo: [],
    status: 'Todo',
    priority: 'Medium',
    startDate: '',
    dueDate: '',
    estimatedHours: 0,
    attachments: [],
  }
  

  const [taskData, setTaskData] = useState(task || initialState);
  const [error, setError] = useState('');
  const [loading, setLoading]=useState(null);
  const [isReadonly, setIsReadOnly] = useState(false);

  const {user} = useContext(UserContext);

  useEffect(()=> {
    if(user){
      setIsReadOnly(()=> user.role != "Admin" );
    }
  },[user])
  

  useEffect(() => {
    if (task) {
      setTaskData({
        ...initialState,
        ...task,
      })
    }
  }, [task])

  const handleValueChange = useCallback((key, value) => {
    setTaskData((prev) => ({ ...prev, [key]: value }))
  },[]);

  const clearData = () => {
    setTaskData(initialState)
  }

  //Create Task
  const createTask= async ()=>{
    setLoading(true);

    try {
      
      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK,{
        ...taskData,
        startDate : new Date(taskData.startDate).toISOString(),
        dueDate: taskData?.dueDate ? new Date(taskData.dueDate).toISOString() : "",
        projectId: taskData.projectId

      });

      if(response.status == 201){
        toast.success("Task Created Successfully");
        clearData();
        onClose();
        refetchProject();
      }

      

    } catch (error) {
      console.error("Error creating the task:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      setLoading(false);
    } finally{
      setLoading(false);
    }
  }

  // Update Task

  const updateTask = async ()=>{
    setLoading(true);
    try {
      const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(task._id),{
        ...taskData,
        startDate : new Date(taskData.startDate).toISOString(),
        dueDate: taskData?.dueDate ? new Date(taskData.dueDate).toISOString() : "",
      })
      console.log(response);
      if(response.status == 200){
        toast.success("Task Updated Successfully");
        clearData();
        onClose();
        refetchProject();
      }

    } catch (error) {
      console.error("Error updating the task:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      setLoading(false);
    } finally{
      setLoading(false);
    }
  }

  // const handleSubmit
  const handleSubmit = async () =>{
    setError(null);

    // input validation

    if(!taskData.title.trim()){
      setError("Title is required.")
      return;
    }
    if(!taskData.description.trim()){
      setError("Description is required.")
      return;
    }
    if(!taskData.priority.trim()){
      setError("Priority is required.")
      return;
    }
    if(!taskData.startDate.trim()){
      setError("Start Date is required.")
      return;
    }
    if(!taskData.estimatedHours){
      setError("Estimated Hours is required.")
      return;
    }
    if(!taskData.assignedTo.length){
      setError("Task Members is required.")
      return;
    }

     task ? updateTask() : createTask();
  }

  const inputClass = `form-input 
          read-only:bg-gray-100
            read-only:cursor-not-allowed
            read-only:border-none
          read-only:text-gray-500`

  return (
    <div>

      <div className="mt-2 hidden">
        <label className="text-xs font-medium text-slate-600">ProjectID</label>
        <input
          type="text"
          placeholder="Project ID"
          className="form-input"
          value={taskData.projectId}
          onChange={(e) => handleValueChange('projectId', e.target.value)}
        />
      </div>

      <div className="mt-2">
        <label className="text-xs font-medium text-slate-600">Title</label>
        <input
          type="text"
          placeholder="Task Title"
          readOnly={isReadonly}
          className={inputClass}
          value={taskData.title}
          onChange={(e) => handleValueChange('title', e.target.value)}
        />
      </div>

      <div className="mt-3">
        <label className="text-xs font-medium text-slate-600">Description</label>
        <textarea
          placeholder="Describe Task"
          className={inputClass}
          value={taskData.description}
          onChange={(e) => handleValueChange('description', e.target.value)}
          readOnly={isReadonly}
        />
      </div>

      <div className="grid grid-cols-12 gap-4 mt-2">
        {
          task && (
            <div className="col-span-6 md:col-span-4">
                <label className='text-xs font-medium text-slate-600'>
                    Status
                </label>
                <SelectDropdown 
                    options ={Task_Status_Data}
                    value = {taskData.status}
                    onChange={(value)=> handleValueChange("status", value)}
                    placeholder="Select Status"
                />
            </div>
          )
        }
        

        <div className="col-span-6 md:col-span-4">
            <label className='text-xs font-medium text-slate-600'>
                Priority
            </label>
            {
              user.role === 'Admin' ? 
                <SelectDropdown 
                  options ={Priority_Data}
                  value = {taskData.priority}
                  onChange={(value)=> handleValueChange("priority", value)}
                  placeholder="Select priority"
              /> :
                <input type="text" name="" i 
                  value={taskData.priority}
                  className="form-input 
                  read-only:bg-gray-100
                    read-only:cursor-not-allowed
                    read-only:border-none
                  read-only:text-gray-500"
                  onChange={(e) => handleValueChange('startDate', e.target.value)}
                  readOnly={isReadonly}
                />
            }
            
        </div>


        <div className="col-span-6 md:col-span-4">
          <label className="text-xs font-medium text-slate-600 ">Start Date</label>
          <input
            type="date"
            value={moment(taskData.startDate).format('YYYY-MM-DD')}
            className={inputClass}
            onChange={(e) => handleValueChange('startDate', e.target.value)}
            readOnly={isReadonly}
          />
        </div>

        <div className="col-span-6 md:col-span-4">
          <label className="text-xs font-medium text-slate-600">Due Date</label>
          <input
            type="date"
            value={ taskData.dueDate ? moment(taskData.dueDate).format('YYYY-MM-DD'): ''}
            className={inputClass}
            onChange={(e) => handleValueChange('dueDate', e.target.value)}
            readOnly={isReadonly}
          />
        </div>

        <div className="col-span-6 md:col-span-4">
          <label className="text-xs font-medium text-slate-600">Estimated Hours</label>
          <input
            type="number"
            value={taskData.estimatedHours}
            className={inputClass}
            onChange={(e) => handleValueChange('estimatedHours', e.target.value)}
            readOnly={isReadonly}
          />
        </div>

        <div className="col-span-6 md:col-span-4 mt-3">
          <label className="text-xs font-medium text-slate-600">Members</label>
          
          <SelectedUsers
            selectedUsers={taskData.assignedTo || []}
            setSelectedUsers={(value) => handleValueChange('assignedTo', value)}
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="text-xs font-medium text-slate-600">Attachments</label>
        <AddAttachmentsInput
          attachments={taskData.attachments}
          setAttachments={(value) => handleValueChange('attachments', value)}
        />
      </div>

      {error && <p className="text-xs text-red-500 mt-5">{error}</p>}

        <div className="flex justify-end mt-7">
            <button
            className='add-btn'
            disabled={loading}
            onClick={handleSubmit}
            >
            {task ? "Update Task" : "Create Task"}
            </button>
        </div>
    </div>
  )
}

export default TaskDetails
