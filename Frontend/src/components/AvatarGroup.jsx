import fallBackImg from '../assets/fallbackImage.jpg'
import React from 'react'

const AvatarGroup = ({avatars, maxVisible=3}) => {
  return (
    <div className='flex items-center'>
        {avatars.slice(0, maxVisible).map((avatar, index)=>{
            return (<img
                        key = {index}
                        src={avatar || fallBackImg}
                        alt={`Avatar ${index}`}
                        className='w-8 h-8 md:w-10 md:h-10 rounded-full border-white -ml-3 first:ml-0'/>
                )
        })}

        {avatars.length > maxVisible && (
            <div className="w-7 h-7 md:w-9 md:h-9 flex  items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3">
                +{avatars.length-maxVisible}
            </div>
        )}
    </div>
  )
}

export default AvatarGroup 