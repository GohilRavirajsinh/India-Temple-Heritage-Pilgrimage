import React, { useState } from 'react'
import axios from 'axios'

const AdminDashboard = () => {
    const [formData, setFormData] = useState({
        templeName: '',
        state: '',
        city: '',
        deity: '',
        history: '',
        darshanTiming: '',
        imageUrl: null,
        rituals: '',
        dressCode: '',
        nearbyFacilities: '',
        isFeatured: false
    });

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

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
        setLoading(true);
        setMessage('');
        setError('');

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
            dataToSubmit.append('isFeatured', formData.isFeatured);
            
            if (formData.imageUrl) {
                dataToSubmit.append('imageUrl', formData.imageUrl);
            }

            const res = await axios.post(
                'http://localhost:5000/api/temple-data/add',
                dataToSubmit,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setMessage('Temple added successfully to the database!');
            setFormData({ templeName: '', state: '', city: '', deity: '', history: '', darshanTiming: '', imageUrl: null, rituals: '', dressCode: '', nearbyFacilities: '', isFeatured: false })
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add temple data. Check token/role.');
        } finally {
            setLoading(false);
        };
    }

    return (
        <div className="min-h-screen bg-slate-900 pt-28 pb-20 px-4 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 p-8 md:p-12">
                    
                    <div className="text-center mb-10">
                        <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-3">Admin Portal</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            Heritage Management
                        </h2>
                        <p className="text-slate-400 mt-3 font-medium">
                            Add new historical shrines & heritage sites to the global database
                        </p>
                    </div>

                    {/* Status Messages */}
                    {message && <div className="p-4 mb-8 bg-green-500/20 text-green-400 font-bold rounded-xl border border-green-500/30 text-center tracking-wide">{message}</div>}
                    {error && <div className="p-4 mb-8 bg-red-500/20 text-red-400 font-bold rounded-xl border border-red-500/30 text-center tracking-wide">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Temple Name *</label>
                                <input type="text" name="templeName" value={formData.templeName} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all" placeholder="e.g., Sun Temple" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">State / Location *</label>
                                <input type="text" name="state" value={formData.state} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all" placeholder="e.g., Odisha" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">City *</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all" placeholder="e.g., Konark" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Deity *</label>
                                <input type="text" name="deity" value={formData.deity} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all" placeholder="e.g., Surya" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Timings *</label>
                                <input type="text" name="darshanTiming" value={formData.darshanTiming} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all" placeholder="e.g., 6:00 AM - 8:00 PM" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Rituals & Pooja *</label>
                                <input type="text" name="rituals" value={formData.rituals} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all" placeholder="e.g., Morning Aarti at 5 AM" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Dress Code</label>
                                <input type="text" name="dressCode" value={formData.dressCode} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all" placeholder="e.g., Traditional Wear only" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Facilities Nearby (Comma separated)</label>
                                <input type="text" name="nearbyFacilities" value={formData.nearbyFacilities} onChange={handleChange} className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all" placeholder="e.g., Hotel, Railway Station" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Upload Image</label>
                                <input type="file" name="imageUrl" accept="image/*" onChange={handleChange} className="w-full px-4 py-2 border border-white/10 bg-slate-900/50 rounded-xl text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-orange-500/20 file:text-orange-400 hover:file:bg-orange-500/30 transition-all" />
                            </div>
                            <div className="md:col-span-1 flex items-center bg-slate-900/50 px-4 py-3 rounded-xl border border-white/10">
                                <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 text-orange-500 bg-slate-800 border-white/20 rounded focus:ring-orange-500 focus:ring-2 focus:ring-offset-slate-900" />
                                <label htmlFor="isFeatured" className="ml-3 text-sm font-bold text-slate-300 uppercase tracking-wide cursor-pointer">Mark as Featured</label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Historical Description *</label>
                            <textarea name="history" value={formData.history} onChange={handleChange} required rows="4" className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all resize-none" placeholder="Write about its ancient architecture, history, and significance..."></textarea>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-4 mt-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] transition-all duration-300 tracking-wider disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Adding Shrine to Database...' : '✨ Publish Shrine'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;