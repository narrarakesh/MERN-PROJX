import React, { useCallback, useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useLocation, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import TaskListTable from '../../components/layouts/TaskListTable';
import ProjectHeader from '../../components/layouts/ProjectHeader';



const ProjectDetails = () => {

  // for user info
  const {user} = useContext(UserContext);
  console.log(user);

  const navigate = useNavigate();
  const location = useLocation();
  const {projectId} = location.state || {};
  const [projectData, setProjectData] = useState([]);
  const [tasksData, setTasksData]=useState([]);
  
  // state realetd to portal
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const getProjectDetails = useCallback(async ()=>{
      try {
        const response = await axiosInstance.get(API_PATHS.PROJECTS.GET_PROJECT_BY_ID(projectId));
        // console.log(response.data);
        if(response.data){
          setProjectData(response.data.project);
          setTasksData(response.data.tasks);
        }
  
      } catch (error) {
        console.log("Error fetching project details ", error);
      }
    },[projectId]);

  // console.log("tasks", tasksData);

  useEffect(()=>{

    if (!user) return; 

    projectId ? getProjectDetails() : navigate('user/projects');
  },[projectId, navigate, user, getProjectDetails])

  return (
    <DashboardLayout activeMenu={''} >
      <ProjectHeader projectData={projectData} refetchProject={getProjectDetails}/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
      
        {/* below div is for recent tasks table */}
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Tasks</h5>
              {/* {
                user?.role != 'Member' && (
                  <button className='card-btn'
                    onClick={()=> setIsModalOpen(true)}
                  >
                    Add Task
                  </button>
                )
              } */}
              
            </div>

            {/* { isModalOpen && (
              <Modals isOpen={isModalOpen}
                  onClose={()=> setIsModalOpen(false)}
                  title = 'Create Task'
              >
                  <TaskDetails windowLocation="projectDetails" projectID ={projectId} refetchProject={getProjectDetails} onClose={()=>setIsModalOpen(false)}/>
      
              </Modals>
              )
            } */}

            {
              tasksData.length ?
              <TaskListTable tableData={tasksData || []} windowLocation='ProjectDetails' reloadFunction={getProjectDetails}/> :
              <div className="flex items-center justify-center h-60">
                <p className="text-md font-normal text-gray-600 text-center">
                  No tasks created for this project
                </p>
              </div>
            }
          </div>
        </div>
      </div>

    </DashboardLayout>
  )
}

export default ProjectDetails