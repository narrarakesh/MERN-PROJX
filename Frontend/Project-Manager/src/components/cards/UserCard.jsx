import React from 'react'
import fallBackImage from './../../assets/fallbackImage.jpg'

const UserCard = ({userInfo}) => {
  return (
    <>
        <div className="user-card p-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={userInfo?.profileImageUrl || fallBackImage} alt={`Avatar`}
                        className='w-12 h-12 rounded-full border-2 border-white'
                    />

                    <div className="">
                        <p className="text-sm font-medium">
                            {userInfo?.name}
                        </p>
                        <p className="text-xs text-gray-700">
                            {userInfo?.email}
                        </p>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <div className="">
                    <p className='text-sm font-medium text-gray-700'>Projects</p>
                </div>
                <div className="flex items-end gap-3 mt-2 ml-1">
                    <StatCard 
                        label="Yet To Start"
                        count= {userInfo?.pendingProjects || 0}
                        status = "Yet to Start"
                    />
                    <StatCard 
                        label="In Progress"
                        count= {userInfo?.inProgressProjects || 0}
                        status = "In Progress"
                    />
                    <StatCard 
                        label="Completed"
                        count= {userInfo?.completedProjects || 0}
                        status = "Completed"
                    />
                </div>
            </div>
            <div className="mt-5">
                <div className="">
                    <p className='text-sm font-medium text-gray-700'>Tasks</p>
                </div>
                <div className="flex items-end gap-3 mt-2 ml-1">
                    <StatCard 
                        label="Todo"
                        count= {userInfo?.pendingTasks || 0}
                        status = "Todo"
                    />
                    <StatCard 
                        label="In Progress"
                        count= {userInfo?.inProgressTasks || 0}
                        status = "In Progress"
                    />
                    <StatCard 
                        label="Completed"
                        count= {userInfo?.completedTasks || 0}
                        status = "Completed"
                    />
                </div>
            </div>
            
        </div>
    </>
  )
}

export default UserCard


const StatCard = ({label, count, status})=>{
    
    const getStatusColor = ()=>{
        switch(status){
            case "In Progress":
                return "text-cyan-500 bg-cyan-50";
            case "Completed":
                return "text-indigo-500 bg-indigo-50";
            default:
                return "text-violet-500 bg-violet-50"
        }
    }
    
    return <>
        <div className={`flex-1 text-[10px] font-medium ${getStatusColor()} px-4 py-1.5 rounded`}>
            <span className="text-[12px] font-semibold ">
                {count}<br/>
                {label}
            </span>
        </div>
    </>


}