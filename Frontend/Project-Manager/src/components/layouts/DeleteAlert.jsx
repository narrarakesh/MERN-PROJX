import React from 'react'


const DeleteAlert = ({content, onDelete}) => {
  return (
    <div>
        <p className='text-sm'>{content}</p>
        <div className="flex justify-end mt-6">
            <button
                type='button'
                className='items-center gap-3 text-xs md:text-sm text-[12px] font-medium text-red-700 hover:text-red-500 bg-red-50 hover:bg-red-50 px-4 py-2 rounded-lg border border-red-200/50 whitespace-nowrap cursor-pointer'
                onClick={onDelete}
            >Delete</button>
        </div>
    </div>
  )
}

export default DeleteAlert