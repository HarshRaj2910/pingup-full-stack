import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Play, Code2, Trophy } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../features/user/userSlice';

const Challenges = () => {
    const { getToken } = useAuth();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [code, setCode] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const token = await getToken();
                dispatch(fetchUser(token));
                const { data } = await api.get('/api/challenge/daily', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.success) {
                    setChallenges(data.challenges);
                } else {
                    toast.error(data.message);
                }
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [getToken, dispatch]);

    const handleSelect = (challenge) => {
        setSelected(challenge);
        setCode(challenge.functionSignature);
    };

    const handleSubmit = async () => {
        if (!code.trim()) return toast.error("Code cannot be empty");
        setSubmitting(true);
        const toastId = toast.loading("Running test cases...");
        try {
            const token = await getToken();
            const { data } = await api.post('/api/challenge/submit', {
                challengeId: selected._id,
                code: code,
                language: selected.language
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success(data.message, { id: toastId });
                dispatch(fetchUser(token)); // Refresh user points
                
                // Optimistically update completed_challenges locally so UI updates
                setSelected(null); // Return to list
            } else {
                toast.error(data.message, { id: toastId, duration: 6000 });
            }
        } catch (error) {
            toast.error(error.message, { id: toastId });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="h-[calc(100vh)] flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center shadow-sm z-10">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Code2 className="text-indigo-600" /> Daily Challenges
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Solve DSA questions and earn points!</p>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span className="font-bold text-amber-700">{user?.points || 0} pts</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {!selected ? (
                    <div className="p-6 max-w-5xl mx-auto overflow-y-auto h-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
                            {challenges.map((c) => {
                                const isCompleted = user?.completed_challenges?.includes(c._id);
                                return (
                                    <div key={c._id} onClick={() => handleSelect(c)} className={`p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-lg bg-white relative overflow-hidden ${isCompleted ? 'border-green-300' : 'border-gray-200 hover:border-indigo-300'}`}>
                                        {isCompleted && <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-lg font-bold">COMPLETED</div>}
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold text-slate-800 pr-20">{c.title}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-md font-bold ${c.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : c.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{c.difficulty}</span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-4 text-sm text-slate-500 font-medium">
                                            <span className="bg-slate-100 px-2 py-1 rounded uppercase">{c.language}</span>
                                            <span className='text-indigo-600'>+{c.points} pts</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full flex-col md:flex-row pb-10">
                        {/* Left Side: Description */}
                        <div className="w-full md:w-1/3 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden shadow-xl z-10 relative">
                            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                                <button onClick={() => setSelected(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <h2 className="font-bold text-lg truncate">{selected.title}</h2>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                                {selected.description}
                            </div>
                        </div>

                        {/* Right Side: Editor */}
                        <div className="w-full md:w-2/3 flex flex-col h-full relative">
                            <div className="bg-slate-900 text-slate-300 p-2 px-4 flex justify-between items-center text-xs font-mono border-b border-slate-700">
                                <span>main.{selected.language === 'python' ? 'py' : selected.language === 'java' ? 'java' : selected.language === 'cpp' ? 'cpp' : 'c'}</span>
                                <button disabled={submitting} onClick={handleSubmit} className="flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-md font-bold transition disabled:opacity-50 disabled:cursor-not-allowed">
                                    {submitting ? '...' : <Play className="w-4 h-4" fill="currentColor"/>}
                                    Submit Code
                                </button>
                            </div>
                            <div className="flex-1 pb-16 md:pb-0">
                                <Editor
                                    height="100%"
                                    theme="vs-dark"
                                    language={selected.language === 'c' || selected.language === 'cpp' ? 'cpp' : selected.language}
                                    value={code}
                                    onChange={(val) => setCode(val)}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        padding: { top: 16 }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Challenges;
