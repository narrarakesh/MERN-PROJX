import React, { useContext, useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';
import { addThousandsSeperator } from '../../utils/helper';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import InfoCard from '../../components/cards/InfoCard';
import CustomPieChart from '../../components/charts/CustomPieChart';
import CustomBarChart from '../../components/charts/CustomBarChart';
import TaskListTable from '../../components/layouts/TaskListTable';

const UserDashboard = () => {
  // need to authorize if user navigates to dashboard.
    useUserAuth();
    
    // const navigate = useNavigate();
    const {user} = useContext(UserContext);
    
  
    const COLORS = ['#8D51FF', '#00B8D8', '#7BCE00'];
    const PROJECT_COLORS = [
      '#8D51FF',  // Elegant Purple — modern & rich
      '#2EC4B6',  // Cool Teal — fresh and calming
      '#FF9F1C',  // Warm Orange — vibrant & eye-catching
    ];
    const [dashboardData, setDashboardData] = useState(null);
    const [pieChartData, setPieChartData]= useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [projectPieChartData, setProjectPieChartData] = useState([]);
    
  
    const getDashboardData =async ()=>{
      try {
        const response = await axiosInstance.get(API_PATHS.PROJECTS.GET_USER_DASHBOARD_DATA);
  
        if (response.data){
          setDashboardData(response.data);
          prepareChartData(response.data?.charts || null);
        }
  
      } catch (error) {
        console.log("Error fetching admin dashboard data", error);
      }
    };
  
    // Prepare chart data
    const prepareChartData = (data) =>{
      const taskDistribution = data?.taskDistribution || null;
      const taskPriorityDistribution = data?.priorityDistribution || null;
      const projectDistribution = data?.projectDistribution || null ;
  
      const taskDistributionData = [
        {status: 'Todo', count: taskDistribution?.Todo || 0},
        {status: 'In Progress', count: taskDistribution?.InProgress || 0},
        {status: 'Completed', count: taskDistribution?.Completed || 0}
      ];
  
      setPieChartData(taskDistributionData);
  
      const projectDistributionData = [
        {status: 'Yet To Start', count: projectDistribution?.YettoStart || 0},
        {status: 'In Progress', count: projectDistribution?.InProgress || 0},
        {status: 'Completed', count: projectDistribution?.Completed || 0}
      ]
  
      setProjectPieChartData(projectDistributionData);
  
      const priorityDistributionData = [
        {priority: 'Low', count: taskPriorityDistribution?.Low || 0},
        {priority: 'Medium', count: taskPriorityDistribution?.Medium || 0},
        {priority: 'High', count: taskPriorityDistribution?.High || 0}
      ]
  
      setBarChartData(priorityDistributionData);
  
    }
  
    useEffect(()=>{
      getDashboardData();
    },[])
  
  
    return (
      <DashboardLayout activeMenu={'Dashboard'}>
        {/* below div is for summary section */}
        <div className="card my-5">
          <div>
            <div className="">
              <h2 className='text-xl md:text-2xl'> Welcome back, {user?.name} </h2>
              <p className='text-xs md:text-[13px] text-gray-400 mt-1.5'>
                {moment().format("dddd Do MMM YYYY")}
              </p>
            </div>
            
          </div>
          {/* commented the project stats  */}
          {/* <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
            <InfoCard
              label="Total Projects"
              value={addThousandsSeperator(
                dashboardData?.statistics?.totalProjects || 0
              )}
              color = "bg-blue-500"
              >
            </InfoCard>
            <InfoCard
              label="Pending Projects"
              value={addThousandsSeperator(
                dashboardData?.statistics?.pendingprojects || 0
              )}
              color = "bg-violet-500"
              >
            </InfoCard>
            <InfoCard
              label="In Progress Projects"
              value={addThousandsSeperator(
                dashboardData?.statistics?.inProgressProjects || 0
              )}
              color = "bg-cyan-500"
              >
            </InfoCard>
            <InfoCard
              label="Completed Projects"
              value={addThousandsSeperator(
                dashboardData?.statistics?.completedProjects || 0
              )}
              color = "bg-green-500"
              >
            </InfoCard>
            
  
          </div> */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
            <InfoCard
              label="Total Tasks"
              value={addThousandsSeperator(
                dashboardData?.charts?.taskDistribution?.All || 0
              )}
              color = "bg-blue-500"
              >
            </InfoCard>
            <InfoCard
              label="Pending Tasks"
              value={addThousandsSeperator(
                dashboardData?.charts?.taskDistribution?.Todo || 0
              )}
              color = "bg-violet-500"
              >
            </InfoCard>
            <InfoCard
              label="In Progress Tasks"
              value={addThousandsSeperator(
                dashboardData?.charts?.taskDistribution?.InProgress || 0
              )}
              color = "bg-cyan-500"
              >
            </InfoCard>
            <InfoCard
              label="Completed Tasks"
              value={addThousandsSeperator(
                dashboardData?.charts?.taskDistribution?.Completed || 0
              )}
              color = "bg-green-500"
              >
            </InfoCard>
            
  
          </div>
        </div>
  
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4 md:my-6">
  
          {/* below div is for charts */}
  
          <div className="div">
            <div className="card">
              <div className="flex items-center justify-between">
                <h5 className='font-medium'>Task Distribution</h5>
              </div>
              <CustomPieChart
                data = {pieChartData}
                label='Total Balance'
                colors = {COLORS}
              ></CustomPieChart>
            </div>
          </div>
  
          {/* bar chart */}
          <div className="div">
            <div className="card">
              <div className="flex items-center justify-between">
                <h5 className='font-medium'>Tasks Priority Distribution</h5>
              </div>
              <CustomBarChart
                data = {barChartData}
              ></CustomBarChart>
            </div>
          </div>
  
          <div className="div">
            <div className="card">
              <div className="flex items-center justify-between">
                <h5 className='font-medium'>Project Distribution</h5>
              </div>
              <CustomPieChart
                data = {projectPieChartData}
                label='Total Balance'
                colors = {PROJECT_COLORS}
              ></CustomPieChart>
            </div>
          </div>
  
          {/* below div is for recent tasks table */}
          <div className="md:col-span-3">
            <div className="card">
              <div className="flex items-center justify-between">
                <h5 className="text-lg">Recent Tasks</h5>
  
                {/* <button className='card-btn'
                  onClick={onSeeMore}
                >
                  See All <LuArrowRight className='text-base'/>
                </button> */}
              </div>
  
              <TaskListTable tableData={dashboardData?.recentTasks || []} reloadFunction={getDashboardData} />
  
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
}

export default UserDashboard