import React, {useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import ProjectStatusTabs from '../../components/ProjectStatusTabs';
import ProjectCard from '../../components/cards/ProjectCard';

const MyProjects = () => {

  const [allProjects, setAllProjects] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading]= useState(true);

  const navigate = useNavigate();

  const getAllProjects = async ()=> {
    try {
      const response = await axiosInstance.get(API_PATHS.PROJECTS.GET_ALL_PROJECTS,{
        params: {
          status: filterStatus === 'All' ? "" : filterStatus,
        },
      });
      
      const projects = response.data?.projects || [];
      
      setAllProjects(projects);

      //save to session storage
      sessionStorage.setItem('allProjects', JSON.stringify(projects));
      
      //map status sumamry with labels and order

      const statusSummary = response.data?.statusSummary || {};

      const statusArray = [
        { label: "All", count: statusSummary.all || 0},
        { label: "Yet to Start", count: statusSummary.pendingProjects || 0},
        { label: "In Progress", count: statusSummary.inProgressProjects || 0},
        { label: "Completed", count: statusSummary.completedProjects || 0},

      ];

      setTabs(statusArray); 
      sessionStorage.setItem('tabs', JSON.stringify(statusArray));
    } catch (error) {
      console.log("Error in retrieving the projects data", error);
    } finally{
      setLoading(false);
    }

  };

  const handleClick = (projectData) =>{
    navigate('/user/project-details', { state: {projectId: projectData._id }});
  };



  useEffect(() => {
    const cachedProjects = sessionStorage.getItem('allProjects');
    const cachedTabs = sessionStorage.getItem('tabs');

    if (cachedProjects && cachedTabs) {
      setAllProjects(JSON.parse(cachedProjects));
      setTabs(JSON.parse(cachedTabs));
      setLoading(false);
    }   
    getAllProjects(filterStatus);
  }, [filterStatus]);

  useEffect(() => {
      const interval = setInterval(() => {
        if (!document.hidden) getAllProjects();
      }, 60000);
  
      return () => clearInterval(interval);
    }, []);

  return (
    <DashboardLayout activeMenu={'My Projects'}>
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex justify-between items-center gap-3">
            <h2 className='text-xl md:text-xl font-medium'>My Projects</h2>

          </div>

          {
            tabs?.[0]?.count > 0 && (
              <div className="flex items-center gap-3">
                <ProjectStatusTabs 
                  tabs = {tabs}
                  activeTab = {filterStatus}
                  setActiveTab = {setFilterStatus}
                />
                </div>

            )
          }

        </div>
        {loading ? (
          <p className="text-gray-500 mt-5">Loading projects...</p>
        ) : allProjects.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 ">
            {allProjects.map(project => (
              <ProjectCard
                key={project._id}
                name={project.name}
                description={project.description}
                priority={project.priority}
                status={project.status}
                progress={project.progress}
                createdAt={project.createdAt}
                endDate={project.endDate}
                startDate={project.startDate}
                members={project.members.map(user => user.profileImageUrl)}
                attachmentCount={project.attachments?.length || 0}
                completedTasks={project.completedTasks || 0}
                totalTasks={project.totalTasks || 0}
                onClick={() => handleClick(project)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-5">No projects found.</p>
        )}
      </div>
    </DashboardLayout>
  )
}

export default MyProjects