import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Side_Menu_Data, Side_Menu_User_Data } from '../../utils/data';
import fallBackImage from '../../assets/fallbackImage.jpg'
import { UserContext } from '../../context/userContext';

const SideMenu = ({ activeMenu }) => {



  const {user , clearUser} = useContext(UserContext);
  const [SideMenuData, setSideMenuData] = useState([]);

  const navigate = useNavigate();

  const handleClick = (route) => {
    if(route === 'logout'){
      handleLogout();
      return;
    }
    navigate(route);
  }

  const handleLogout = ()=>{
    localStorage.clear(); //local storage is used to JWT token for authentication
    clearUser(); //to remove user state
    navigate('/login');
  }

  // intital loading the data.
  useEffect(()=>{
    if(user){
      setSideMenuData(user?.role === 'Admin' ? Side_Menu_Data: Side_Menu_User_Data);
    }
    return ()=>{};
  },[user]);



  return (
    <div className='w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20'>
      <div className="flex flex-col items-center justify-between h-[calc(90vh-60px)] mb-7 pt-5">
        <div className='w-64'>
          { SideMenuData.map((item, index)=>{
            return <button key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-[15px] ${
              activeMenu == item.label ? 
              'text-blue-700 bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-4 rounded':
              ''
            } py-3 px-6 mb-3 cursor-pointer`}
            onClick={()=> handleClick(item.path)}
            > <item.icon className="text-xl"/> {item.label}</button>
            
            
          })}
        </div>
        


        <div className="flex flex-col items-center justify-center"> {/* This is for user profile and details */}
          <div className="mb-2 relative p-[3px] rounded-full border border-blue-500 bg-gradient-to-tr from-blue-100 via-white to-pink-100 shadow-md hover:shadow-lg transition duration-300">
            <img className='w-20 h-20 bg-slate-400 object-cover rounded-full ' src={user.profileImageUrl || fallBackImage} alt="" />
          </div>
          {/* Role badge */}
          <div className="text-xs bg-blue-600 text-white font-semibold px-3 py-0.5 rounded-full shadow-sm">
            {user.role}
          </div>

          <h5 className='text-gray-950 font-medium leading-6 mt-3'>
            {user?.name || ''}
          </h5>
          <p className='text-[12px]  text-gray-500'>{user?.email || ''}</p>
        </div>

      </div>
    </div>
  )
}

export default SideMenu