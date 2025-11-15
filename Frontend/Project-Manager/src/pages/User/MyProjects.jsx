import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import ProjectStatusTabs from '../../components/ProjectStatusTabs';
import ProjectCard from '../../components/cards/ProjectCard';

const MyProjects = () => {

  const [allProjects, setAllProjects] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [tabs, setTabs] = useState([]);

  const navigate = useNavigate();

  const getAllProjects = async ()=> {
    try {
      const response = await axiosInstance.get(API_PATHS.PROJECTS.GET_ALL_PROJECTS,{
        params: {
          status: filterStatus === 'All' ? "" : filterStatus,
        },
      });
      
      setAllProjects(response.data?.projects?.length > 0 ? response.data.projects : []);

      //map status sumamry with labels and order

      const statusSummary = response.data?.statusSummary || {};

      const statusArray = [
        { label: "All", count: statusSummary.all || 0},
        { label: "Yet to Start", count: statusSummary.pendingProjects || 0},
        { label: "In Progress", count: statusSummary.inProgressProjects || 0},
        { label: "Completed", count: statusSummary.completedProjects || 0},

      ];

      setTabs(statusArray); 
    } catch (error) {
      console.log("Error in retrieving the projects data", error);
    }

  }

  const handleClick = (projectData) =>{
    navigate('/user/project-details', { state: {projectId: projectData._id }});
  };




  useEffect(()=>{
    getAllProjects();
  },[filterStatus])

  return (
    <DashboardLayout activeMenu={'My Projects'}>
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex justify-between items-center gap-3">
            <h2 className='text-xl md:text-xl font-medium'>My Projects</h2>

            {/* <button 
              className='flex items-center lg:hidden download-btn'
              onClick={handleDownloadReport}

            >
              <LuFileSpreadsheet className='text-lg'/>
              Download Report</button> */}
          </div>

          {
            tabs?.[0]?.count > 0 && (
              <div className="flex items-center gap-3">
                <ProjectStatusTabs 
                  tabs = {tabs}
                  activeTab = {filterStatus}
                  setActiveTab = {setFilterStatus}
                />

                {/* <button className='hidden md:flex download-btn' 
                  onClick={handleDownloadReport}  
                >
                  <LuFileSpreadsheet className='text-lg'/> Download Report
                </button> */}
                </div>

            )
          }

        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 ">
          {allProjects?.map((project)=>{
            return (
              <ProjectCard 
                key ={project._id}
                name ={project.name}
                description = {project.description}
                priority={project.priority}
                status = {project.status}
                progress = {project.progress}
                createdAt ={ project.createdAt}
                endDate = {project.endDate}
                startDate = {project.startDate}
                members = {project.members.map((user)=> user.profileImageUrl)}
                attachmentCount = {project.attachments?.length || 0}
                completedTasks={project.completedTasks || 0}
                totalTasks = {project.totalTasks || 0}
                onClick = {()=>{handleClick(project)}}
              >

              </ProjectCard>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MyProjects