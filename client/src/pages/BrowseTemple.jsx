import React, { useEffect, useState } from 'react'
import axios from 'axios';

const BrowseTemple = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [temples, setTemples] = useState([
  ]);

  useEffect(() => {
    const fetchTemple = async () => {
      try {
        // hit backend's GET Api
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
        setError('Failed to fetch temple data')
        setLoading(false)
      }
    };

    fetchTemple();
  }, []);

  return (
    <div className='min-h-screen bg-slate-50'>

      <div className='max-w-7xl mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold text-slate-800 border-b pb-4 mb-8'>
          Historical Shrines & Temples
        </h1>

        {/* Agar data load ho raha hai toh Loading dikhao */}
        {loading && (
          <div className="text-center text-lg font-medium text-slate-600 mt-10">
            Loading heritage sites...
          </div>
        )}

        {/* Agar koi error aayi toh wo dikhao */}
        {error && (
          <div className="text-center text-red-600 font-medium mt-10">
            {error}
          </div>
        )}

        {/* Temple ka grid layout */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {Array.isArray(temples) && temples.map((temple) => (
            <div key={temple._id} className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image Container with Hover Zoom Effect */}
              <div className="overflow-hidden relative h-56 w-full">
                <img
                  src={
                    temple.imageUrl
                      ? (temple.imageUrl.startsWith('http')
                        ? temple.imageUrl
                        : `http://localhost:5000${temple.imageUrl}`)
                      : 'https://images.unsplash.com/photo-1602643163983-ed0babc39797?w=800'
                  }
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = 'https://images.unsplash.com/photo-1623910271032-15f10b7f078e?auto=format&fit=crop&q=80&w=800'; // Beautiful fallback image
                  }}
                  alt={temple.templeName}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-5 relative">
                {temple.isFeatured && (
                  <span className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                    ⭐ FEATURED
                  </span>
                )}
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {temple.state || 'India'}
                </span>
                <h3 className="text-xl font-bold text-slate-800 mt-3 pr-8">
                  {temple.templeName}
                </h3>
                <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                  {temple.history || 'Explore the rich history and architecture of this ancient shrine.'}
                </p>

                {/* Naye Fields yahan display honge */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Rituals:</span>
                    <span className="line-clamp-1">{temple.rituals || 'Not available'}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Dress Code:</span>
                    <span className="line-clamp-1">{temple.dressCode || 'Traditional'}</span>
                  </div>

                  {/* Facilities ko chhote badges me dikhayenge */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {temple.nearbyFacilities && temple.nearbyFacilities.length > 0 ? (
                      temple.nearbyFacilities.map((facility, index) => (
                        <span key={index} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                          {facility}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">No facilities listed</span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                  <span>🕒 {temple.darshanTiming || '6:00 AM - 9:00 PM'}</span>
                  <button className="px-3 py-1.5 bg-slate-800 text-white rounded font-medium hover:bg-slate-900 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default BrowseTemple
