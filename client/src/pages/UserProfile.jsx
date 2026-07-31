import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const UserProfile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('profile');

    // Password change state
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pwMsg, setPwMsg] = useState('');
    const [pwError, setPwError] = useState('');
    const [pwLoading, setPwLoading] = useState(false);

    // Saved Temples
    const [savedTemples, setSavedTemples] = useState([]);
    const [savedLoading, setSavedLoading] = useState(false);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        if (activeTab === 'saved') fetchSavedTemples();
    }, [activeTab, user]);

    const fetchSavedTemples = async () => {
        setSavedLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/saved-temples`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSavedTemples(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch saved temples');
        } finally {
            setSavedLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            setPwError('New passwords do not match!'); return;
        }
        setPwLoading(true); setPwMsg(''); setPwError('');
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/update-password`,
                { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPwMsg('Password changed successfully! ✅');
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPwError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setPwLoading(false);
        }
    };

    if (!user) return null;

    const tabs = [
        { key: 'profile', label: '👤 Profile' },
        { key: 'saved', label: '🔖 Saved Temples' },
        { key: 'security', label: '🔐 Security' },
    ];

    return (
        <div className="min-h-screen bg-slate-900 pt-28 pb-20 px-4 font-sans">
            <div className="max-w-3xl mx-auto">

                {/* Profile Header Card */}
                <div className="bg-gradient-to-br from-orange-600/10 to-amber-600/5 border border-orange-500/20 rounded-3xl p-8 mb-6 flex flex-col md:flex-row items-center gap-6 shadow-[0_0_40px_rgba(249,115,22,0.1)]">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-4xl font-extrabold text-white shadow-[0_0_20px_rgba(249,115,22,0.5)] flex-shrink-0">
                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-extrabold text-white tracking-wide capitalize">{user.name || 'User'}</h1>
                        <span className={`inline-block mt-2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${user.role === 'admin' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-white/5 text-slate-300 border-white/10'}`}>
                            {user.role === 'admin' ? '👑 Admin' : '🙏 Devotee'}
                        </span>
                    </div>
                    <div className="md:ml-auto flex gap-3">
                        {user.role === 'admin' && (
                            <button onClick={() => navigate('/admin-dashboard')}
                                className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 font-bold rounded-xl text-xs uppercase tracking-wider transition-all">
                                Admin Portal
                            </button>
                        )}
                        <button onClick={() => { logout(); navigate('/'); }}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-xl text-xs uppercase tracking-wider transition-all">
                            Logout
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)]">
                    <div className="flex border-b border-white/10">
                        {tabs.map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                className={`flex-1 py-4 text-sm font-bold tracking-widest uppercase transition-all ${activeTab === tab.key ? 'bg-orange-500/20 text-orange-400 border-b-2 border-orange-500' : 'text-slate-400 hover:bg-white/5'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">

                        {/* ── TAB 1: PROFILE ── */}
                        {activeTab === 'profile' && (
                            <div className="space-y-5">
                                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Account Information</h3>
                                {[
                                    { label: 'Full Name', value: user.name || 'Not set', icon: '👤' },
                                    { label: 'Role', value: user.role === 'admin' ? 'Administrator' : 'Normal User', icon: '🛡️' },
                                    { label: 'Status', value: 'Active', icon: '✅' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-slate-900/50 p-5 rounded-2xl border border-white/5">
                                        <span className="text-2xl">{item.icon}</span>
                                        <div>
                                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">{item.label}</p>
                                            <p className="text-white font-semibold capitalize mt-0.5">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-6 p-5 bg-orange-900/10 border border-orange-500/20 rounded-2xl text-center">
                                    <p className="text-slate-400 text-sm">Want to explore temples?</p>
                                    <button onClick={() => navigate('/temples')} className="mt-3 px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold rounded-xl text-sm shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:scale-105 transition-all">
                                        Browse Temples 🛕
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── TAB 2: SAVED TEMPLES ── */}
                        {activeTab === 'saved' && (
                            <div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Saved Temples</h3>
                                {savedLoading ? (
                                    <div className="flex justify-center py-10">
                                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                                    </div>
                                ) : savedTemples.length > 0 ? (
                                    <div className="space-y-4">
                                        {savedTemples.map((temple, i) => (
                                            <div key={i} className="bg-slate-900/50 p-5 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <img 
                                                        src={temple.imageUrl ? (temple.imageUrl.startsWith('http') ? temple.imageUrl : `${import.meta.env.VITE_API_URL}${temple.imageUrl}`) : 'https://images.unsplash.com/photo-1623910271032-15f10b7f078e?w=100'} 
                                                        className="w-16 h-16 rounded-xl object-cover" alt="" 
                                                    />
                                                    <div>
                                                        <h4 className="font-bold text-white text-lg">{temple.templeName}</h4>
                                                        <p className="text-slate-400 text-xs uppercase tracking-widest">{temple.city}, {temple.state}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => navigate(`/temples/${temple._id}`)} className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30 rounded-xl text-sm transition-all">
                                                    View →
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <span className="text-5xl block mb-4 opacity-40">🔖</span>
                                        <p className="text-slate-400 mb-4">You haven't saved any temples yet.</p>
                                        <button onClick={() => navigate('/temples')} className="px-6 py-2.5 bg-white/5 border border-white/10 hover:border-orange-500/30 text-white font-bold rounded-xl text-sm transition-all">
                                            Explore Temples
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── TAB 3: SECURITY / CHANGE PASSWORD ── */}
                        {activeTab === 'security' && (
                            <div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6">Change Password</h3>
                                <form onSubmit={handlePasswordChange} className="space-y-5">
                                    {pwMsg && <div className="p-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl text-sm font-bold">{pwMsg}</div>}
                                    {pwError && <div className="p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-sm font-bold">{pwError}</div>}
                                    {[
                                        { label: 'Current Password', key: 'currentPassword' },
                                        { label: 'New Password', key: 'newPassword' },
                                        { label: 'Confirm New Password', key: 'confirmPassword' },
                                    ].map(field => (
                                        <div key={field.key}>
                                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">{field.label}</label>
                                            <input
                                                type="password"
                                                value={pwForm[field.key]}
                                                onChange={(e) => setPwForm({ ...pwForm, [field.key]: e.target.value })}
                                                required
                                                placeholder="••••••••"
                                                className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30"
                                            />
                                        </div>
                                    ))}
                                    <button type="submit" disabled={pwLoading}
                                        className="w-full py-3.5 mt-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all disabled:opacity-50 tracking-wider">
                                        {pwLoading ? 'Updating...' : '🔐 Update Password'}
                                    </button>
                                </form>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
