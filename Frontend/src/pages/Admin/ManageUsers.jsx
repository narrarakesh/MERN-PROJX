import React, { useCallback, useEffect, useState } from 'react'
import DashboardLayout from './../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import UserCard from '../../components/cards/UserCard';

const ManageUsers = () => {

  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading]=useState(true);

  const getAllUsers = useCallback(async ()=>{
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if(response.data?.length > 0){
        setAllUsers(response.data);
        sessionStorage.setItem('allUsers',JSON.stringify(response.data || []));
      }
    } catch (error) {
      console.log("Error fetching users: ", error);
    } finally{
      setLoading(false);
    }
  },[]);

  useEffect(()=>{
    const cached = sessionStorage.getItem('allUsers');
    if(cached){
      setAllUsers(JSON.parse(cached))
      setLoading(false);
    }
      getAllUsers();
  },[getAllUsers])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) getAllUsers();
    }, 60000);

    return () => clearInterval(interval);
  }, [getAllUsers]);


  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className='text-xl font-medium md:text-xl'>Team Members</h2>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {loading ? (
            <p className="text-gray-500 col-span-full">Loading users...</p>
          ) : allUsers.length > 0 ? (
            allUsers.map((user) => <UserCard key={user._id} userInfo={user} />)
          ) : (
            <p className="text-gray-500 col-span-full">No team members found.</p>
          )}
        </div>


      </div>
    </DashboardLayout>
  )
}

export default ManageUsers