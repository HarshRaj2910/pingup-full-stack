import React from 'react'

import { Eye, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Messages = () => {

  const connections = useSelector((state)=> state.connections?.connections || [])
  const navigate = useNavigate()

  return (
    <div className='min-h-screen relative bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6 md:p-10'>
        {/* Title */}
        <div className='mb-10 text-center md:text-left'>
          <h1 className='text-4xl font-extrabold text-slate-900 tracking-tight mb-2'>Messages</h1>
          <p className='text-slate-500 text-lg'>Talk to your friends and family</p>
        </div>

        {/* Connected Users */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {connections.map((user)=>(
            <div key={user._id} className='group flex flex-col p-6 bg-white shadow-sm hover:shadow-xl rounded-2xl transition-all duration-300 border border-slate-100 hover:border-indigo-100'>
              <div className='flex items-start gap-4'>
                  <div className='relative'>
                      <img src={user.profile_picture} alt="" className='rounded-full w-16 h-16 object-cover border-2 border-white shadow-sm group-hover:border-indigo-50 transition-colors'/>
                      <div className='absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full'></div>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='font-bold text-slate-800 text-lg truncate group-hover:text-indigo-600 transition-colors'>{user.full_name}</p>
                    <p className='text-slate-500 text-sm font-medium truncate'>@{user.username}</p>
                  </div>
              </div>
              
              <p className='text-sm text-slate-600 mt-4 line-clamp-2 h-10'>
                  {user.bio || 'Available for chat'}
              </p>

              <div className='flex items-center gap-3 mt-6 pt-4 border-t border-slate-50'>
                <button onClick={()=> navigate(`/messages/${user._id}`)} className='flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white transition-colors cursor-pointer'>
                  <MessageSquare className="w-4 h-4"/>
                  Message
                </button>

                <button onClick={()=> navigate(`/profile/${user._id}`)} className='flex items-center justify-center size-10 text-sm rounded-xl bg-slate-50 hover:bg-slate-800 text-slate-600 hover:text-white transition-colors cursor-pointer'>
                  <Eye className="w-4 h-4"/>
                </button>
              </div>

            </div>
          ))}
          {connections.length === 0 && (
              <div className='col-span-full flex flex-col items-center justify-center py-20 text-slate-500'>
                  <MessageSquare className='w-16 h-16 mb-4 text-slate-300'/>
                  <p className='text-lg font-medium'>No connections yet</p>
                  <p className='text-sm'>Connect with people to start messaging</p>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages
