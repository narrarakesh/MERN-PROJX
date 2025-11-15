import React, { useState } from 'react'
import { LuChevronDown } from 'react-icons/lu'

const SelectDropdown = ({options,value,onChange,placeholder}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) =>{
        onChange(option);
        setIsOpen(!isOpen);
    }

  return (
    <div className="relative w-full">
        {/* Dropdown Button  */}
        <button
            onClick={()=> setIsOpen(!isOpen)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className='w-full text-sm text-black outline-none bg-white border border-slate-300 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center'
        >
            {value ? options.find((opt)=> opt.value === value)?.label : placeholder}
            <span className='ml-2'><LuChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} /></span>
        </button>

        {/* Dropdoen Menu  */}

        { isOpen && (
            <div className="absolute w-full bg-white border border-slate-100 rounded-md mt-1 shadow-md z-10">
                {options.map((option)=>{
                    return <div
                        key={option.value}
                        className='py-2 px-3 text-sm cursor-pointer hover:bg-gray-100'
                        onClick={()=> handleSelect(option.value)}
                    >
                        {option.label}
                    </div>
                })}
            </div>
        )}

    </div>
  )
}

export default SelectDropdown