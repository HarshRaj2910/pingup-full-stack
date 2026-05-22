import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Code2, Send, Trash2 } from 'lucide-react';
import moment from 'moment';
import { useSelector } from 'react-redux';

const CodeSharePage = () => {
    const { getToken } = useAuth();
    const [snippets, setSnippets] = useState([]);
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [loading, setLoading] = useState(false);
    const currentUser = useSelector((state) => state.user.value);

    useEffect(() => {
        const fetchSnippets = async () => {
            try {
                const token = await getToken();
                const { data } = await api.get('/api/code/all', { headers: { Authorization: `Bearer ${token}` }});
                if(data.success) {
                    setSnippets(data.snippets);
                }
            } catch(e) {}
        };
        fetchSnippets();
    }, [getToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!title || !code) return toast.error("Title and code are required");
        setLoading(true);
        try {
            const token = await getToken();
            const { data } = await api.post('/api/code/add', { title, code, language }, { headers: { Authorization: `Bearer ${token}` }});
            if(data.success) {
                setSnippets([data.snippet, ...snippets]);
                setTitle('');
                setCode('');
                toast.success("Snippet shared!");
            } else {
                toast.error(data.message);
            }
        } catch(e) {
            toast.error(e.message);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Are you sure you want to delete this snippet?")) return;
        try {
            const token = await getToken();
            const { data } = await api.delete(`/api/code/delete/${id}`, { headers: { Authorization: `Bearer ${token}` }});
            if(data.success) {
                setSnippets(snippets.filter(s => s._id !== id));
                toast.success("Snippet deleted!");
            } else {
                toast.error(data.message);
            }
        } catch(e) {
            toast.error(e.message);
        }
    };

    return (
        <div className='h-screen overflow-y-auto bg-slate-50 p-6 w-full max-w-4xl mx-auto'>
            <div className='flex items-center gap-3 mb-8'>
                <Code2 className='w-8 h-8 text-indigo-600'/>
                <h1 className='text-3xl font-bold text-slate-900'>Student Code Share</h1>
            </div>

            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8'>
                <h2 className='font-semibold text-slate-800 mb-4'>Share a Snippet</h2>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div className='flex gap-4'>
                        <input type="text" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Snippet Title" className='flex-1 p-3 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200'/>
                        <select value={language} onChange={(e)=>setLanguage(e.target.value)} className='p-3 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200'>
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                            <option value="html">HTML/CSS</option>
                        </select>
                    </div>
                    <textarea value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Paste your code here..." className='w-full h-40 p-4 bg-slate-900 text-green-400 font-mono text-sm rounded-xl outline-none focus:ring-2 focus:ring-indigo-500'></textarea>
                    <button disabled={loading} type="submit" className='bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2 cursor-pointer'>
                        <Send className='w-4 h-4'/> Share Code
                    </button>
                </form>
            </div>

            <div className='space-y-6'>
                {snippets.map((snippet) => (
                    <div key={snippet._id} className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
                        <div className='p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50'>
                            <div className='flex items-center gap-3'>
                                <img src={snippet.user?.profile_picture} className='w-8 h-8 rounded-full' alt=""/>
                                <div>
                                    <p className='font-medium text-slate-900 text-sm'>{snippet.title}</p>
                                    <p className='text-xs text-slate-500'>{snippet.user?.full_name} • {moment(snippet.createdAt).fromNow()}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-3'>
                                <span className='px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full'>{snippet.language}</span>
                                <button onClick={() => {
                                    setTitle(`Fork of ${snippet.title}`);
                                    setCode(snippet.code);
                                    setLanguage(snippet.language);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }} className='text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition cursor-pointer'>
                                    Copy to Editor
                                </button>
                                {currentUser && (
                                    <button onClick={() => handleDelete(snippet._id)} className='text-red-500 hover:text-red-700 transition p-1 cursor-pointer' title="Delete Snippet">
                                        <Trash2 className='w-4 h-4'/>
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className='p-4 bg-slate-900 overflow-x-auto'>
                            <pre className='text-green-400 font-mono text-sm whitespace-pre-wrap'>{snippet.code}</pre>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CodeSharePage;
