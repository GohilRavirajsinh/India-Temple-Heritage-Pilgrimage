import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BrowseTemple = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [temples, setTemples] = useState([]);
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate();

  const fetchTemple = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/temple-data/all');
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        setTemples(res.data.data);
      } else if (Array.isArray(res.data)) {
        setTemples(res.data);
      } else if (res.data.temples) {
        setTemples(res.data.temples);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch temple data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemple();
  }, []);

  // Search krne par chalne vala function
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      fetchTemple();
      return;
    }

    try {
      setLoading(true);
      setError('');
      // backend ki search API par request
      const res = await axios.get(`http://localhost:5000/api/temple-data/search?query=${searchQuery}`)

      setTemples(res.data.data || []);

      if(res.data.data && res.data.data.length === 0) {
        setError('No temples found matching your search!');
      }
      setLoading(false);
    } catch (err) {
      setError('Search failed. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen bg-slate-900 pt-28 pb-12 font-sans'>
      <div className='max-w-7xl mx-auto px-4'>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6">
            <div>
                <span className="text-orange-400 font-bold tracking-widest text-sm uppercase mb-2 block">Sacred Destinations</span>
                <h1 className='text-4xl md:text-5xl font-extrabold text-white tracking-tight'>
                Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Shrines</span>
                </h1>
            </div>
            <p className="text-slate-400 max-w-md text-sm mt-4 md:mt-0 md:text-right leading-relaxed">
                Discover the divine architecture, rich history, and spiritual essence of ancient temples across India.
            </p>
        </div>

        {/* 🌟 NAYA SEARCH BAR UI START 🌟 */}
        <form onSubmit={handleSearch} className="mb-10 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-lg focus-within:border-orange-500/50 focus-within:shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all duration-300">
                <div className="pl-4 text-slate-400">
                    <span className="text-xl">🔍</span>
                </div>
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by temple name, state, city or deity..." 
                    className="w-full bg-transparent border-none text-white px-4 py-2 outline-none placeholder-slate-500"
                />
                <button 
                    type="submit"
                    className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold px-6 py-2.5 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all cursor-pointer"
                >
                    Search
                </button>
            </div>
        </form>
        {/* 🌟 SEARCH BAR UI END 🌟 */}

        {/* Loading Message */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Error / Not Found Message */}
        {error && !loading && (
          <div className="text-center text-orange-300 font-medium bg-orange-900/20 py-8 rounded-2xl border border-orange-500/30 shadow-inner">
            <span className="text-3xl block mb-2">🤔</span>
            {error}
          </div>
        )}

        {/* Cards Grid */}
        {!loading && !error && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {Array.isArray(temples) && temples.map((temple) => (
              <div key={temple._id} className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] border border-white/10 transition-all duration-300 group hover:-translate-y-2">
                
                <div className="overflow-hidden relative h-64 w-full">
                  <img
                    src={
                      temple.imageUrl
                        ? (temple.imageUrl.startsWith('http')
                          ? temple.imageUrl
                          : `http://localhost:5000${temple.imageUrl}`)
                        : 'https://images.unsplash.com/photo-1602643163983-ed0babc39797?w=800'
                    }
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://images.unsplash.com/photo-1623910271032-15f10b7f078e?auto=format&fit=crop&q=80&w=800'; 
                    }}
                    alt={temple.templeName}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-90"></div>
                  
                  {temple.isFeatured && (
                    <span className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 tracking-wider">
                      ⭐ FEATURED
                    </span>
                  )}
                  <span className="absolute bottom-4 left-4 text-xs font-bold text-amber-200 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
                    {temple.state || 'India'}
                  </span>
                </div>

                <div className="p-6 relative">
                  <h3 className="text-2xl font-bold text-white mb-6 tracking-wide drop-shadow-md">
                    {temple.templeName}
                  </h3>

                  <button
                    onClick={() => navigate(`/temples/${temple._id}`)}
                    className="w-full px-4 py-3 bg-white/5 hover:bg-gradient-to-r hover:from-orange-600 hover:to-amber-500 text-white rounded-xl font-bold transition-all duration-300 shadow-md border border-white/10 hover:border-transparent group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
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
  )
}

export default BrowseTemple;