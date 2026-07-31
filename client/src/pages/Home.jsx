import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [featuredTemples, setFeaturedTemples] = useState([]);
    const [stats, setStats] = useState({ total: 0, states: 0, festivals: 0, cities: 0 });
    const [loadingFeatured, setLoadingFeatured] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/temple-data/all`);
                const allTemples = res.data.data || [];

                // Featured temples (isFeatured = true, max 3)
                const featured = allTemples.filter(t => t.isFeatured).slice(0, 3);
                // If less than 3 featured, fill with latest
                if (featured.length < 3) {
                    const rest = allTemples.filter(t => !t.isFeatured).slice(0, 3 - featured.length);
                    setFeaturedTemples([...featured, ...rest]);
                } else {
                    setFeaturedTemples(featured);
                }

                // Stats — sab kuch database se calculate hoga
                const uniqueStates = [...new Set(allTemples.map(t => t.state).filter(Boolean))];
                const uniqueCities = [...new Set(allTemples.map(t => t.city).filter(Boolean))];
                // Har temple ke festivals array ko ek jagah ikatha karo, phir unique count karo
                const allFestivals = allTemples.flatMap(t => t.festivals || []);
                const uniqueFestivals = [...new Set(allFestivals.map(f => f.toLowerCase().trim()).filter(Boolean))];
                setStats({
                    total: allTemples.length,
                    states: uniqueStates.length,
                    festivals: uniqueFestivals.length,
                    cities: uniqueCities.length,
                });
            } catch (err) {
                console.error('Failed to fetch temples', err);
            } finally {
                setLoadingFeatured(false);
            }
        };
        fetchData();
    }, []);



    return (
        <div className="min-h-screen bg-slate-900 overflow-hidden font-sans">

            {/* ─── HERO SECTION ─── */}
            <div
                className="relative h-screen flex flex-col items-center justify-center"
                style={{
                    backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Dwarkadhish_temple_02.jpg/1200px-Dwarkadhish_temple_02.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-slate-900 z-0"></div>

                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fade-in-up">
                    <span className="inline-block py-1.5 px-5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-sm font-bold tracking-widest uppercase mb-8 backdrop-blur-sm shadow-[0_0_20px_rgba(249,115,22,0.3)] animate-glow-pulse">
                        🙏 Discover The Divine
                    </span>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight drop-shadow-2xl mb-6">
                        India Temple Heritage
                        <br />
                        <span className="animate-gradient-text">& Pilgrimage Portal</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md mb-12">
                        Explore historical shrines, accurate darshan timings, and ancient history — all in one divine portal.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-5">
                        <button
                            onClick={() => navigate('/temples')}
                            className="px-10 py-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold rounded-full shadow-[0_0_25px_rgba(249,115,22,0.5)] hover:shadow-[0_0_40px_rgba(249,115,22,0.7)] hover:scale-105 transition-all duration-300 text-lg"
                        >
                            🛕 Explore Temples
                        </button>
                        {!user && (
                            <button
                                onClick={() => navigate('/register')}
                                className="px-10 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-orange-500/50 text-white font-bold rounded-full transition-all duration-300 text-lg backdrop-blur"
                            >
                                Join Community
                            </button>
                        )}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-slate-400 text-xs uppercase tracking-widest flex flex-col items-center gap-2 animate-bounce-slow">
                    <span>Scroll Down</span>
                    <span className="text-lg">↓</span>
                </div>
            </div>

            {/* ─── FEATURED TEMPLES ─── */}
            <div className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">Handpicked Sacred Sites</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide mt-2">
                            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Temples</span>
                        </h2>
                        <p className="text-slate-400 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
                            Some of the most sacred and historically significant temples across India, curated for your spiritual journey.
                        </p>
                    </div>

                    {loadingFeatured ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-80 rounded-2xl animate-shimmer border border-white/5"></div>
                            ))}
                        </div>
                    ) : featuredTemples.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {featuredTemples.map((temple) => (
                                <div
                                    key={temple._id}
                                    onClick={() => navigate(`/temples/${temple._id}`)}
                                    className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-orange-500/50 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.2)] hover:-translate-y-2"
                                >
                                    <img
                                        src={temple.imageUrl
                                            ? (temple.imageUrl.startsWith('http') ? temple.imageUrl : `${import.meta.env.VITE_API_URL}${temple.imageUrl}`)
                                            : 'https://images.unsplash.com/photo-1602643163983-ed0babc39797?w=800'}
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1623910271032-15f10b7f078e?w=800'; }}
                                        alt={temple.templeName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>

                                    {temple.isFeatured && (
                                        <span className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                                            ⭐ FEATURED
                                        </span>
                                    )}

                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <span className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-1 block">{temple.state}</span>
                                        <h3 className="text-xl font-extrabold text-white tracking-wide">{temple.templeName}</h3>
                                        <p className="text-slate-300 text-xs mt-1 flex items-center gap-1">
                                            <span>🙏</span> {temple.deity}
                                        </p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <span className="text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-1 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-all">
                                                View Details →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-slate-400">No temples in database yet. <button onClick={() => navigate('/admin-dashboard')} className="text-orange-400 hover:underline">Add temples as Admin.</button></p>
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <button
                            onClick={() => navigate('/temples')}
                            className="px-10 py-4 border border-orange-500/40 hover:bg-orange-500/10 text-orange-400 font-bold rounded-full transition-all hover:border-orange-500 tracking-wider"
                        >
                            View All Temples →
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── STATS SECTION ─── */}
            <div className="border-y border-white/10 py-10" style={{ backgroundColor: '#130C07' }}>
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                        {[
                            { value: stats.total || '0', label: 'Temples' },
                            { value: stats.states || '0', label: 'States' },
                            { value: stats.festivals || '0', label: 'Festivals' },
                            { value: stats.cities || '0', label: 'Sacred Cities' },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center justify-center py-6 px-4 text-center">
                                <span className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: '#C89030' }}>
                                    {stat.value}+
                                </span>
                                <span className="mt-2 text-xs md:text-sm uppercase tracking-widest font-bold" style={{ color: '#6B5040' }}>
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>




            {/* ─── CTA SECTION ─── */}
            {!user && (
                <div className="py-20 px-6 text-center">
                    <div className="max-w-2xl mx-auto bg-gradient-to-br from-orange-600/10 to-amber-600/5 border border-orange-500/20 rounded-3xl p-12 shadow-[0_0_60px_rgba(249,115,22,0.1)]">
                        <span className="text-5xl block mb-6 animate-float">🙏</span>
                        <h2 className="text-3xl font-extrabold text-white mb-4">Start Your Digital Pilgrimage</h2>
                        <p className="text-slate-400 mb-8 leading-relaxed">
                            Join thousands of devotees. Create your free account and share your spiritual experiences with the community.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/register')}
                                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-105 transition-all"
                            >
                                Create Free Account
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold rounded-full transition-all"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;