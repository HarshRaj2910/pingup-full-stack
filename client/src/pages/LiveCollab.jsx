import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios';
import { Code2, ArrowLeft, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const LiveCollab = () => {
    const { partnerId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [code, setCode] = useState('// Start typing...\n');
    const [language, setLanguage] = useState('javascript');

    useEffect(() => {
        const handleSync = (e) => {
            const data = e.detail;
            if (data.from_user_id === partnerId) {
                setCode(data.code);
                setLanguage(data.language);
            }
        };
        window.addEventListener('code_sync', handleSync);
        return () => window.removeEventListener('code_sync', handleSync);
    }, [partnerId]);

    const handleCodeChange = async (e) => {
        const newCode = e.target.value;
        setCode(newCode);
        try {
            const token = await getToken();
            api.post('/api/message/sync-code', { to_user_id: partnerId, code: newCode, language }, { headers: { Authorization: `Bearer ${token}` }});
        } catch (err) {
            console.error('Failed to sync code', err);
        }
    };

    const handleLanguageChange = async (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        try {
            const token = await getToken();
            api.post('/api/message/sync-code', { to_user_id: partnerId, code, language: newLang }, { headers: { Authorization: `Bearer ${token}` }});
        } catch (err) {
            console.error('Failed to sync language', err);
        }
    }

    const handleClearCode = async () => {
        const newCode = '';
        setCode(newCode);
        try {
            const token = await getToken();
            api.post('/api/message/sync-code', { to_user_id: partnerId, code: newCode, language }, { headers: { Authorization: `Bearer ${token}` }});
        } catch (err) {
            console.error('Failed to sync code', err);
        }
    }

    const handleKeepCode = async () => {
        const title = window.prompt("Enter a title to save this snippet:");
        if (!title) return;
        
        try {
            const token = await getToken();
            const { data } = await api.post('/api/code/add', { title, code, language }, { headers: { Authorization: `Bearer ${token}` }});
            if (data.success) {
                toast.success("Code snippet saved successfully!");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className='flex flex-col h-full bg-slate-900 rounded-xl m-4 overflow-hidden shadow-2xl border border-slate-700 min-h-[85vh]'>
            {/* Header */}
            <div className='flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700'>
                <div className='flex items-center gap-4 text-white'>
                    <button onClick={() => navigate(-1)} className='p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition cursor-pointer'>
                        <ArrowLeft size={18} />
                    </button>
                    <div className='flex items-center gap-2'>
                        <Code2 className='text-indigo-400' size={24} />
                        <h1 className='text-lg font-bold'>Live Collab</h1>
                        <span className='px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded flex items-center gap-2'>
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Syncing Live
                        </span>
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    <select value={language} onChange={handleLanguageChange} className='bg-slate-700 text-white outline-none p-2 rounded-lg text-sm border border-slate-600 focus:border-indigo-500'>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="html">HTML/CSS</option>
                    </select>
                    <button onClick={handleKeepCode} className='p-2 bg-slate-700 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-400 rounded-lg transition cursor-pointer flex items-center gap-2' title="Keep Snippet">
                        <Save size={18} />
                        <span className='hidden sm:block text-sm font-medium'>Keep Code</span>
                    </button>
                    <button onClick={handleClearCode} className='p-2 bg-slate-700 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-lg transition cursor-pointer' title="Clear Code">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            
            {/* Editor Area */}
            <div className='flex-1 p-4 flex flex-col'>
                <textarea 
                    value={code} 
                    onChange={handleCodeChange} 
                    spellCheck="false"
                    className='flex-1 w-full h-full p-4 bg-slate-950/50 rounded-xl text-green-400 font-mono text-sm outline-none resize-none border border-slate-800 focus:border-indigo-500/50 transition'
                ></textarea>
            </div>
        </div>
    )
}

export default LiveCollab;
