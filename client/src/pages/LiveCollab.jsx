import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth, useUser } from '@clerk/clerk-react';
import api from '../api/axios';
import { Code2, ArrowLeft, Trash2, Save, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const LiveCollab = () => {
    const { partnerId } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { user } = useUser();
    
    const dbUser = useSelector((state) => state.user.value);
    const isTrialExpired = dbUser?.isStudent && dbUser?.trialStartedAt && 
                           new Date() - new Date(dbUser.trialStartedAt) > 7 * 24 * 60 * 60 * 1000;

    // blocks: { id: string, authorId: string, code: string }[]
    const [blocks, setBlocks] = useState([
        { id: Date.now().toString(), authorId: user?.id, code: '// Start typing...\n' }
    ]);
    const [language, setLanguage] = useState('javascript');
    const [isPartnerTyping, setIsPartnerTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        const handleSync = (e) => {
            const data = e.detail;
            if (data.from_user_id === partnerId) {
                if (data.type === "CODE_SYNC") {
                    setBlocks(data.blocks);
                    setLanguage(data.language);
                    setIsPartnerTyping(false);
                } else if (data.type === "TYPING") {
                    setIsPartnerTyping(true);
                    clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => setIsPartnerTyping(false), 2000);
                }
            }
        };
        window.addEventListener('code_sync', handleSync);
        return () => window.removeEventListener('code_sync', handleSync);
    }, [partnerId]);

    const broadcastBlocks = async (newBlocks) => {
        try {
            const token = await getToken();
            api.post('/api/message/sync-code', { 
                to_user_id: partnerId, 
                blocks: newBlocks, 
                language,
                type: "CODE_SYNC"
            }, { headers: { Authorization: `Bearer ${token}` }});
        } catch (err) {
            console.error('Failed to sync code', err);
        }
    }

    const notifyTyping = async () => {
        try {
            const token = await getToken();
            api.post('/api/message/sync-code', { 
                to_user_id: partnerId,
                type: "TYPING"
            }, { headers: { Authorization: `Bearer ${token}` }});
        } catch (err) {}
    }

    const handleCodeChange = (blockId, newCode) => {
        const newBlocks = blocks.map(b => b.id === blockId ? { ...b, code: newCode } : b);
        setBlocks(newBlocks);
        notifyTyping();
        broadcastBlocks(newBlocks);
    };

    const handleAddBlock = () => {
        const newBlocks = [...blocks, { id: Date.now().toString(), authorId: user?.id, code: '' }];
        setBlocks(newBlocks);
        broadcastBlocks(newBlocks);
    }

    const handleRemoveBlock = (blockId) => {
        const newBlocks = blocks.filter(b => b.id !== blockId);
        if(newBlocks.length === 0) {
            newBlocks.push({ id: Date.now().toString(), authorId: user?.id, code: '' });
        }
        setBlocks(newBlocks);
        broadcastBlocks(newBlocks);
    }

    const handleLanguageChange = async (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        try {
            const token = await getToken();
            api.post('/api/message/sync-code', { to_user_id: partnerId, blocks, language: newLang, type: "CODE_SYNC" }, { headers: { Authorization: `Bearer ${token}` }});
        } catch (err) {}
    }

    const handleClearCode = () => {
        const newBlocks = [{ id: Date.now().toString(), authorId: user?.id, code: '' }];
        setBlocks(newBlocks);
        broadcastBlocks(newBlocks);
    }

    const handleKeepCode = async () => {
        const title = window.prompt("Enter a title to save this snippet:");
        if (!title) return;
        
        const fullCode = blocks.map(b => b.code).join('\n\n');
        
        try {
            const token = await getToken();
            const { data } = await api.post('/api/code/add', { title, code: fullCode, language }, { headers: { Authorization: `Bearer ${token}` }});
            if (data.success) {
                toast.success("Code snippet saved successfully!");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    if (isTrialExpired) {
        return (
            <div className='flex flex-col items-center justify-center h-full bg-slate-900 rounded-xl m-4 p-10 text-center shadow-2xl border border-slate-700 min-h-[85vh]'>
                <Code2 className='text-red-400 mb-4' size={48} />
                <h1 className='text-2xl font-bold text-white mb-2'>Free Trial Expired</h1>
                <p className='text-slate-400 max-w-md'>
                    Your 7-day free trial as a student has expired. Upgrade your account to continue using Live Collab.
                </p>
                <button onClick={() => navigate(-1)} className='mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition'>
                    Go Back
                </button>
            </div>
        );
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
                        {isPartnerTyping && (
                            <span className='text-xs text-indigo-300 ml-2 italic animate-pulse'>Partner is typing...</span>
                        )}
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
            <div className='flex-1 p-4 flex flex-col gap-4 overflow-y-auto bg-slate-950'>
                {blocks.map((block) => {
                    const isMine = block.authorId === user?.id;
                    return (
                        <div key={block.id} className={`flex flex-col rounded-xl overflow-hidden border ${isMine ? 'border-indigo-500/30' : 'border-green-500/30'}`}>
                            <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider flex justify-between items-center ${isMine ? 'bg-indigo-900/50 text-indigo-300' : 'bg-green-900/50 text-green-300'}`}>
                                <span>{isMine ? 'You' : 'Partner'}'s Code</span>
                                <button onClick={() => handleRemoveBlock(block.id)} className="hover:text-red-400"><Trash2 size={12}/></button>
                            </div>
                            <textarea 
                                value={block.code} 
                                onChange={(e) => handleCodeChange(block.id, e.target.value)} 
                                spellCheck="false"
                                className={`w-full min-h-[100px] p-4 font-mono text-sm outline-none resize-y transition ${isMine ? 'bg-indigo-950/20 text-indigo-100 focus:bg-indigo-950/40' : 'bg-green-950/20 text-green-100 focus:bg-green-950/40'}`}
                            ></textarea>
                        </div>
                    )
                })}
                <button onClick={handleAddBlock} className='w-full py-3 rounded-xl border border-dashed border-slate-700 text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 flex items-center justify-center gap-2 transition cursor-pointer'>
                    <Plus size={18} /> Add Code Block
                </button>
            </div>
        </div>
    )
}

export default LiveCollab;
