import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Trash2, UserPlus, LogOut } from 'lucide-react';

const SuperadminDashboard = () => {
    const [admins, setAdmins] = useState([]);
    const [newEmail, setNewEmail] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('adminToken');
    const role = localStorage.getItem('adminRole');

    useEffect(() => {
        if (!token || role !== 'SuperAdmin') {
            navigate('/admin');
            return;
        }
        fetchAdmins();
    }, [navigate, token, role]);

    const fetchAdmins = async () => {
        try {
            const { data } = await api.get('/api/admin/emails', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setAdmins(data.admins);
            }
        } catch (error) {
            toast.error('Failed to fetch admins');
        }
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/api/admin/add-email', { email: newEmail }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                toast.success(data.message);
                setNewEmail('');
                fetchAdmins();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to add admin');
        }
    };

    const handleRemoveAdmin = async (id) => {
        try {
            const { data } = await api.delete(`/api/admin/remove-email/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                toast.success(data.message);
                fetchAdmins();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to remove admin');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRole');
        localStorage.removeItem('adminEmail');
        navigate('/admin');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Superadmin Dashboard</h1>
                        <p className="text-slate-500 mt-1">Manage admin access for PingUp</p>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition cursor-pointer">
                        <LogOut size={18} /> Logout
                    </button>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-slate-800">Whitelist New Admin</h2>
                    <form onSubmit={handleAddAdmin} className="flex gap-4">
                        <input 
                            type="email" 
                            required 
                            value={newEmail} 
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Enter admin email address"
                            className="flex-1 p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500"
                        />
                        <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition cursor-pointer flex items-center gap-2">
                            <UserPlus size={18} /> Add Admin
                        </button>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-semibold mb-4 text-slate-800">Whitelisted Admins</h2>
                    {admins.length === 0 ? (
                        <p className="text-slate-500">No admins whitelisted yet.</p>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {admins.map((admin) => (
                                <div key={admin._id} className="flex justify-between items-center py-4">
                                    <div>
                                        <p className="font-medium text-slate-800">{admin.email}</p>
                                        <p className="text-xs text-slate-400">Added on: {new Date(admin.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleRemoveAdmin(admin._id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                        title="Remove Admin"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuperadminDashboard;
