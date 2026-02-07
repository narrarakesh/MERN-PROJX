import React, {useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LuTrash, LuPen, LuCalendar, LuUsers, LuPaperclip } from 'react-icons/lu';
import { IoClose } from "react-icons/io5";
import AvatarGroup from '../../components/AvatarGroup';
import moment from 'moment';
import { FaSave } from "react-icons/fa";
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Modals from './Modals';
import DeleteAlert from './DeleteAlert';
import { UserContext } from '../../context/userContext';




const ProjectHeader = ({ projectData, refetchProject }) => {

  const user = useContext(UserContext);


  const navigate = useNavigate();
  const [editProject, setEditProject] = useState(false);
  const [loading, setLoading]=useState(false);
  const [projectDetails, setProjectDetails] = useState(projectData || {});
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [showAllAttachments, SetShowAllAttachments] =useState(false);

  const handleValueChange = (key, value) => {
    setProjectDetails((prev) => ({ ...prev, [key]: value }))
  }
  

  const updateProject = useCallback(async () =>{
    try {
      setLoading(true)
      const response = await axiosInstance.put(API_PATHS.PROJECTS.UPDATE_PROJECT(projectData._id),{
        ...projectDetails,
      });

      if(response.status == 200){
        toast.success("Project Updated Successfully");
        setEditProject(false);
        refetchProject();
      }

    } catch (error) {
      console.log("Error updating the project", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
      setLoading(false);
    } finally{
      setLoading(false);
    }
  },[projectData._id, projectDetails, refetchProject]);

  const deleteProject = useCallback(async () =>{
    try {
      const response = await axiosInstance.delete(API_PATHS.PROJECTS.DELETE_PROJECT(projectData._id));

      if(response.status == 200){
        toast.success("Project deleted Successfully");
        navigate("/admin/projects");
      }

    } catch (error) {
      console.log("Error deleting project",error.response?.data?.message || error.message);
    }
  },[projectData._id, navigate]);

  const getStatusTagColor = useMemo(()=>{
    switch (projectDetails?.status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-green-500 bg-green-50 border border-green-500/10";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  },[projectDetails?.status]);

  const getPriorityTagColor = useMemo(() => {
    switch (projectDetails?.priority) {
      case 'Low':
        return 'text-emerald-500 bg-emerald-50 border border-emerald-500/10';
      case 'Medium':
        return 'text-orange-500 bg-orange-50 border border-orange-500/10';
      default:
        return 'text-rose-500 bg-rose-50 border border-rose-500/10';
    }
  },[projectDetails?.priority]);

  useEffect(()=>{
    if(!editProject){
      setProjectDetails(projectData || {})
    }
  },[projectData, editProject])

  return (
    <>
    {projectDetails && (
    <div className="card my-5 p-4 space-y-4 bg-gray-200">
      <div className="flex items-start gap-3 px-4">
        <div className={`text-[11px] font-medium ${getStatusTagColor} px-4 py-0.5 rounded`}>
          {projectDetails?.status}
        </div>
        <div className={`text-[11px] font-medium ${getPriorityTagColor} px-4 py-0.5 rounded`}>
          {projectDetails?.priority} Priority
        </div>
      </div>

      <div className="flex flex-col md:flex-col gap-3 px-4">
        {editProject ? (
          <input
            type="text"
            className="form-input"
            placeholder="Project Name"
            value={projectDetails?.name || ''}
            onChange={(e) => handleValueChange('name', e.target.value)}
          />
        ) : (
          <h2 className="text-md md:text-lg font-semibold break-words whitespace-normal">
            {projectDetails?.name}
          </h2>
        )}

        {/* Project Description */}
        {editProject ? (
          <textarea
            className="form-input text-md md:text-lg break-words whitespace-normal"
            placeholder="Project Description"
            rows={2}
            value={projectDetails?.description || ''}
            onChange={(e) => handleValueChange('description', e.target.value)}
          />
        ) : (
          <p className='text-xs text-gray-500 mt-1.5 leading-[18px]'>
            {projectDetails?.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 my-3 px-4">
        {/* Start Date */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-slate-600 mb-1">
            <span className='flex items-center gap-1'>
              <LuCalendar className='w-4 h-4 text-blue-800' />Start Date
            </span>
          </label>
          {editProject ? (
            <input
              type="date"
              value={projectDetails?.startDate ? moment(projectDetails.startDate).format('YYYY-MM-DD') : ''}
              className="form-input"
              placeholder="Start Date"
              onChange={(e)=>handleValueChange('startDate', e.target.value)}
            />
          ) : (
            <p className="text-sm font-medium text-slate-800 px-5 py-1">
              {projectDetails?.startDate ? moment(projectDetails.startDate).format('MMMM DD, YYYY') : 'N/A'}
            </p>
          )}
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-slate-600 mb-1">
            <span className='flex items-center gap-1'>
              <LuCalendar className='w-4 h-4 text-blue-800' />End Date
            </span>
          </label>
          {editProject ? (
            <input
              type="date"
              value={projectDetails?.endDate ? moment(projectDetails.endDate).format('YYYY-MM-DD') : ''}
              className="form-input"
              placeholder="End Date"
              onChange={(e)=>handleValueChange('endDate', e.target.value)}
            />
          ) : (
            <p className="text-sm font-medium text-slate-700 px-3 py-1">
              {projectDetails?.endDate ? moment(projectDetails.endDate).format('MMMM DD, YYYY') : ''}
            </p>
          )}
        </div>

        {/* Members */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-slate-600 mb-1">
            <span className='flex items-center gap-1'>
              <LuUsers className='w-4 h-4 text-blue-800' />Members
            </span>
          </label>
          <AvatarGroup avatars={(projectDetails?.members ?? []).map(user => user.profileImageUrl)} />
        </div>
      </div>

          {/* attachments  */}
      {
        projectDetails?.attachments?.length > 0 && 
          <div className="flex flex-col md:flex-col gap-3 px-4">
            <label className="text-xs font-medium text-slate-600 mb-1">Project Links</label>
            <div className="">
              {projectDetails?.attachments?.slice(0, showAllAttachments ? projectDetails?.attachments?.length : 3).map((link, index) => (
                  <a
                    href={link}
                    key={index}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-md hover:bg-slate-50 transition-colors duration-150"
                  >
                    <LuPaperclip className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700 break-all">
                      {link}
                    </span>
                  </a>

                

              ))}
            </div>
            {projectDetails?.attachments?.length > 3 && (
              <button className="toggle-btn" onClick={() => SetShowAllAttachments(!showAllAttachments)}>
                {showAllAttachments ? "Show less ▲" : "Show all ▼"}
              </button>
            )}
          </div>
      }
      
      

      { user?.role == 'Admin' && (
        <div className="flex flex-row justify-end items-center gap-3">

          {
            editProject && (
              <button className='update-btn flex items-center gap-1' disabled={loading} onClick={updateProject} ><FaSave />Update</button>
            )
          }

          <button className="edit-btn" onClick={() => setEditProject(!editProject)}>
            {editProject ? (  
              <span className="flex items-center gap-1"><IoClose /> Cancel</span>
              
            ) : (
              <span className="flex items-center gap-1"><LuPen /> Edit Project Details</span>
            )}
          </button>

          {
            !editProject && (<button className="delete-btn flex items-center gap-1"
              onClick={()=> setOpenDeleteAlert(true)}
            >
              <LuTrash /> Delete
            </button>)
          }
        </div>
      )}
      

    </div>
    )}

    <Modals 
      isOpen={openDeleteAlert}
      onClose={()=> setOpenDeleteAlert(false)}
      title= "Delete Project" >
        <DeleteAlert 
          content = "Are you sure you want to delete this project"
          onDelete={deleteProject}
          />
    </Modals>

    </>
  );
};

export default ProjectHeader;
