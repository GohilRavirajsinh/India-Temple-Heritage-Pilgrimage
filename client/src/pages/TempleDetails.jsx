import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const TempleDetails = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const [temple, setTemple] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const fetchSingleTemple = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/temple-data/${id}`);
            setTemple(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Temple load hone me error aayi", error);
            setLoading(false);
        }
    };

    const checkSavedStatus = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/auth/saved-temples', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const savedTemples = res.data.data || [];
            setIsSaved(savedTemples.some(t => t._id === id || t === id));
        } catch (err) {
            console.error("Failed to check saved status");
        }
    };

    useEffect(() => {
        fetchSingleTemple();
        checkSavedStatus();
    }, [id, user]);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: temple?.templeName,
                text: `Check out ${temple?.templeName} on India Temple Heritage Portal!`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    const toggleSave = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setSaveLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (isSaved) {
                await axios.delete(`http://localhost:5000/api/auth/save-temple/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsSaved(false);
            } else {
                await axios.post(`http://localhost:5000/api/auth/save-temple/${id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsSaved(true);
            }
        } catch (err) {
            console.error("Failed to toggle save", err);
        } finally {
            setSaveLoading(false);
        }
    };
    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
        </div>
    );

    if (!temple) return (
        <div className="min-h-screen bg-slate-900 flex justify-center items-center">
            <div className="text-center text-red-500 text-2xl font-bold bg-red-900/20 px-8 py-4 rounded-xl border border-red-500/30">
                Temple Not Found!
            </div>
        </div>
    );



    return (
        <div className="min-h-screen bg-slate-900 pt-28 pb-20 px-4 font-sans">
            <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-lg rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden">
                
                {/* Hero Image Section */}
                <div className="relative h-96 w-full">
                    <img 
                        src={temple.imageUrl ? (temple.imageUrl.startsWith('http') ? temple.imageUrl : `http://localhost:5000${temple.imageUrl}`) : 'https://images.unsplash.com/photo-1602643163983-ed0babc39797?w=1200'} 
                        alt={temple.templeName}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1623910271032-15f10b7f078e?auto=format&fit=crop&q=80&w=1200'; }}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                    
                    <div className="absolute bottom-8 left-8 right-8">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-orange-500/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg border border-orange-400/50">
                                {temple.state}
                            </span>
                            <span className="bg-white/10 backdrop-blur text-slate-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
                                {temple.city}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-xl">
                            {temple.templeName}
                        </h1>
                        <p className="text-xl font-medium text-amber-300 mt-2 drop-shadow-md flex items-center gap-2">
                            <span>🙏</span> Deity: {temple.deity}
                        </p>
                    </div>
                </div>
                
                {/* Content Section */}
                <div className="p-8 md:p-12">
                    <div className="space-y-10">
                        {/* History */}
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/5 shadow-inner">
                            <h3 className="text-2xl font-bold text-orange-400 mb-4 flex items-center gap-3">
                                <span>📜</span> Historical Significance
                            </h3>
                            <p className="text-slate-300 leading-relaxed text-lg font-light tracking-wide">
                                {temple.history}
                            </p>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-white/5 to-transparent p-6 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-colors">
                                <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><span>🕒</span> Darshan Timings</h4>
                                <p className="text-slate-300">{temple.darshanTiming}</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-white/5 to-transparent p-6 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-colors">
                                <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><span>👕</span> Dress Code</h4>
                                <p className="text-slate-300">{temple.dressCode || "Traditional Wear Preferred"}</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-white/5 to-transparent p-6 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-colors">
                                <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><span>🕉️</span> Key Rituals</h4>
                                <p className="text-slate-300">{temple.rituals}</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-white/5 to-transparent p-6 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-colors">
                                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-xl mb-4">{temple.templeName}</h1>
                                
                                <div className="flex gap-4 mt-6">
                                    <button 
                                        disabled={saveLoading}
                                        className={`px-6 py-2.5 backdrop-blur font-bold rounded-xl border transition-all shadow-lg flex items-center gap-2 ${
                                            isSaved 
                                            ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                                            : 'bg-white/20 hover:bg-white/30 text-white border-white/30'
                                        }`}
                                        onClick={toggleSave}
                                    >
                                        {isSaved ? '🔖 Saved' : '🔖 Save'}
                                    </button>
                                    <button 
                                        onClick={handleShare}
                                        className="px-6 py-2.5 bg-black/40 hover:bg-black/60 backdrop-blur text-white font-bold rounded-xl border border-white/20 transition-all shadow-lg flex items-center gap-2"
                                    >
                                        🔗 Share
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Festivals Section */}
                        {temple.festivals && temple.festivals.length > 0 && (
                            <div className="bg-gradient-to-br from-orange-900/20 to-transparent p-6 rounded-2xl border border-orange-500/20">
                                <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><span>🎉</span> Major Festivals</h4>
                                <div className="flex flex-wrap gap-2">
                                    {temple.festivals.map((fest, i) => (
                                        <span key={i} className="text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-full">{fest}</span>
                                    ))}
                                </div>
                            </div>
                        )}



                    </div>
                </div>
            </div>
        </div>
    );
};

export default TempleDetails;