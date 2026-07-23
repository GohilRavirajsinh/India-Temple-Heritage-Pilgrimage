import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const INDIAN_STATES = [
    'All', 'Gujarat', 'Uttar Pradesh', 'Tamil Nadu', 'Rajasthan', 'Maharashtra',
    'Karnataka', 'Andhra Pradesh', 'Odisha', 'West Bengal', 'Madhya Pradesh',
    'Kerala', 'Uttarakhand', 'Bihar', 'Himachal Pradesh'
];

const BrowseTemple = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [temples, setTemples] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeState, setActiveState] = useState('All');
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate();

    const fetchTemple = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await axios.get('http://localhost:5000/api/temple-data/all');
            const data = res.data?.data || [];
            setTemples(data);
            setTotalCount(data.length);
        } catch (err) {
            setError('Failed to fetch temple data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemple();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) { fetchTemple(); setActiveState('All'); return; }
        try {
            setLoading(true);
            setError('');
            setActiveState('All');
            const res = await axios.get(`http://localhost:5000/api/temple-data/search?query=${searchQuery}`);
            const data = res.data.data || [];
            setTemples(data);
            if (data.length === 0) setError('No temples found matching your search!');
        } catch (err) {
            setError('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStateFilter = async (state) => {
        setActiveState(state);
        setSearchQuery('');
        if (state === 'All') { fetchTemple(); return; }
        try {
            setLoading(true);
            setError('');
            const res = await axios.get(`http://localhost:5000/api/temple-data/search?state=${state}`);
            const data = res.data.data || [];
            setTemples(data);
            if (data.length === 0) setError(`No temples found in ${state}.`);
        } catch (err) {
            setError('Filter failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-slate-900 pt-28 pb-16 font-sans'>
            <div className='max-w-7xl mx-auto px-4'>

                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-3 block">Sacred Destinations</span>
                    <h1 className='text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4'>
                        Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Shrines</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                        Discover the divine architecture, rich history, and spiritual essence of ancient temples across India.
                        {!loading && <span className="text-orange-400 font-bold ml-1">{totalCount} temples listed.</span>}
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-8 max-w-2xl mx-auto">
                    <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-lg focus-within:border-orange-500/50 focus-within:shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all duration-300">
                        <div className="pl-4 text-slate-400 text-xl">🔍</div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by temple name, state, city or deity..."
                            className="w-full bg-transparent border-none text-white px-4 py-2 outline-none placeholder-slate-500"
                        />
                        {searchQuery && (
                            <button type="button" onClick={() => { setSearchQuery(''); fetchTemple(); setActiveState('All'); }}
                                className="text-slate-400 hover:text-white px-2 text-xl transition-colors">✕</button>
                        )}
                        <button type="submit"
                            className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold px-6 py-2.5 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all">
                            Search
                        </button>
                    </div>
                </form>

                {/* State Filter Chips */}
                <div className="flex flex-wrap gap-2 justify-center mb-10">
                    {INDIAN_STATES.map((state) => (
                        <button
                            key={state}
                            onClick={() => handleStateFilter(state)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                                activeState === state
                                    ? 'bg-orange-500 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                                    : 'bg-white/5 border-white/10 text-slate-300 hover:border-orange-500/50 hover:text-orange-400'
                            }`}
                        >
                            {state}
                        </button>
                    ))}
                </div>

                {/* Loading Skeleton */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-72 rounded-2xl animate-shimmer border border-white/5"></div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="text-center text-orange-300 font-medium bg-orange-900/20 py-12 rounded-2xl border border-orange-500/30 shadow-inner">
                        <span className="text-4xl block mb-3">🤔</span>
                        {error}
                        <br />
                        <button onClick={fetchTemple} className="mt-4 text-sm text-orange-400 hover:underline">Reset & show all</button>
                    </div>
                )}

                {/* Temple Cards */}
                {!loading && !error && (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {Array.isArray(temples) && temples.map((temple) => (
                            <div key={temple._id} className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-[0_0_35px_rgba(249,115,22,0.15)] border border-white/10 transition-all duration-300 group hover:-translate-y-2">

                                <div className="overflow-hidden relative h-56 w-full">
                                    <img
                                        src={temple.imageUrl
                                            ? (temple.imageUrl.startsWith('http') ? temple.imageUrl : `http://localhost:5000${temple.imageUrl}`)
                                            : 'https://images.unsplash.com/photo-1602643163983-ed0babc39797?w=800'}
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1623910271032-15f10b7f078e?auto=format&fit=crop&q=80&w=800'; }}
                                        alt={temple.templeName}
                                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>

                                    {temple.isFeatured && (
                                        <span className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 tracking-wider">
                                            ⭐ FEATURED
                                        </span>
                                    )}

                                    {/* Reviews count */}
                                    {temple.reviews && temple.reviews.length > 0 && (
                                        <span className="absolute top-3 left-3 bg-black/50 backdrop-blur text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
                                            ★ {(temple.reviews.reduce((s, r) => s + r.rating, 0) / temple.reviews.length).toFixed(1)} ({temple.reviews.length})
                                        </span>
                                    )}

                                    <span className="absolute bottom-3 left-3 text-xs font-bold text-amber-200 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-widest border border-white/20">
                                        {temple.state || 'India'}
                                    </span>
                                </div>

                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-white mb-1 tracking-wide">{temple.templeName}</h3>
                                    <p className="text-slate-400 text-xs mb-1 flex items-center gap-1"><span>🙏</span> {temple.deity}</p>
                                    <p className="text-slate-500 text-xs mb-5 flex items-center gap-1"><span>📍</span> {temple.city}, {temple.state}</p>

                                    <button
                                        onClick={() => navigate(`/temples/${temple._id}`)}
                                        className="w-full px-4 py-3 bg-white/5 hover:bg-gradient-to-r hover:from-orange-600 hover:to-amber-500 text-white rounded-xl font-bold transition-all duration-300 shadow-md border border-white/10 hover:border-transparent group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] text-sm"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseTemple;