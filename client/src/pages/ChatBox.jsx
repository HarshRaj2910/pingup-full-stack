import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'

import { ImageIcon, FileIcon, SendHorizonal, Sun, Moon, Code2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import api from '../api/axios'
import { addMessage, fetchMessages, resetMessages } from '../features/messages/messagesSlice'
import toast from 'react-hot-toast'

const ChatBox = () => {

  const {messages} = useSelector((state)=>state.messages)
  const { userId } = useParams()
  const { getToken } = useAuth()
  const dispatch = useDispatch()

  const [text, setText] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [user, setUser] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const messagesEndRef = useRef(null)

  const connections = useSelector((state) => state.connections?.connections || [])

  const sendMessage = async () => {
    try {
      if(!text && !image) return

      const token = await getToken()
      const formData = new FormData();
      formData.append('to_user_id', userId)
      formData.append('text', text);
      attachment && formData.append('attachment', attachment);

      const { data } = await api.post('/api/message/send', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setText('')
        setAttachment(null)
        dispatch(addMessage(data.message))
      }else{
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const sendCollabInvite = async () => {
    try {
      const token = await getToken()
      const formData = new FormData();
      formData.append('to_user_id', userId)
      formData.append('text', `Let's code together! [Join Live Collab]`);

      const { data } = await api.post('/api/message/send', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        dispatch(addMessage(data.message))
      }else{
        throw new Error(data.message)
      }
    } catch (error) {
       toast.error(error.message)
    }
  }

  useEffect(()=>{
    const fetchUserMessages = async () => {
      try {
        const token = await getToken()
        dispatch(fetchMessages({token, userId}))
      } catch (error) {
        toast.error(error.message)
      }
    }
    fetchUserMessages()

    return ()=>{
      dispatch(resetMessages())
    }
  },[userId, getToken, dispatch])

  useEffect(()=>{
    if(connections && connections.length > 0){
      const user = connections.find(connection => connection._id === userId)
      setUser(user)
    } else {
      setUser(null)
    }
  },[connections, userId])

  useEffect(()=>{
    messagesEndRef.current?.scrollIntoView({behavior: "smooth" })
  },[messages])

  return user && (
    <div className={`flex flex-col h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className={`flex items-center justify-between p-2 md:px-10 xl:pl-42 border-b transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-gray-300'}`}>
        <div className='flex items-center gap-2'>
            <Link to={`/profile/${user._id}`}>
              <img src={user.profile_picture} alt="" className="size-8 rounded-full hover:opacity-80 transition-opacity"/>
            </Link>
            <div>
            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.full_name}</p>
            <p className="text-sm text-gray-500 -mt-1.5">@{user.username}</p>
            </div>
        </div>
        <div className='flex items-center gap-3'>
            <button onClick={sendCollabInvite} className={`flex items-center gap-2 p-1.5 px-3 rounded-full text-xs font-semibold shadow-sm transition ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}>
              <Code2 size={14}/> Collab
            </button>
            <button onClick={()=>setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full cursor-pointer transition ${isDarkMode ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-white text-slate-800 shadow-sm hover:bg-gray-50'}`}>
                {isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
        </div>
      </div>
      <div className='p-5 md:px-10 h-full overflow-y-scroll'>
        <div className='space-y-4 max-w-4xl mx-auto'>
          {
            messages.toSorted((a,b)=> new Date(a.createdAt) - new Date(b.createdAt)).map((message, index)=>(
              <div key={index} className={`flex flex-col mb-3 ${message.to_user_id === user._id ? 'items-end' : 'items-start'}`}>
                <div className={`text-sm max-w-sm ${message.message_type === 'image' && !message.text ? 'bg-transparent shadow-none' : `p-3 rounded-2xl shadow-sm ${message.to_user_id === user._id ? 'bg-indigo-600 text-white rounded-br-sm' : (isDarkMode ? 'bg-slate-800 text-white rounded-bl-sm border border-slate-700' : 'bg-white text-slate-800 rounded-bl-sm border border-slate-100')}`}`}>
                  {
                  message.message_type === 'image' && <img src={message.media_url} className={`w-full max-w-sm mb-1 object-cover ${message.text ? 'rounded-lg' : 'rounded-2xl'}`} alt="" />
                  }
                  {
                  message.message_type === 'pdf' && <a href={message.media_url} target="_blank" rel="noreferrer" className={`flex items-center gap-2 underline mb-1 font-bold ${message.to_user_id === user._id ? 'text-white' : 'text-indigo-600'}`}><FileIcon size={16}/> View PDF</a>
                  }
                  {
                  message.message_type === 'file' && <a href={message.media_url} target="_blank" rel="noreferrer" className={`flex items-center gap-2 underline mb-1 font-bold ${message.to_user_id === user._id ? 'text-white' : 'text-indigo-600'}`}><FileIcon size={16}/> View File</a>
                  }
                  {message.text && (
                      message.text.includes('[Join Live Collab]') ? 
                      <div className='leading-relaxed'>
                          Let's code together! 🚀 
                          <Link to={`/live-collab/${user._id}`} className={`block mt-2 text-center p-2 rounded-lg font-semibold border ${message.to_user_id === user._id ? 'bg-white text-indigo-600 border-white hover:bg-indigo-50' : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'}`}>
                             Open Collab Space
                          </Link>
                      </div>
                      : <p className='leading-relaxed'>{message.text}</p>
                  )}
                  <span className={`text-[10px] block text-right mt-1.5 ${message.message_type === 'image' && !message.text ? 'text-slate-500 drop-shadow-sm font-medium' : (message.to_user_id === user._id ? 'text-indigo-200' : (isDarkMode ? 'text-slate-400' : 'text-slate-400'))}`}>{moment(message.createdAt).format('LT')}</span>
                </div>

              </div>
            ))
          }
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className='px-4 pb-4'>
          <div className={`flex items-center gap-3 pl-6 pr-2 py-2 w-full max-w-xl mx-auto shadow-md rounded-full mb-5 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'}`}>
            <input type="text" className={`flex-1 outline-none bg-transparent ${isDarkMode ? 'text-white placeholder-slate-400' : 'text-slate-700'}`} placeholder='Type a message...'
            onKeyDown={e=>e.key === 'Enter' && sendMessage()} onChange={(e)=>setText(e.target.value)} value={text} />

            <label htmlFor="attachment">
              {
                attachment 
                ? (attachment.type.startsWith('image/') ? <img src={URL.createObjectURL(attachment)} alt="" className='h-8 rounded'/> : <FileIcon className='size-7 text-indigo-500'/>)
                : <ImageIcon className='size-7 text-gray-400 cursor-pointer'/>
              }
              <input type="file" id='attachment' accept="image/*,application/pdf" hidden onChange={(e)=>setAttachment(e.target.files[0])}/>
            </label>

            <button onClick={sendMessage} className='bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white p-2 rounded-full'>
              <SendHorizonal size={18}/>
            </button>
          </div>
      </div>
    </div>
  )
}

export default ChatBox
