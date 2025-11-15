import React, { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { Priority_Data } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
// import { useLocation } from 'react-router-dom';
import {LuTrash2} from 'react-icons/lu';
import SelectDropdown from '../../components/inputs/SelectDropdown';
import SelectedUsers from '../../components/inputs/SelectedUsers';
import AddAttachmentsInput from '../../components/inputs/AddAttachmentsInput';


const CreateProject = () => {

  // const location = useLocation();
  // const {projectID }= location.state || {};

  const initialState = {
    name: '',
    description: '',
    priority: 'Medium',
    difficulty: 'Medium',
    startDate: '',
    endDate: '',
    createdBy: '',          
    members: [],             
    attachments: [],    
    progress: 0
  };

  const [projectData, setProjectData]=useState(initialState);

  const [error, setError]=useState(null);
  const [loading, setLoading]=useState(null);

  const handleValueChange = (key, value)=>{
    setProjectData((prevData)=>({...prevData, [key]: value}));
  }

  const clearData = ()=>{
    setProjectData(initialState);
  }


  //Create Project
  const createProject = async ()=>{
    setLoading(true);
    try {
      
      const response = await axiosInstance.post(API_PATHS.PROJECTS.CREATE_PROJECT,{
        ...projectData,
        startDate : new Date(projectData.startDate).toISOString(),
        endDate : new Date(projectData.endDate).toISOString(),

      });

      if(response.status== 201){
        toast.success("Project Created Successfully");
        clearData();
      }
      

    } catch (error) {
      console.log("Error creating the project", error);
      setLoading(false);
    } finally{
      setLoading(false);
    }
  }

  // const handleSubmit
  const handleSubmit = async () =>{
    setError(null);

    // input validation

    if(!projectData.name.trim()){
      setError("Name is required.")
      return;
    }
    if(!projectData.description.trim()){
      setError("Description is required.")
      return;
    }
    if(!projectData.priority.trim()){
      setError("Priority is required.")
      return;
    }
    if(!projectData.startDate.trim()){
      setError("Start Date is required.")
      return;
    }
    if(!projectData.endDate.trim()){
      setError("End Date is required.")
      return;
    }
    if(!projectData.members.length){
      setError("Project Members is required.")
      return;
    }

    createProject();
  }

  return (
    <DashboardLayout activeMenu={'Create Project'}>
      <div className="mt-5 ">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className='text-xl md:text-xl font-medium'>
                Create Project 
              </h2>
            </div>

            <div className="mt-5">
              <label className='text-xs font-medium text-slate-600'>
                Name
              </label>
              <input type="text" placeholder='Project Name'
                className='form-input'
                value={projectData.name}
                onChange={({target}) =>{
                  handleValueChange("name", target.value);
                }}
              />
            </div>

            <div className="mt-3">
              <label className='text-xs font-medium text-slate-600'>
                Description
              </label>
              <textarea  placeholder='Describe Project'
                className='form-input'
                value={projectData.description}
                onChange={({target}) =>{
                  handleValueChange("description", target.value);
                }}
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-4">
                <label className='text-xs font-medium text-slate-600'>
                  Priority
                </label>
                <SelectDropdown 
                  options ={Priority_Data}
                  value = {projectData.priority}
                  onChange={(value)=> handleValueChange("priority", value)}
                  placeholder="Select priority"
                />
              </div>
              <div className="col-span-6 md:col-span-4">
                <label className='text-xs font-medium text-slate-600'>
                  Start Date
                </label>
                <input type='date' 
                  value = {projectData.startDate}
                  className='form-input'
                  onChange={({target})=> handleValueChange("startDate", target.value)}
                  placeholder="Start Date"
                />
              </div>
                
              <div className="col-span-6 md:col-span-4">
                <label className='text-xs font-medium text-slate-600'>
                  End Date
                </label>
                <input type='date' 
                  value = {projectData.endDate}
                  className='form-input'
                  onChange={({target})=> handleValueChange("endDate", target.value)}
                  placeholder="End Date"
                />
              </div>

                {/* Assigned to section  */}
              <div className="col-span-6 md:col-span-4 mt-3 ">
                <label className='text-xs font-medium text-slate-600'>
                  Members
                </label>

                <SelectedUsers 
                  selectedUsers = {projectData.members}
                  setSelectedUsers= { (value)=>{
                    handleValueChange('members', value);
                  }}
                />


              </div>
            </div>

            

            {/* Attachments Section  */}
            <div className="mt-3">
              <label className='text-xs font-medium text-slate-600'>
                Attachments
              </label>

              <AddAttachmentsInput 
                attachments = {projectData?.attachments}
                setAttachments = {(value)=> handleValueChange("attachments", value)}
              />

            </div>

            { error && (
              <p className='text-xs font-medium text-red-500 mt-5'>{error}</p>
            )}


            <div className="flex justify-end mt-7">
              <button
                className='add-btn'
                onClick={handleSubmit}
                disabled={loading}
              >
                Create Project
              </button>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CreateProject