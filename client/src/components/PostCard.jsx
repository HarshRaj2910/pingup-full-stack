import React, { useState } from 'react'
import { BadgeCheck, Heart, MessageCircle, Share2, Trash2, Send } from 'lucide-react'
import moment from 'moment'

import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const PostCard = ({post}) => {

    const postWithHashtags = post.content.replace(/(#\w+)/g, '<span class="text-indigo-600">$1</span>')
    const [likes, setLikes] = useState(post.likes_count || [])
    const [comments, setComments] = useState(post.comments || [])
    const [showComments, setShowComments] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [isDeleted, setIsDeleted] = useState(false)
    const currentUser = useSelector((state) => state.user.value)

    const { getToken } = useAuth()

    const handleLike = async () => {
        try {
            const { data } = await api.post(`/api/post/like`, {postId: post._id}, {headers: { Authorization: `Bearer ${await getToken()}` }})

            if (data.success){
               toast.success(data.message) 
               setLikes(prev =>{
                const userId = currentUser?._id
                if(!userId) return prev
                if(prev.includes(userId)){
                    return prev.filter(id=> id !== userId)
                }else{
                    return [...prev, userId]
                }
               })
            }else{
                toast(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const navigate = useNavigate()

    const handleDelete = async () => {
        try {
            const { data } = await api.post('/api/post/delete', { postId: post._id }, { headers: { Authorization: `Bearer ${await getToken()}` } })
            if(data.success) {
                toast.success(data.message)
                setIsDeleted(true)
            } else {
                toast.error(data.message)
            }
        } catch(error) {
            toast.error(error.message)
        }
    }

    if (isDeleted) return null;

    const handleShare = () => {
        const url = `${window.location.origin}/profile/${post.user._id}`;
        navigator.clipboard.writeText(url);
        toast.success("Profile link copied to clipboard!");
    }

    const handleComment = async (e) => {
        e.preventDefault();
        if(!commentText.trim()) return;
        try {
            const token = await getToken();
            const { data } = await api.post('/api/post/comment', {postId: post._id, text: commentText}, {headers: {Authorization: `Bearer ${token}`}});
            if(data.success) {
                setComments(data.comments);
                setCommentText('');
                toast.success("Comment added!");
            } else {
                toast.error(data.message);
            }
        } catch(error) {
            toast.error(error.message);
        }
    }

  return (
    <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
        {/* User Info & Actions */}
        <div className='flex items-center justify-between'>
            <div onClick={()=> navigate('/profile/' + post.user._id)} className='inline-flex items-center gap-3 cursor-pointer'>
                <img src={post.user?.profile_picture || ''} alt="" className='w-10 h-10 rounded-full shadow'/>
                <div>
                    <div className='flex items-center space-x-1'>
                        <span>{post.user?.full_name}</span>
                        <BadgeCheck className='w-4 h-4 text-blue-500'/>
                    </div>
                    <div className='text-gray-500 text-sm'>@{post.user?.username} • {moment(post.createdAt).fromNow()}</div>
                </div>
            </div>
            
            {currentUser?._id === post.user?._id && (
                <button onClick={handleDelete} className='text-gray-400 hover:text-red-500 transition cursor-pointer p-2 bg-gray-50 rounded-full'>
                    <Trash2 className='w-5 h-5'/>
                </button>
            )}
        </div>
         {/* Content */}
         {post.content && <div className='text-gray-800 text-sm whitespace-pre-line' dangerouslySetInnerHTML={{__html: postWithHashtags}}/>}

       {/* Images */}
       <div className='grid grid-cols-2 gap-2'>
            {(post.image_urls || []).map((img, index)=>(
                <img src={img} key={index} className={`w-full h-48 object-cover rounded-lg ${post.image_urls.length === 1 && 'col-span-2 h-auto'}`} alt="" />
            ))}
       </div>

        {/* Actions */}
        <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
            <div className='flex items-center gap-1 cursor-pointer hover:text-red-500 transition' onClick={handleLike}>
                <Heart className={`w-5 h-5 ${likes.includes(currentUser?._id) && 'text-red-500 fill-red-500'}`} />
                <span className='font-medium'>{likes.length}</span>
            </div>
            <div className='flex items-center gap-1 cursor-pointer hover:text-indigo-500 transition' onClick={()=>setShowComments(!showComments)}>
                <MessageCircle className="w-5 h-5"/>
                <span className='font-medium'>{comments.length}</span>
            </div>
            <div className='flex items-center gap-1 cursor-pointer hover:text-green-500 transition' onClick={handleShare}>
                <Share2 className="w-5 h-5"/>
                <span className='font-medium'>Share</span>
            </div>
        </div>

        {/* Comments Section */}
        {showComments && (
            <div className='pt-3 border-t border-gray-100'>
                <form onSubmit={handleComment} className='flex gap-2 mb-4'>
                    <input type="text" value={commentText} onChange={(e)=>setCommentText(e.target.value)} placeholder="Write a comment..." className='flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500' />
                    <button type="submit" disabled={!commentText.trim()} className='bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 transition'>
                        <Send className="w-4 h-4"/>
                    </button>
                </form>
                <div className='space-y-3 max-h-48 overflow-y-auto pr-2'>
                    {comments.map((comment, index) => (
                        <div key={index} className='flex gap-2 items-start'>
                            <img src={comment.user?.profile_picture || ''} className='w-8 h-8 rounded-full' alt=""/>
                            <div className='bg-gray-100 rounded-2xl px-3 py-2 flex-1'>
                                <p className='text-xs font-bold text-gray-900'>{comment.user?.full_name}</p>
                                <p className='text-sm text-gray-700'>{comment.text}</p>
                            </div>
                        </div>
                    ))}
                    {comments.length === 0 && <p className='text-xs text-center text-gray-500'>No comments yet.</p>}
                </div>
            </div>
        )}

    </div>
  )
}

export default PostCard
