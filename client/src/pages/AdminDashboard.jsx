import React, { useState } from 'react'
import axios from 'axios'

const AdminDashboard = () => {
    // Form ka saara data ek hi object state me save kar rahe hain
    const [formData, setFormData] = useState({
        templeName: '',
        state: '',
        city: '',
        deity: '',
        history: '',
        darshanTiming: '',
        imageUrl: null, // ab ye file object banega
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
            // File input handle karna
            setFormData({ ...formData, imageUrl: e.target.files[0] });
        } else if (e.target.type === 'checkbox') {
            // Checkbox (isFeatured) handle karna
            setFormData({ ...formData, [e.target.name]: e.target.checked });
        } else {
            // Normal text inputs
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');


        // ⚠️ SABSE IMPORTANT: localStorage se VIP Pass (Token) uthaya
        const token = localStorage.getItem('token');

        try {
            // Backend par file aur data bhejne ke liye FormData object zaroori hai
            const dataToSubmit = new FormData();
            dataToSubmit.append('templeName', formData.templeName);
            dataToSubmit.append('state', formData.state);
            dataToSubmit.append('city', formData.city);
            dataToSubmit.append('deity', formData.deity);
            dataToSubmit.append('history', formData.history);
            dataToSubmit.append('darshanTiming', formData.darshanTiming);
            dataToSubmit.append('rituals', formData.rituals);
            dataToSubmit.append('dressCode', formData.dressCode);
            // Comma separated string ko array me bhejna
            const facilitiesArray = formData.nearbyFacilities.split(',').map(f => f.trim()).filter(f => f);
            facilitiesArray.forEach(f => dataToSubmit.append('nearbyFacilities[]', f));
            dataToSubmit.append('isFeatured', formData.isFeatured);
            
            if (formData.imageUrl) {
                dataToSubmit.append('imageUrl', formData.imageUrl);
            }

            // Backend ki POST API hit ki aur sath me Token bhi bheja
            const res = await axios.post(
                'http://localhost:5000/api/temple-data/add',
                dataToSubmit,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Backend ke guard ko pass dikhane ke liye
                        'Content-Type': 'multipart/form-data' // File upload ke liye important
                    }
                }
            );

            setMessage('Temple added successfully to the database!');
            // form ko firse khali kar diya
            setFormData({ templeName: '', state: '', city: '', deity: '', history: '', darshanTiming: '', imageUrl: null, rituals: '', dressCode: '', nearbyFacilities: '', isFeatured: false })
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add temple data. Check token/role.');
        } finally {
            setLoading(false);
        };
    }

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="max-w-2xl mx-auto px-4 py-10">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                    <h2 className="text-3xl font-extrabold text-slate-800 text-center mb-2">
                        Admin Dashboard
                    </h2>
                    <p className="text-sm text-slate-500 text-center mb-8">
                        Add new historical shrines & heritage sites to the global database
                    </p>

                    {/* Status Messages */}
                    {message && <div className="p-4 mb-6 bg-green-50 text-green-700 font-medium rounded-lg border border-green-200 text-sm text-center">{message}</div>}
                    {error && <div className="p-4 mb-6 bg-red-50 text-red-700 font-medium rounded-lg border border-red-200 text-sm text-center">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Temple Name *</label>
                                <input type="text" name="templeName" value={formData.templeName} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g., Sun Temple" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">State / Location *</label>
                                <input type="text" name="state" value={formData.state} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g., Odisha" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">City *</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g., Konark" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Deity *</label>
                                <input type="text" name="deity" value={formData.deity} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g., Surya" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Timings *</label>
                                <input type="text" name="darshanTiming" value={formData.darshanTiming} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g., 6:00 AM - 8:00 PM" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Rituals & Pooja *</label>
                                <input type="text" name="rituals" value={formData.rituals} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g., Morning Aarti at 5 AM" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Dress Code</label>
                                <input type="text" name="dressCode" value={formData.dressCode} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g., Traditional Wear only" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Nearby Facilities (Comma separated)</label>
                                <input type="text" name="nearbyFacilities" value={formData.nearbyFacilities} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="e.g., Hotel, Railway Station, Bus Stand" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Upload Temple Image</label>
                                <input type="file" name="imageUrl" accept="image/*" onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Historical Description *</label>
                            <textarea name="history" value={formData.history} onChange={handleChange} required rows="3" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" placeholder="Write about its ancient architecture, history, and significance..."></textarea>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                            <label htmlFor="isFeatured" className="text-sm font-semibold text-slate-700">Mark as Featured Temple</label>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition-colors shadow-md disabled:bg-slate-400">
                            {loading ? 'Adding Shrine to Database...' : '✨ Add Temple'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default AdminDashboard