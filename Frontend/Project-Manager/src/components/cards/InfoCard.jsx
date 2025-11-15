import React from 'react'

const InfoCard = ({label, value, color}) => {
  return (
    <div className='flex items-center gap-3'>
        <div className={`w-2 md:w-2 h-4 md:h-4 ${color} rounded`}></div>
            <p className='text-xs md:text-[14px] text-gray-500'>
                <span className='text-sm md:text-[15px] text-black font-semibold'>{value}</span> {label}
            </p>
    </div>
  )
}

export default InfoCard
// import { LuCircleCheck, LuTimer  } from 'react-icons/lu';
// import { IoHourglassOutline } from "react-icons/io5";



// import { FiList, FiCheckCircle, FiPlayCircle, FiClock } from 'react-icons/fi';

// const getIconByLabel = (label, color) => {
//   switch (label) {
//     case 'Total Tasks':
//       return <FiList className={`w-8 h-8 ${color}`} />;
//     case 'Completed Tasks':
//       return <LuCircleCheck className={`w-8 h-8 ${color}`} />;
//     case 'In Progress Tasks':
//       return <IoHourglassOutline className={`w-8 h-8 ${color}`} />;
//     case 'Pending Tasks':
//       return <LuTimer className={`w-8 h-8 ${color}`} />;
//     default:
//       return <FiList className={`w-8 h-8 ${color}`} />;
//   }
// };

// const InfoCard = ({ label, value, color }) => {
//   return (
//     <div className="flex items-center gap-3">
//       {getIconByLabel(label, color)}
//       <div className="flex flex-col justify-center">
//         <span className="text-base md:text-lg font-semibold text-gray-900 leading-tight">{value}</span>
//         <span className="text-xs md:text-sm text-gray-500 mt-0.5">{label}</span>
//       </div>
//     </div>
//   );
// };

// export default InfoCard;


