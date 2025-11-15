import React from 'react'

const Progress = ({progress, status}) => {

    const getColor = ()=>{
        switch(status){
            case 'In Progress':
                return 'text-cyan bg-cyan-500 border border-cyan-500/10'
            case 'Completed':
                return 'text-green-700 bg-green-700 border border-500/10'
            default:
                return 'text-violet-500 bg-violet-500 border border-violet-500/10'
            
        }
    }

  return (
    <div className="w-full bg-gray-200 rouned-full h-1.5">
        <div className={`${getColor()} h-1.5 rounded-full text-center text-xs font-medium`} style={{ width: `${progress}%`}}>

        </div>
    </div>
  )
}

export default Progress