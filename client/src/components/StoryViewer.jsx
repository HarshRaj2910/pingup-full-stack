import { BadgeCheck, X, Trash2, Eye } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const StoryViewer = ({viewStory, setViewStory}) => {

    const [progress, setProgress] = useState(0)
    const currentUser = useSelector((state) => state.user.value)
    const { getToken } = useAuth()

    useEffect(()=>{
        let timer, progressInterval;

        if(viewStory && viewStory.media_type !== 'video'){
            setProgress(0)

            const duration = 10000;
            const setTime = 100;
            let elapsed = 0;

           progressInterval = setInterval(() => {
                elapsed += setTime;
                setProgress((elapsed / duration) * 100);
            }, setTime);

             // Close story after duration(10sec)
             timer = setTimeout(()=>{
                setViewStory(null)
             }, duration)
        }

        const markView = async () => {
            if(viewStory && currentUser && (viewStory.user?._id !== currentUser._id && viewStory.user !== currentUser._id)) {
                try {
                    const token = await getToken();
                    await api.post('/api/story/view', { storyId: viewStory._id }, { headers: { Authorization: `Bearer ${token}` } });
                } catch(error) {
                    console.error("Failed to mark story as viewed", error);
                }
            }
        }
        markView();

        return ()=>{
            clearTimeout(timer);
            clearInterval(progressInterval)
        }

    }, [viewStory, currentUser, getToken, setViewStory])

    const handleClose = ()=>{
        setViewStory(null)
    }

    const handleDelete = async () => {
        try {
            const token = await getToken()
            const { data } = await api.post('/api/story/delete', { storyId: viewStory._id }, { headers: { Authorization: `Bearer ${token}` } })
            if(data.success){
                toast.success(data.message)
                setViewStory(null)
            } else {
                toast.error(data.message)
            }
        } catch(error) {
            toast.error(error.message)
        }
    }

    if(!viewStory) return null

    const renderContent = ()=>{
        switch (viewStory.media_type) {
            case 'image':
                return (
                    <img src={viewStory.media_url} alt="" className='max-w-full max-h-screen object-contain'/>
                );
            case 'video':
                return (
                    <video onEnded={()=>setViewStory(null)} src={viewStory.media_url} className='max-h-screen' controls autoPlay/>
                );
            case 'text':
                return (
                    <div className='w-full h-full flex items-center justify-center p-8 text-white text-2xl text-center'>
                        {viewStory.content}
                    </div>
                );
        
            default:
                return null;
        }
    }

  return (
    <div className='fixed inset-0 h-screen bg-black bg-opacity-90 z-110 flex items-center justify-center' style={{backgroundColor: viewStory.media_type === 'text' ? viewStory.background_color : '#000000'}}>
      
      {/* Progress Bar */}
      <div className='absolute top-0 left-0 w-full h-1 bg-gray-700'>
        <div className='h-full bg-white transition-all duration-100 linear' style={{width: `${progress}%`}}>

        </div>
      </div>
      {/* User Info - Top Left */}
      <div className='absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50'>
        <img src={viewStory.user?.profile_picture} alt="" className='ize-7 sm:size-8 rounded-full object-cover border border-white'/>
        <div className='text-white font-medium flex items-center gap-1.5'>
            <span>{viewStory.user?.full_name}</span>
            <BadgeCheck size={18}/>
        </div>
      </div>

       {/* Action Buttons */}
       <div className='absolute top-4 right-4 flex items-center gap-4 z-50'>
           {currentUser && viewStory.user && (currentUser._id === viewStory.user._id || currentUser._id === viewStory.user) && (
               <>
               <div className='group relative flex items-center gap-2 text-white bg-black/50 px-3 py-1.5 rounded-full cursor-pointer hover:bg-black/80 transition'>
                   <Eye size={18} />
                   <span className='text-sm font-medium'>{viewStory.views_count?.length || 0}</span>
                   {/* Dropdown for viewers */}
                   <div className='absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden'>
                       <div className='p-2 bg-slate-50 border-b border-slate-100'>
                           <p className='text-xs font-semibold text-slate-700'>Viewed by</p>
                       </div>
                       <div className='max-h-48 overflow-y-auto'>
                           {viewStory.views_count && viewStory.views_count.length > 0 ? (
                               viewStory.views_count.map((viewer, idx) => (
                                   <div key={idx} className='flex items-center gap-2 p-2 hover:bg-slate-50 transition'>
                                       <img src={viewer.profile_picture || viewer} className='w-6 h-6 rounded-full bg-slate-200 object-cover' alt="" />
                                       <span className='text-sm text-slate-700 truncate'>{viewer.full_name || 'User'}</span>
                                   </div>
                               ))
                           ) : (
                               <div className='p-3 text-center text-xs text-slate-500'>No views yet</div>
                           )}
                       </div>
                   </div>
               </div>
               <button onClick={handleDelete} className='text-white focus:outline-none bg-black/50 p-2 rounded-full hover:bg-black/80 transition cursor-pointer'>
                   <Trash2 className='w-6 h-6 hover:text-red-500'/>
               </button>
               </>
           )}
           <button onClick={handleClose} className='text-white focus:outline-none bg-black/50 p-2 rounded-full hover:bg-black/80 transition cursor-pointer'>
               <X className='w-6 h-6 hover:scale-110'/>
           </button>
       </div>

       {/* Content Wrapper */}
       <div className='max-w-[90vw] max-h-[90vh] flex items-center justify-center'>
            {renderContent()}
       </div>
    </div>
  )
}

export default StoryViewer
