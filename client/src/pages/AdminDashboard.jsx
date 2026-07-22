import React, { useState, useEffect } from 'react'
import axios from 'axios'

const AdminDashboard = () => {
    // 🌟 NAYA: 'festivals' field form state me add kiya
    const [formData, setFormData] = useState({
        templeName: '', state: '', city: '', deity: '', history: '',
        darshanTiming: '', imageUrl: null, rituals: '', dressCode: '',
        nearbyFacilities: '', festivals: '', isFeatured: false
    });

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [temples, setTemples] = useState([]);
    const [activeTab, setActiveTab] = useState('add');

    const fetchTemples = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/temple-data/all');
            setTemples(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch temples");
        }
    };

    useEffect(() => {
        if (activeTab === 'manage') {
            fetchTemples();
        }
    }, [activeTab]);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this temple? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/temple-data/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setTemples(temples.filter(temple => temple._id !== id));
            setMessage("Temple deleted successfully!");
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete temple');
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
            
            // comma-separated string ko array me convert karna
            const facilitiesArray = formData.nearbyFacilities.split(',').map(f => f.trim()).filter(f => f);
            facilitiesArray.forEach(f => dataToSubmit.append('nearbyFacilities[]', f));
            
            // 🌟 NAYA: festivals string ko array me convert karke bhejna
            const festivalsArray = formData.festivals.split(',').map(f => f.trim()).filter(f => f);
            festivalsArray.forEach(f => dataToSubmit.append('festivals[]', f));

            dataToSubmit.append('isFeatured', formData.isFeatured);
            if (formData.imageUrl) dataToSubmit.append('imageUrl', formData.imageUrl);

            await axios.post('http://localhost:5000/api/temple-data/add', dataToSubmit, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });

            setMessage('Temple added successfully to the database!');
            setFormData({ templeName: '', state: '', city: '', deity: '', history: '', darshanTiming: '', imageUrl: null, rituals: '', dressCode: '', nearbyFacilities: '', festivals: '', isFeatured: false })
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add temple data.');
        } finally {
            setLoading(false);
        };
    }

    return (
        <div className="min-h-screen bg-slate-900 pt-28 pb-20 px-4 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden">
                    
                    <div className="flex border-b border-white/10">
                        <button 
                            onClick={() => setActiveTab('add')}
                            className={`flex-1 py-5 font-bold tracking-widest uppercase transition-all ${activeTab === 'add' ? 'bg-orange-500/20 text-orange-400 border-b-2 border-orange-500' : 'text-slate-400 hover:bg-white/5'}`}
                        >
                            ➕ Add New Temple
                        </button>
                        <button 
                            onClick={() => setActiveTab('manage')}
                            className={`flex-1 py-5 font-bold tracking-widest uppercase transition-all ${activeTab === 'manage' ? 'bg-orange-500/20 text-orange-400 border-b-2 border-orange-500' : 'text-slate-400 hover:bg-white/5'}`}
                        >
                            ⚙️ Manage Temples
                        </button>
                    </div>

                    <div className="p-8 md:p-12">
                        {message && <div className="p-4 mb-8 bg-green-500/20 text-green-400 font-bold rounded-xl border border-green-500/30 text-center tracking-wide">{message}</div>}
                        {error && <div className="p-4 mb-8 bg-red-500/20 text-red-400 font-bold rounded-xl border border-red-500/30 text-center tracking-wide">{error}</div>}

                        {/* ===================== TAB 1: ADD TEMPLE ===================== */}
                        {activeTab === 'add' && (
                            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Temple Name *</label><input type="text" name="templeName" value={formData.templeName} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50" /></div>
                                    <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">State *</label><input type="text" name="state" value={formData.state} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50" /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">City *</label><input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50" /></div>
                                    <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Deity *</label><input type="text" name="deity" value={formData.deity} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50" /></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Timings *</label><input type="text" name="darshanTiming" value={formData.darshanTiming} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50" placeholder="e.g., 6:00 AM - 8:00 PM"/></div>
                                    <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Rituals & Pooja</label><input type="text" name="rituals" value={formData.rituals} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50" /></div>
                                </div>
                                
                                {/* 🌟 NAYA: Festivals & Facilities Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Dress Code</label><input type="text" name="dressCode" value={formData.dressCode} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50" placeholder="e.g., Traditional"/></div>
                                    <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Facilities (Comma separated)</label><input type="text" name="nearbyFacilities" value={formData.nearbyFacilities} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50" placeholder="Hotel, Parking"/></div>
                                    <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Festivals (Comma separated)</label><input type="text" name="festivals" value={formData.festivals} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50" placeholder="Maha Shivratri, Diwali"/></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                    <div className="md:col-span-1"><label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Upload Image</label><input type="file" name="imageUrl" accept="image/*" onChange={handleChange} className="w-full px-4 py-2 border border-white/10 bg-slate-900/50 rounded-xl text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-orange-500/20 file:text-orange-400 hover:file:bg-orange-500/30 transition-all" /></div>
                                    <div className="md:col-span-1 flex items-center bg-slate-900/50 px-4 py-3 rounded-xl border border-white/10">
                                        <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 text-orange-500 bg-slate-800 border-white/20 rounded focus:ring-orange-500 focus:ring-2 focus:ring-offset-slate-900" />
                                        <label htmlFor="isFeatured" className="ml-3 text-sm font-bold text-slate-300 uppercase tracking-wide cursor-pointer">Mark as Featured</label>
                                    </div>
                                </div>
                                <div><label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Historical Description *</label><textarea name="history" value={formData.history} onChange={handleChange} required rows="3" className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 resize-none"></textarea></div>
                                
                                <button type="submit" disabled={loading} className="w-full py-4 mt-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] tracking-wider">
                                    {loading ? 'Adding Shrine...' : '✨ Publish Shrine'}
                                </button>
                            </form>
                        )}

                        {/* ===================== TAB 2: MANAGE TEMPLES ===================== */}
                        {activeTab === 'manage' && (
                            <div className="animate-fade-in">
                                {temples.length === 0 ? (
                                    <p className="text-center text-slate-400 py-10">No temples found in the database.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {temples.map((temple) => (
                                            <div key={temple._id} className="flex flex-col md:flex-row justify-between items-center bg-slate-900/50 p-4 border border-white/10 rounded-xl hover:border-orange-500/30 transition-all">
                                                <div className="flex items-center gap-4 w-full md:w-auto">
                                                    {/* 🌟 NAYA: Image ke liye Fallback lagaya (onError) */}
                                                    <img 
                                                        src={temple.imageUrl ? (temple.imageUrl.startsWith('http') ? temple.imageUrl : `http://localhost:5000${temple.imageUrl}`) : 'https://images.unsplash.com/photo-1623910271032-15f10b7f078e?w=100'} 
                                                        onError={(e) => {
                                                            e.target.onerror = null; 
                                                            e.target.src = 'https://images.unsplash.com/photo-1623910271032-15f10b7f078e?auto=format&fit=crop&q=80&w=100'; 
                                                        }}
                                                        className="w-16 h-16 object-cover rounded-lg border border-white/10"
                                                        alt={temple.templeName}
                                                    />
                                                    <div>
                                                        <h4 className="font-bold text-white">{temple.templeName}</h4>
                                                        <p className="text-xs text-slate-400 uppercase tracking-widest">{temple.state}, {temple.city}</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-4 md:mt-0 flex gap-3 w-full md:w-auto">
                                                    <button 
                                                        onClick={() => handleDelete(temple._id)}
                                                        className="flex-1 md:flex-none px-4 py-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-bold uppercase tracking-widest transition-all"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </div>
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