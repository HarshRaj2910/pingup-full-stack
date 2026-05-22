import { BadgeCheck, X, Trash2, Eye, MessageCircle, Send } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import moment from 'moment'

const StoryViewer = ({viewStory, setViewStory}) => {

    const [progress, setProgress] = useState(0)
    const [showComments, setShowComments] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [localStory, setLocalStory] = useState(null)
    const currentUser = useSelector((state) => state.user.value)
    const { getToken } = useAuth()

    useEffect(() => {
        if(viewStory) setLocalStory(viewStory);
    }, [viewStory])

    useEffect(()=>{
        let timer, progressInterval;

        if(viewStory && viewStory.media_type !== 'video' && !showComments){
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

    }, [viewStory, currentUser, getToken, setViewStory, showComments])

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

    const handleComment = async (e) => {
        e.preventDefault()
        if(!commentText.trim()) return
        
        try {
            const token = await getToken()
            const { data } = await api.post('/api/story/comment', { storyId: viewStory._id, text: commentText }, { headers: { Authorization: `Bearer ${token}` } })
            if(data.success){
                setLocalStory(data.story)
                setCommentText('')
            } else {
                toast.error(data.message)
            }
        } catch(error) {
            toast.error(error.message)
        }
    }

    if(!localStory) return null

    const renderContent = ()=>{
        switch (localStory.media_type) {
            case 'image':
                return (
                    <img src={localStory.media_url} alt="" className='max-w-full max-h-screen object-contain'/>
                );
            case 'video':
                return (
                    <video onEnded={()=>setViewStory(null)} src={localStory.media_url} className='max-h-screen' controls autoPlay/>
                );
            case 'text':
                return (
                    <div className='w-full h-full flex items-center justify-center p-8 text-white text-2xl text-center'>
                        {localStory.content}
                    </div>
                );
        
            default:
                return null;
        }
    }

  return (
    <div className='fixed inset-0 h-screen bg-black bg-opacity-90 z-[110] flex items-center justify-center' style={{backgroundColor: localStory.media_type === 'text' ? localStory.background_color : '#000000'}}>
      
      {/* Progress Bar */}
      <div className='absolute top-0 left-0 w-full h-1 bg-gray-700'>
        <div className='h-full bg-white transition-all duration-100 linear' style={{width: `${progress}%`}}>

        </div>
      </div>
      {/* User Info - Top Left */}
      <div className='absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50 z-50'>
        <img src={localStory.user?.profile_picture} alt="" className='w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white'/>
        <div className='text-white font-medium flex items-center gap-1.5'>
            <span>{localStory.user?.full_name}</span>
            <BadgeCheck size={18}/>
        </div>
      </div>

       {/* Action Buttons */}
       <div className='absolute top-4 right-4 flex items-center gap-4 z-50'>
           {currentUser && localStory.user && (currentUser._id === localStory.user._id || currentUser._id === localStory.user) && (
               <>
               <div className='group relative flex items-center gap-2 text-white bg-black/50 px-3 py-1.5 rounded-full cursor-pointer hover:bg-black/80 transition'>
                   <Eye size={18} />
                   <span className='text-sm font-medium'>{localStory.views_count?.length || 0}</span>
                   {/* Dropdown for viewers */}
                   <div className='absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden'>
                       <div className='p-2 bg-slate-50 border-b border-slate-100'>
                           <p className='text-xs font-semibold text-slate-700'>Viewed by</p>
                       </div>
                       <div className='max-h-48 overflow-y-auto'>
                           {localStory.views_count && localStory.views_count.length > 0 ? (
                               localStory.views_count.map((viewer, idx) => (
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
           <button onClick={() => setShowComments(!showComments)} className={`text-white focus:outline-none bg-black/50 p-2 rounded-full hover:bg-black/80 transition cursor-pointer flex items-center gap-1 ${showComments ? 'bg-indigo-600' : ''}`}>
               <MessageCircle className='w-6 h-6'/>
               <span className='text-xs font-bold'>{localStory.comments?.length || 0}</span>
           </button>
           <button onClick={handleClose} className='text-white focus:outline-none bg-black/50 p-2 rounded-full hover:bg-black/80 transition cursor-pointer'>
               <X className='w-6 h-6 hover:scale-110'/>
           </button>
       </div>

       {/* Content Wrapper */}
       <div className={`transition-all duration-300 w-full h-full flex items-center justify-center ${showComments ? 'lg:w-[70%] lg:mr-[30%]' : ''}`}>
            <div className='max-w-[90vw] max-h-[90vh] flex items-center justify-center'>
                 {renderContent()}
            </div>
       </div>

       {/* Comments Panel */}
       {showComments && (
           <div className='absolute bottom-0 right-0 w-full lg:w-[30%] h-[50vh] lg:h-full bg-white flex flex-col shadow-2xl animate-in slide-in-from-bottom lg:slide-in-from-right duration-300 z-50 rounded-t-3xl lg:rounded-none lg:border-l border-gray-200'>
               <div className='p-4 border-b border-gray-200 flex items-center justify-between bg-slate-50 lg:rounded-tl-3xl'>
                   <h3 className='font-bold text-gray-800 flex items-center gap-2'>
                       <MessageCircle size={20} className="text-indigo-600"/> Comments
                   </h3>
                   <button onClick={() => setShowComments(false)} className='p-1 hover:bg-gray-200 rounded-full transition cursor-pointer'>
                       <X size={20} className='text-gray-500'/>
                   </button>
               </div>
               
               <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                   {localStory.comments && localStory.comments.length > 0 ? (
                       localStory.comments.map((comment, idx) => (
                           <div key={idx} className='flex items-start gap-3'>
                               <img src={comment.user?.profile_picture} alt="" className='w-8 h-8 rounded-full object-cover'/>
                               <div className='bg-slate-100 p-3 rounded-2xl rounded-tl-none'>
                                   <p className='text-xs font-bold text-gray-800 mb-1'>{comment.user?.full_name}</p>
                                   <p className='text-sm text-gray-700'>{comment.text}</p>
                                   <p className='text-[10px] text-gray-400 mt-1'>{moment(comment.createdAt).fromNow()}</p>
                               </div>
                           </div>
                       ))
                   ) : (
                       <div className='h-full flex items-center justify-center text-gray-400 text-sm'>
                           No comments yet. Be the first!
                       </div>
                   )}
               </div>

               <div className='p-4 border-t border-gray-200 bg-white'>
                   <form onSubmit={handleComment} className='flex items-center gap-2'>
                       <input 
                           type="text" 
                           placeholder="Type a comment..." 
                           value={commentText}
                           onChange={(e) => setCommentText(e.target.value)}
                           className='flex-1 bg-slate-100 text-sm p-3 rounded-full outline-none focus:ring-2 focus:ring-indigo-500 transition'
                       />
                       <button type="submit" disabled={!commentText.trim()} className='p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer'>
                           <Send size={18}/>
                       </button>
                   </form>
               </div>
           </div>
       )}
    </div>
  )
}

export default StoryViewer
