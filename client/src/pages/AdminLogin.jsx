import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1);
    const [emailOtp, setEmailOtp] = useState('');
    const [mobileOtp, setMobileOtp] = useState('');
    const [superAdminCode, setSuperAdminCode] = useState('');
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/api/admin/login-request', { email });
            if (data.success) {
                toast.success(data.message);
                setStep(2);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            const payload = { email, emailOtp, mobileOtp };
            if (email === 'aec.it.harshraj@gmail.com') {
                payload.superAdminCode = superAdminCode;
            }

            const { data } = await api.post('/api/admin/verify-login', payload);
            if (data.success) {
                toast.success(data.message);
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminRole', data.role);
                localStorage.setItem('adminEmail', data.email);
                
                if (data.role === 'SuperAdmin') {
                    navigate('/superadmin/dashboard');
                } else {
                    navigate('/'); // Admin can just go to the main app
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
            <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Admin Portal</h2>
                
                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-600 text-white outline-none focus:border-indigo-500"
                                placeholder="admin@example.com"
                            />
                        </div>
                        <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition cursor-pointer">
                            Send OTPs
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email OTP</label>
                            <input 
                                type="text" 
                                required 
                                value={emailOtp} 
                                onChange={(e) => setEmailOtp(e.target.value)}
                                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-600 text-white outline-none focus:border-indigo-500"
                                placeholder="6-digit code"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Mobile OTP</label>
                            <input 
                                type="text" 
                                required 
                                value={mobileOtp} 
                                onChange={(e) => setMobileOtp(e.target.value)}
                                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-600 text-white outline-none focus:border-indigo-500"
                                placeholder="6-digit code (check server console)"
                            />
                        </div>

                        {email === 'aec.it.harshraj@gmail.com' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">SuperAdmin Code</label>
                                <input 
                                    type="password" 
                                    required 
                                    value={superAdminCode} 
                                    onChange={(e) => setSuperAdminCode(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-600 text-white outline-none focus:border-indigo-500"
                                    placeholder="Enter secret code"
                                />
                            </div>
                        )}

                        <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition cursor-pointer">
                            Verify & Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminLogin;
