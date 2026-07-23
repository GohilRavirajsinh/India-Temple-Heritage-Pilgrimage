import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        templeName: '', state: '', city: '', deity: '', history: '',
        darshanTiming: '', imageUrl: null, rituals: '', dressCode: '',
        nearbyFacilities: '', festivals: '', isFeatured: false
    });

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [temples, setTemples] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('add');

    // Edit mode state
    const [editingTemple, setEditingTemple] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [editLoading, setEditLoading] = useState(false);

    const fetchTemples = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/temple-data/all');
            setTemples(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch temples");
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/auth/all-users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch users");
        }
    };

    useEffect(() => {
        if (activeTab === 'manage') fetchTemples();
        if (activeTab === 'users') fetchUsers();
    }, [activeTab]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this temple? This cannot be undone.")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/temple-data/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTemples(temples.filter(temple => temple._id !== id));
            setMessage("Temple deleted successfully!");
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete temple');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Delete this user? This cannot be undone.")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/auth/delete-users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u._id !== id));
            setMessage("User deleted!");
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleChange = (e) => {
        if (e.target.name === 'imageUrl') {
            setFormData({ ...formData, imageUrl: e.target.files[0] });
        } else if (e.target.type === 'checkbox') {
            setFormData({ ...formData, [e.target.name]: e.target.checked });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setMessage(''); setError('');
        const token = localStorage.getItem('token');
        try {
            const dataToSubmit = new FormData();
            dataToSubmit.append('templeName', formData.templeName);
            dataToSubmit.append('state', formData.state);
            dataToSubmit.append('city', formData.city);
            dataToSubmit.append('deity', formData.deity);
            dataToSubmit.append('history', formData.history);
            dataToSubmit.append('darshanTiming', formData.darshanTiming);
            dataToSubmit.append('rituals', formData.rituals);
            dataToSubmit.append('dressCode', formData.dressCode);
            const facilitiesArray = formData.nearbyFacilities.split(',').map(f => f.trim()).filter(f => f);
            facilitiesArray.forEach(f => dataToSubmit.append('nearbyFacilities[]', f));
            const festivalsArray = formData.festivals.split(',').map(f => f.trim()).filter(f => f);
            festivalsArray.forEach(f => dataToSubmit.append('festivals[]', f));
            dataToSubmit.append('isFeatured', formData.isFeatured);
            if (formData.imageUrl) dataToSubmit.append('imageUrl', formData.imageUrl);

            await axios.post('http://localhost:5000/api/temple-data/add', dataToSubmit, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });

            setMessage('Temple added successfully to the database!');
            setFormData({ templeName: '', state: '', city: '', deity: '', history: '', darshanTiming: '', imageUrl: null, rituals: '', dressCode: '', nearbyFacilities: '', festivals: '', isFeatured: false });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add temple data.');
        } finally {
            setLoading(false);
        }
    };

    // Edit temple functions
    const startEdit = (temple) => {
        setEditingTemple(temple._id);
        setEditForm({
            templeName: temple.templeName || '',
            state: temple.state || '',
            city: temple.city || '',
            deity: temple.deity || '',
            darshanTiming: temple.darshanTiming || '',
            history: temple.history || '',
            rituals: temple.rituals || '',
            dressCode: temple.dressCode || '',
            nearbyFacilities: (temple.nearbyFacilities || []).join(', '),
            festivals: (temple.festivals || []).join(', '),
            isFeatured: temple.isFeatured || false,
        });
    };

    const cancelEdit = () => { setEditingTemple(null); setEditForm({}); };

    const handleEditChange = (e) => {
        if (e.target.type === 'checkbox') {
            setEditForm({ ...editForm, [e.target.name]: e.target.checked });
        } else {
            setEditForm({ ...editForm, [e.target.name]: e.target.value });
        }
    };

    const submitEdit = async (id) => {
        setEditLoading(true); setMessage(''); setError('');
        try {
            const token = localStorage.getItem('token');
            const dataToSubmit = new FormData();
            Object.keys(editForm).forEach(key => {
                if (key === 'nearbyFacilities') {
                    editForm[key].split(',').map(f => f.trim()).filter(f => f).forEach(f => dataToSubmit.append('nearbyFacilities[]', f));
                } else if (key === 'festivals') {
                    editForm[key].split(',').map(f => f.trim()).filter(f => f).forEach(f => dataToSubmit.append('festivals[]', f));
                } else {
                    dataToSubmit.append(key, editForm[key]);
                }
            });
            await axios.put(`http://localhost:5000/api/temple-data/${id}`, dataToSubmit, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            setMessage('Temple updated successfully!');
            setEditingTemple(null);
            fetchTemples();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        } finally {
            setEditLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50";
    const labelClass = "block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2";

    const tabs = [
        { key: 'add', label: '➕ Add Temple' },
        { key: 'manage', label: '⚙️ Manage Temples' },
        { key: 'users', label: '👥 Users' },
    ];

    return (
        <div className="min-h-screen bg-slate-900 pt-28 pb-20 px-4 font-sans">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-8 text-center">
                    <span className="text-orange-400 text-xs font-bold uppercase tracking-widest block mb-2">Admin Control Center</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                        Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Dashboard</span>
                    </h1>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden">

                    {/* Tabs */}
                    <div className="flex border-b border-white/10">
                        {tabs.map(tab => (
                            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setMessage(''); setError(''); }}
                                className={`flex-1 py-5 font-bold tracking-widest uppercase text-sm transition-all ${activeTab === tab.key ? 'bg-orange-500/20 text-orange-400 border-b-2 border-orange-500' : 'text-slate-400 hover:bg-white/5'}`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-8 md:p-10">
                        {message && <div className="p-4 mb-8 bg-green-500/20 text-green-400 font-bold rounded-xl border border-green-500/30 text-center">{message}</div>}
                        {error && <div className="p-4 mb-8 bg-red-500/20 text-red-400 font-bold rounded-xl border border-red-500/30 text-center">{error}</div>}

                        {/* ══════════════ TAB 1: ADD TEMPLE ══════════════ */}
                        {activeTab === 'add' && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className={labelClass}>Temple Name *</label><input type="text" name="templeName" value={formData.templeName} onChange={handleChange} required className={inputClass} placeholder="e.g., Somnath Temple" /></div>
                                    <div><label className={labelClass}>State *</label><input type="text" name="state" value={formData.state} onChange={handleChange} required className={inputClass} placeholder="e.g., Gujarat" /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className={labelClass}>City *</label><input type="text" name="city" value={formData.city} onChange={handleChange} required className={inputClass} placeholder="e.g., Veraval" /></div>
                                    <div><label className={labelClass}>Deity *</label><input type="text" name="deity" value={formData.deity} onChange={handleChange} required className={inputClass} placeholder="e.g., Shiva" /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className={labelClass}>Darshan Timings *</label><input type="text" name="darshanTiming" value={formData.darshanTiming} onChange={handleChange} required className={inputClass} placeholder="e.g., 6:00 AM - 9:00 PM" /></div>
                                    <div><label className={labelClass}>Rituals & Pooja</label><input type="text" name="rituals" value={formData.rituals} onChange={handleChange} className={inputClass} placeholder="e.g., Abhishek, Aarti" /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div><label className={labelClass}>Dress Code</label><input type="text" name="dressCode" value={formData.dressCode} onChange={handleChange} className={inputClass} placeholder="e.g., Traditional" /></div>
                                    <div><label className={labelClass}>Facilities (comma separated)</label><input type="text" name="nearbyFacilities" value={formData.nearbyFacilities} onChange={handleChange} className={inputClass} placeholder="Hotel, Parking, ATM" /></div>
                                    <div><label className={labelClass}>Festivals (comma separated)</label><input type="text" name="festivals" value={formData.festivals} onChange={handleChange} className={inputClass} placeholder="Mahashivratri, Diwali" /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                    <div><label className={labelClass}>Upload Image</label><input type="file" name="imageUrl" accept="image/*" onChange={handleChange} className="w-full px-4 py-2 border border-white/10 bg-slate-900/50 rounded-xl text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-orange-500/20 file:text-orange-400 hover:file:bg-orange-500/30 transition-all" /></div>
                                    <div className="flex items-center bg-slate-900/50 px-4 py-3 rounded-xl border border-white/10">
                                        <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 text-orange-500 bg-slate-800 border-white/20 rounded" />
                                        <label htmlFor="isFeatured" className="ml-3 text-sm font-bold text-slate-300 uppercase tracking-wide cursor-pointer">⭐ Mark as Featured</label>
                                    </div>
                                </div>
                                <div><label className={labelClass}>Historical Description *</label><textarea name="history" value={formData.history} onChange={handleChange} required rows="4" className={`${inputClass} resize-none`} placeholder="Write the historical significance..."></textarea></div>
                                <button type="submit" disabled={loading} className="w-full py-4 mt-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] tracking-wider transition-all disabled:opacity-50">
                                    {loading ? 'Publishing...' : '✨ Publish Shrine'}
                                </button>
                            </form>
                        )}

                        {/* ══════════════ TAB 2: MANAGE TEMPLES ══════════════ */}
                        {activeTab === 'manage' && (
                            <div>
                                <p className="text-slate-400 text-sm mb-6">{temples.length} temples in database</p>
                                {temples.length === 0 ? (
                                    <p className="text-center text-slate-400 py-10">No temples found.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {temples.map((temple) => (
                                            <div key={temple._id} className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/20 transition-all">
                                                {/* Collapsed View */}
                                                {editingTemple !== temple._id ? (
                                                    <div className="flex flex-col md:flex-row items-center gap-4 p-4">
                                                        <img
                                                            src={temple.imageUrl ? (temple.imageUrl.startsWith('http') ? temple.imageUrl : `http://localhost:5000${temple.imageUrl}`) : 'https://images.unsplash.com/photo-1623910271032-15f10b7f078e?w=100'}
                                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1623910271032-15f10b7f078e?w=100'; }}
                                                            className="w-16 h-16 object-cover rounded-xl border border-white/10 flex-shrink-0" alt={temple.templeName}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-white truncate">{temple.templeName} {temple.isFeatured && <span className="text-amber-400 text-xs">⭐</span>}</h4>
                                                            <p className="text-xs text-slate-400 uppercase tracking-widest">{temple.city}, {temple.state} · 🙏 {temple.deity}</p>
                                                            <p className="text-xs text-slate-500 mt-1">{temple.reviews?.length || 0} reviews</p>
                                                        </div>
                                                        <div className="flex gap-2 mt-3 md:mt-0">
                                                            <button onClick={() => navigate(`/temples/${temple._id}`)} className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg text-xs font-bold transition-all">👁️ View</button>
                                                            <button onClick={() => startEdit(temple)} className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-bold transition-all">✏️ Edit</button>
                                                            <button onClick={() => handleDelete(temple._id)} className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold transition-all">🗑️ Delete</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* ── EDIT FORM ── */
                                                    <div className="p-6">
                                                        <h4 className="text-orange-400 font-bold uppercase tracking-widest text-sm mb-5">✏️ Editing: {temple.templeName}</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                            {[
                                                                { label: 'Temple Name', key: 'templeName' },
                                                                { label: 'State', key: 'state' },
                                                                { label: 'City', key: 'city' },
                                                                { label: 'Deity', key: 'deity' },
                                                                { label: 'Darshan Timings', key: 'darshanTiming' },
                                                                { label: 'Rituals', key: 'rituals' },
                                                                { label: 'Dress Code', key: 'dressCode' },
                                                                { label: 'Facilities (comma)', key: 'nearbyFacilities' },
                                                                { label: 'Festivals (comma)', key: 'festivals' },
                                                            ].map(f => (
                                                                <div key={f.key}>
                                                                    <label className={labelClass}>{f.label}</label>
                                                                    <input type="text" name={f.key} value={editForm[f.key] || ''} onChange={handleEditChange} className={inputClass} />
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="mb-4">
                                                            <label className={labelClass}>Historical Description</label>
                                                            <textarea name="history" value={editForm.history || ''} onChange={handleEditChange} rows="3" className={`${inputClass} resize-none`}></textarea>
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-5">
                                                            <input type="checkbox" id={`feat-${temple._id}`} name="isFeatured" checked={editForm.isFeatured || false} onChange={handleEditChange} className="w-4 h-4" />
                                                            <label htmlFor={`feat-${temple._id}`} className="text-sm text-slate-300 font-bold cursor-pointer">⭐ Mark as Featured</label>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            <button onClick={() => submitEdit(temple._id)} disabled={editLoading} className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50">
                                                                {editLoading ? 'Saving...' : '💾 Save Changes'}
                                                            </button>
                                                            <button onClick={cancelEdit} className="px-6 py-3 bg-white/5 border border-white/10 text-slate-300 font-bold rounded-xl text-sm hover:bg-white/10 transition-all">Cancel</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ══════════════ TAB 3: USERS ══════════════ */}
                        {activeTab === 'users' && (
                            <div>
                                <p className="text-slate-400 text-sm mb-6">{users.length} registered users</p>
                                {users.length === 0 ? (
                                    <p className="text-center text-slate-400 py-10">No users found.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {users.map((u) => (
                                            <div key={u._id} className="flex flex-col md:flex-row items-center gap-4 bg-slate-900/50 p-4 border border-white/10 rounded-xl hover:border-orange-500/20 transition-all">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/50 to-amber-400/50 border border-orange-500/30 flex items-center justify-center text-lg font-extrabold text-white flex-shrink-0">
                                                    {u.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div className="flex-1 min-w-0 text-center md:text-left">
                                                    <h4 className="font-bold text-white capitalize">{u.name}</h4>
                                                    <p className="text-xs text-slate-400">{u.email}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${u.role === 'admin' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-white/5 text-slate-300 border-white/10'}`}>
                                                    {u.role}
                                                </span>
                                                {u.role !== 'admin' && (
                                                    <button onClick={() => handleDeleteUser(u._id)} className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold transition-all">
                                                        🗑️ Remove
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;