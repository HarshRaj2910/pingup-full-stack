import React, { useEffect, useState } from 'react'

import { Search } from 'lucide-react'
import UserCard from '../components/UserCard'
import PostCard from '../components/PostCard'
import Loading from '../components/Loading'
import api from '../api/axios'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { fetchUser } from '../features/user/userSlice'

const Discover = () => {

  const dispatch = useDispatch()
  const [input, setInput] = useState('')
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth()

  const handleSearch = async (e) => {
    if(e.key === 'Enter'){
      try {
        setUsers([])
        setLoading(true)
        const { data } = await api.post('/api/user/discover', {input}, {
          headers: { Authorization: `Bearer ${await getToken()}` }
        })
        data.success ? setUsers(data.users) : toast.error(data.message)
        setLoading(false)
        setInput('')
      } catch (error) {
        toast.error(error.message)
      }
      setLoading(false)
    }
  }

  const fetchDiscoverPosts = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/api/post/discover', {
          headers: { Authorization: `Bearer ${await getToken()}` }
        })
        if (data.success) {
           setPosts(data.posts)
        }
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
  }

  useEffect(()=>{
    getToken().then((token)=>{
      dispatch(fetchUser(token))
      fetchDiscoverPosts()
    })
  },[getToken, dispatch])

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>

        {/* Title */}
      <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Discover People</h1>
          <p className='text-slate-600'>Connect with amazing people and grow your network</p>
      </div>

      {/* Search */}
      <div className='mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80'>
        <div className='p-6'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5' />
            <input type="text" placeholder='Search people by name, username, bio, or location...' className='pl-10 sm:pl-12 py-2 w-full border border-gray-300 rounded-md max-sm:text-sm' onChange={(e)=>setInput(e.target.value)} value={input} onKeyUp={handleSearch}/>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-6'>
        {users.length > 0 || input ? (
          <div className='flex flex-wrap gap-6'>
            {users.map((user)=>(
              <UserCard user={user} key={user._id}/>
            ))}
            {users.length === 0 && !loading && <p className='text-slate-500'>No users found.</p>}
          </div>
        ) : (
          <div className='flex flex-col items-center gap-6'>
            <h2 className='text-xl font-bold w-full text-slate-700'>Discover Posts</h2>
            <div className='w-full max-w-xl mx-auto flex flex-col gap-6'>
              {posts.map((post)=>(
                <PostCard post={post} key={post._id}/>
              ))}
            </div>
          </div>
        )}
      </div>

      {
        loading && (<Loading height='60vh'/>)
      }

      </div>
    </div>
  )
}

export default Discover
