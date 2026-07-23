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

    // My reviews — fetched from temples
    const [myReviews, setMyReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        if (activeTab === 'reviews') fetchMyReviews();
    }, [activeTab, user]);

    const fetchMyReviews = async () => {
        setReviewsLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/temple-data/all');
            const allTemples = res.data.data || [];
            // Filter reviews made by current user (match by name since we store name)
            const reviews = [];
            allTemples.forEach(temple => {
                (temple.reviews || []).forEach(review => {
                    if (review.name?.toLowerCase() === user.name?.toLowerCase()) {
                        reviews.push({ ...review, templeName: temple.templeName, templeId: temple._id });
                    }
                });
            });
            setMyReviews(reviews.reverse());
        } catch (err) {
            console.error('Failed to fetch reviews');
        } finally {
            setReviewsLoading(false);
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
            await axios.put('http://localhost:5000/api/auth/update-password',
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
        { key: 'reviews', label: '⭐ My Reviews' },
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

                        {/* ── TAB 2: MY REVIEWS ── */}
                        {activeTab === 'reviews' && (
                            <div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-6">My Reviews</h3>
                                {reviewsLoading ? (
                                    <div className="flex justify-center py-10">
                                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
                                    </div>
                                ) : myReviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {myReviews.map((review, i) => (
                                            <div key={i} className="bg-slate-900/50 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                                                <div className="flex justify-between items-start mb-2">
                                                    <button onClick={() => navigate(`/temples/${review.templeId}`)}
                                                        className="font-bold text-orange-400 hover:text-orange-300 transition-colors text-left">
                                                        🛕 {review.templeName}
                                                    </button>
                                                    <span className="text-amber-400 font-bold">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                                </div>
                                                <p className="text-slate-300 italic text-sm">"{review.comment}"</p>
                                                <p className="text-slate-500 text-xs mt-2">
                                                    {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <span className="text-5xl block mb-4 opacity-40">✍️</span>
                                        <p className="text-slate-400 mb-4">You haven't reviewed any temples yet.</p>
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
