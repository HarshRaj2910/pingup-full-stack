import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PenBox } from 'lucide-react'

import { useEffect } from 'react'
import Loading from '../components/Loading'
import UserProfileInfo from '../components/UserProfileInfo'
import PostCard from '../components/PostCard'
import moment from 'moment'
import ProfileModal from '../components/ProfileModal'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

const Profile = () => {

  const currentUser = useSelector((state) => state.user.value)

  const {getToken} = useAuth()
  const {profileId} = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEdit, setShowEdit] = useState(false)

  useEffect(()=>{
    const fetchUser = async (profileId) => {
      const token = await getToken()
      try {
        const { data } = await api.post(`/api/user/profiles`, {profileId}, {
          headers: {Authorization: `Bearer ${token}`}
        })
        if(data.success){
          setUser(data.profile)
          setPosts(data.posts)
          setLikedPosts(data.likedPosts || [])
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    if(profileId){
      fetchUser(profileId)
    }else if(currentUser?._id){
      fetchUser(currentUser._id)
    }
  },[profileId, currentUser, getToken])

  return user ? (
    <div className='relative h-full overflow-y-scroll bg-gray-50 p-6'>
      <div className='max-w-3xl mx-auto'>
        {/* Profile Card */}
        <div className='bg-white rounded-2xl shadow overflow-hidden'>
          {/* Cover Photo */}
          <div className='h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 relative group'>
            {user.cover_photo && <img src={user.cover_photo} alt='' className='w-full h-full object-cover'/>}
            {!profileId && (
                <button onClick={()=> setShowEdit(true)} className='absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition cursor-pointer flex items-center gap-2 text-sm'>
                    <PenBox className="w-4 h-4"/>
                    <span className='hidden sm:block'>Edit Cover</span>
                </button>
            )}
          </div>
          {/* User Info */}
          <UserProfileInfo user={user} posts={posts} profileId={profileId} setShowEdit={setShowEdit} setActiveTab={setActiveTab}/>
        </div>

        {/* Tabs */}
        <div className='mt-6'>
          <div className='bg-white rounded-xl shadow p-1 flex max-w-2xl mx-auto overflow-x-auto'>
            {["posts", "video", "likes"].map((tab)=>(
              <button onClick={()=> setActiveTab(tab)} key={tab} className={`flex-1 min-w-[80px] px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-gray-900"}`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {/* Posts */}
          {activeTab === 'posts' && (
            <div className='mt-6 flex flex-col items-center gap-6'>
              {posts.map((post)=> <PostCard key={post._id} post={post}/>)}
            </div>
          )}

        {/* Video */}
          {activeTab === 'video' && (
            <div className='mt-6 flex flex-col items-center gap-6'>
              {posts.filter((post)=>post.post_type === 'video').length > 0 ? (
                  posts.filter((post)=>post.post_type === 'video').map((post)=> <PostCard key={post._id} post={post}/>)
              ) : (
                  <p className='text-gray-500 mt-10'>No videos posted yet.</p>
              )}
            </div>
          )}

          {/* Likes */}
          {activeTab === 'likes' && (
              <div className='mt-6 flex flex-col items-center gap-6'>
                  {likedPosts.length > 0 ? (
                      likedPosts.map(post => <PostCard key={post._id} post={post}/>)
                  ) : (
                      <p className='text-gray-500 mt-10'>No liked posts yet.</p>
                  )}
              </div>
          )}
        
        </div>
      </div>
      {/* Edit Profile Modal */}
      {showEdit && <ProfileModal setShowEdit={setShowEdit}/>}
    </div>
  ) : (<Loading />)
}

export default Profile
