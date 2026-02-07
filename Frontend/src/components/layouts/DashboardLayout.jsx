import React, { Suspense, useContext } from 'react'
const Navbar = React.lazy(() => import('./Navbar'));
const SideMenu = React.lazy(() => import('./SideMenu'));
import { UserContext } from '../../context/userContext';
import Skeleton from './Skeleton';

const DashboardLayout = ({children, activeMenu}) => {

  const {user} = useContext(UserContext);  

  if(!user) return null;

  return (
    <div className=''>
        {/* < Navbar activeMenu={activeMenu}/> */}
        <Suspense fallback={<Skeleton className="h-16 w-full" />}>
          <div className="sticky top-0 z-50">
            <Navbar activeMenu={activeMenu} />
          </div>
        </Suspense>
        <div className="flex">
          <Suspense fallback={<Skeleton className="w-64 h-[calc(100vh-64px)]" />}>
            <div className="hidden lg:block">
              <SideMenu activeMenu={activeMenu} />
            </div>
          </Suspense>

          {/* Main content */}
          <div className="grow mx-5">{children}</div>
        </div>
      

    </div>
  )
}

export default DashboardLayout