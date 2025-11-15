import React from 'react'
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

const Modals = ({children, isOpen , onClose, title}) => {

    if(!isOpen) return;


//   return (
//     <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-start w-full h-full max-h-full overflow-y-auto overflow-x-hidden bg-black/20 bg-opactity-50">
//         <div className="relative w-full p-4 max-w-2xl h-full">
//         {/* Modal Content  */}
//             <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
//                 {/* Modal Header  */}
//                 <div className="flex justify-between items-center p-4 md:p-5 border rounded-t dark:border-gray-600 border-gray-200">
//                     <h3 className='text-lg font-medium text-gray-900 dark:text-white'>{title}</h3>
//                     <button
//                         type='button'
//                         className='text-gray-400 bg-transparent hover:btn-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center
//                         dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer'
//                         onClick={onClose}
//                     >
//                         <IoMdClose className='w-6 h-6' />
//                     </button>
//                 </div>
//                 {/* Modal body  */}

//                 <div className="p-4 md:p-5 space-y-4 overflow-y-auto">
//                     {children}
//                 </div>

//             </div>
//         </div>
//     </div>
//   );

    return (
    <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto bg-black/20">
      <div className="relative w-full max-w-2xl max-h-[95vh] bg-white rounded-lg shadow-sm flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 md:p-5 border-b border-gray-200">
          <h3 className='text-lg font-medium text-gray-900'>{title}</h3>
          <button
            type='button'
            className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center'
            onClick={onClose}
          >
            <IoMdClose className='w-6 h-6' />
          </button>
        </div>

        {/* Modal Body (scrollable if content exceeds height) */}
        <div className="p-4 md:p-5 space-y-4 overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  );
}

export default Modals