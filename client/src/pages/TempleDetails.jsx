import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TempleDetails = () => {
    const { id } = useParams(); 
    
    const [temple, setTemple] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchSingleTemple();
    }, [id]);

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
                                <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <span>🕒</span> Darshan Timings
                                </h4>
                                <p className="text-slate-300">{temple.darshanTiming}</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-white/5 to-transparent p-6 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-colors">
                                <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <span>👕</span> Dress Code
                                </h4>
                                <p className="text-slate-300">{temple.dressCode || "Traditional Wear Preferred"}</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-white/5 to-transparent p-6 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-colors">
                                <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <span>🕉️</span> Key Rituals
                                </h4>
                                <p className="text-slate-300">{temple.rituals}</p>
                            </div>
                            
                            <div className="bg-gradient-to-br from-white/5 to-transparent p-6 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-colors">
                                <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                    <span>🏨</span> Facilities Nearby
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {temple.nearbyFacilities?.length > 0 ? (
                                        temple.nearbyFacilities.map((fac, i) => (
                                            <span key={i} className="text-xs font-semibold bg-orange-900/30 text-orange-200 border border-orange-500/30 px-3 py-1.5 rounded-full">
                                                {fac}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-slate-400 text-sm italic">Not specified</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TempleDetails;