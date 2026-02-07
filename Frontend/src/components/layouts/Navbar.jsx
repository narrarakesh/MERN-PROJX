import React, { memo, useState } from 'react'
import {HiOutlineMenu, HiOutlineX} from 'react-icons/hi'
const SideMenu = React.lazy(() => import('./SideMenu'));

const Navbar = ({activeMenu}) => {

    const [openSideMenu, setOpenSideMenu]= useState(false);

  return (
    <div className= ' flex gap-5 bh-white border border-gray-200/50 backdrop-blur-2xl py-4 px-3 '>   
        <button
            className='block lg:hidden text-black'
            onClick={()=> {setOpenSideMenu(!openSideMenu)}}
        >
            {openSideMenu ? (
                <HiOutlineX className='text-2xl'/>
            ):(
                <HiOutlineMenu className='text-2xl'/>
            )}
        </button>

        <h2 className='text-lg font-medium text-black '> ProjeX </h2>

        {
            openSideMenu && (
                <div className="fixed top-[61px] -ml-4 bg-white">
                    <Suspense fallback={<Skeleton className="w-64 h-full" />}>
                        <SideMenu activeMenu={activeMenu} />
                    </Suspense>
                </div>
            )
        }

    </div>
  )
}

export default memo(Navbar)