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
        imageUrl: ''
    });

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value // Jo field change hui, uski value update ho jaye
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');


        // ⚠️ SABSE IMPORTANT: localStorage se VIP Pass (Token) uthaya
        const token = localStorage.getItem('token');

        try {
            // Backend ki POST API hit ki aur sath me Token bhi bheja
            const res = await axios.post(
                'http://localhost:5000/api/temple-data/add',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // Backend ke guard ko pass dikhane ke liye
                    }
                }
            );

            setMessage('Temple added successfully to the database!');
            // form ko firse khali kar diya
            setFormData({ templeName: '', state: '', city: '', deity: '', history: '', darshanTiming: '', imageUrl: '' })
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
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Image URL</label>
                                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="https://unsplash.com/..." />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Historical Description *</label>
                            <textarea name="history" value={formData.history} onChange={handleChange} required rows="4" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" placeholder="Write about its ancient architecture, history, and significance..."></textarea>
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