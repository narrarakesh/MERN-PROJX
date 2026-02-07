import React, { Suspense } from 'react'
// import UI_img from '../../assets/UI_Img.png';
const LazyImage = React.lazy(() => import('../LazyImage')); 

const AuthLayout = ({ children }) => {
  return (
    <div className='flex'>
        <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
            <h1 className='text-2xl font-bold text-black'>ProjeX</h1>
            <p className='font-light text-gray-800'>Designed for individuals and teams — simple, powerful project management for all.</p>
            {children}
        </div>

        <div className='hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-500' >
          <Suspense fallback={null}>
            <LazyImage />
          </Suspense>
        </div>
    </div>

  )
}

export default AuthLayout