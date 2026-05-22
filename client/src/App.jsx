import React, { useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import CodeSharePage from './pages/CodeSharePage'
import LiveCollab from './pages/LiveCollab'
import AdminLogin from './pages/AdminLogin'
import SuperadminDashboard from './pages/SuperadminDashboard'
import {useUser, useAuth} from '@clerk/clerk-react'
import Layout from './pages/Layout'
import toast, {Toaster} from 'react-hot-toast'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUser } from './features/user/userSlice'
import { fetchConnections } from './features/connections/connectionsSlice'
import { addMessage } from './features/messages/messagesSlice'
import Notification from './components/Notification'

const App = () => {
  const {user} = useUser()
  const {getToken } = useAuth()
  const {pathname} = useLocation()
  const pathnameRef = useRef(pathname)

  const dispatch = useDispatch()

  useEffect(()=>{
    const fetchData = async () => {
      if(user){
      const token = await getToken()
      dispatch(fetchUser(token))
      dispatch(fetchConnections(token))
      }
    }
    fetchData()
    
  },[user, getToken, dispatch])

  useEffect(()=>{
    pathnameRef.current = pathname
  },[pathname])

  useEffect(()=>{
    if(user){
      const eventSource = new EventSource(import.meta.env.VITE_BASEURL + '/api/message/' + user.id);

      eventSource.onmessage = (event)=>{
        try {
          const message = JSON.parse(event.data)

          if (message.type === "CODE_SYNC") {
             const customEvent = new CustomEvent('code_sync', { detail: message });
             window.dispatchEvent(customEvent);
             return;
          }

          // Play sound
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');
          audio.play().catch((err) => console.log('Audio error:', err));

          if(pathnameRef.current === ('/messages/' + (message.from_user_id?._id || message.from_user_id))){
            dispatch(addMessage(message))
          }else{
            toast.custom((t)=>(
              <Notification t={t} message={message}/>
            ), {position: "bottom-right", duration: 5000})
          }
        } catch (error) {
          console.error("Error parsing SSE data", error)
        }
      }
      return ()=>{
        eventSource.close()
      }
    }
  },[user, dispatch])
  
  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/admin' element={<AdminLogin/>}/>
        <Route path='/superadmin/dashboard' element={<SuperadminDashboard/>}/>
        <Route path='/' element={ !user ? <Login /> : <Layout/>}>
          <Route index element={<Feed/>}/>
          <Route path='messages' element={<Messages/>}/>
          <Route path='messages/:userId' element={<ChatBox/>}/>
          <Route path='connections' element={<Connections/>}/>
          <Route path='discover' element={<Discover/>}/>
          <Route path='profile' element={<Profile/>}/>
          <Route path='profile/:profileId' element={<Profile/>}/>
          <Route path='create-post' element={<CreatePost/>}/>
          <Route path='code-share' element={<CodeSharePage/>}/>
          <Route path='live-collab/:partnerId' element={<LiveCollab/>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App
