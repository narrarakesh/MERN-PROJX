import React from 'react'
import Progress from '../Progress';
import AvatarGroup from '../AvatarGroup';
import { LuPaperclip } from 'react-icons/lu';
import moment from 'moment';

const ProjectCard = ({
                name,
                description,
                priority,
                status,
                progress, 
                endDate,
                startDate, 
                members,
                attachmentCount,
                completedTasks,
                totalTasks,
                onClick
}) => {

    const getStatusTagColor = ()=>{
        switch(status){
            case "In Progress": 
                return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
            case "Completed":
                return "text-green-500 bg-green-50 border border-green-500/10";
            default: 
                return "text-violet-500 bg-violet-50 border border-violet-500/10";
        }
    }

    const getPriorityTagColor = () =>{
        switch(priority){
            case 'Low':
                return 'text-indigo-500 bg-indigo-50 border border-indigo-500/10';
            case 'Medium':
                return 'text-orange-500 bg-orange-50 border border-orange-500/10';

            default:
                return 'text-rose-500 bg-rose-50 border border-rose-500/10';
        }
    }

  return (
    <>
    
    <div className="bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer"
        onClick={onClick}>
        <div className="flex items-end gap-3 px-4">
            <div className={`text-[11px]  font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}
            >{status}</div>
            <div className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded`}
            >{priority} Priority</div>
        </div>
        <div className={`px-4  border-l-[3px] ${
            status === "In Progress" ?
            "border-cyan-500": 
            status === "Completed" ? "border-green-800": "border-violet-800"
        } `}>
            <p className='text-sm font-medium text-gray-800 mt-4 line-clamp-2'>{name}</p>
            <p className='text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]'>{description}</p>
            <p className='text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]'>Tasks Done: {" "}
                <span className='font-semibold text-blue-800'>{completedTasks}</span><span className='font-semibold text-gray-700'>/{totalTasks}</span>
            </p>
            <Progress progress = {progress} status={status} />
        </div>

        <div className="px-4">
            <div className="flex items-center justify-between my-1">
                <div className=""> 
                    <label  className='text-xs text-gray-500'>Start Date</label>
                    <p className='text-[13px] font-medium text-gray-900'>{moment(startDate).format("Do MMM YYYY")}</p>
                </div>
                <div className=""> 
                    <label  className='text-xs text-gray-500'>End Date</label>
                    <p className='text-[13px] font-medium text-gray-900'>{moment(endDate).format("Do MMM YYYY")}</p>
                </div>
            </div>
            <div className="flex justify-between items-center mt-3">
                <AvatarGroup avatars={members || []} />

                {attachmentCount >= 0 && (
                    <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg">
                        <LuPaperclip className='text-blue-700'/>{" "}
                        <span className='text-xs text-gray-900'>{attachmentCount}</span>
                    </div>
                )}
            </div>
        </div>
        
    </div>

    

    </>
  )
}

export default ProjectCard