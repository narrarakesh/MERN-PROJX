import React, { useContext, useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuUsers } from 'react-icons/lu';
import Modals from '../layouts/Modals';
import fallBackUrl from '../../assets/fallbackImage.jpg'
import AvatarGroup from '../AvatarGroup';
import { UserContext } from '../../context/userContext';

const SelectedUsers = ({selectedUsers, setSelectedUsers}) => {

    const {user} = useContext(UserContext);

    const [allUsers , setAllUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

    const getAllusers = async ()=>{
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
            if(response.data?.length > 0){
                setAllUsers(response.data);
            }
        } catch (error) {
            console.error("Error fetching users: ", error);
        }
    }

    const toggleUserSelection = (userId)=>{
        setTempSelectedUsers((prev)=>
            prev.includes(userId)? prev.filter((id)=> id !== userId): [...prev, userId]
        )
    }

    const handleAssign = () =>{
        setSelectedUsers(tempSelectedUsers);
        setIsModalOpen(false);
    }

    const selectedUserAvatars = allUsers.filter((user)=> selectedUsers.includes(user._id)).map((user)=> user.profileImageUrl);

    useEffect(()=>{
        getAllusers();
    },[]);

    useEffect(()=>{
        if(selectedUsers && selectedUsers.length === 0){
            setTempSelectedUsers([]);
        }else{
            setTempSelectedUsers([...selectedUsers]);
        }

        return ()=>{}
    },[selectedUsers]);

  return (
    <div className='space-y-4 mt-2'>

        {selectedUserAvatars.length === 0 && (
            <button className='card-btn'
                onClick={()=> setIsModalOpen(true)}
            >
                <LuUsers className='text-sm'/> Add Members
            </button>
        )}

        {
            selectedUserAvatars.length > 0 && (
                <div className="cursor-pointer" onClick={()=> user.role != "Member" && setIsModalOpen(true)}>
                    <AvatarGroup avatars= {selectedUserAvatars} maxVisible ={3} />
                </div>
            )
        }

        <Modals isOpen={isModalOpen}
            onClose={()=> setIsModalOpen(false)}
            title = 'Select Users'
        >
            <div className="space-y-4 h-[60vh] overflow-y-auto">
                {allUsers.map((user)=>{
                    return <div key={"member_"+ user._id} className="flex items-center gap-4 p-3 border-b border-gray-200">
                        <img src={user.profileImageUrl || fallBackUrl} alt={user.name} 
                            className='w-14 h-14 rounded-full'
                        />
                        <div className="flex-1">
                            <p className='font-medium text-gray-800 dark:text-white'>{user.name}</p>
                            <p className="text-[13px] text-gray-500">{user.email}</p>
                        </div>

                        <input type="checkbox" name="" id=""
                            checked = {tempSelectedUsers.includes(user._id)}
                            onChange={()=> toggleUserSelection(user._id)}
                            className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm outline-none cursor-pointer'
                        />

                    </div>
                })}
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
                <button
                    className='card-btn'
                    onClick={()=> setIsModalOpen(false)}
                >Cancel</button>
                <button
                    className='card-btn-fill'
                    onClick={handleAssign}
                >Done</button>
            </div>

        </Modals>
    </div>
  )
}

export default SelectedUsers