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

    // Review Form State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewMessage, setReviewMessage] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);

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

    useEffect(() => {
        fetchSingleTemple();
    }, [id]);

    const submitReview = async (e) => {
        e.preventDefault();
        setReviewLoading(true);
        setReviewMessage('');
        setReviewError('');
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:5000/api/temple-data/${id}/reviews`, 
                { rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReviewMessage('Review added successfully! 🎉');
            setComment('');
            setRating(5);
            fetchSingleTemple(); // Refresh to show new review
        } catch (err) {
            setReviewError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setReviewLoading(false);
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

    const avgRating = temple.reviews && temple.reviews.length > 0
        ? (temple.reviews.reduce((sum, r) => sum + r.rating, 0) / temple.reviews.length).toFixed(1)
        : null;

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
                            {avgRating && (
                                <span className="bg-amber-500/20 backdrop-blur text-amber-400 text-xs font-bold px-3 py-1 rounded-full tracking-widest border border-amber-500/30">
                                    ★ {avgRating} ({temple.reviews.length} reviews)
                                </span>
                            )}
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
                                <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><span>🏨</span> Facilities Nearby</h4>
                                <div className="flex flex-wrap gap-2">
                                    {temple.nearbyFacilities?.length > 0 ? (
                                        temple.nearbyFacilities.map((fac, i) => (
                                            <span key={i} className="text-xs font-semibold bg-orange-900/30 text-orange-200 border border-orange-500/30 px-3 py-1.5 rounded-full">{fac}</span>
                                        ))
                                    ) : (
                                        <span className="text-slate-400 text-sm italic">Not specified</span>
                                    )}
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

                        {/* COMMUNITY REVIEWS SECTION */}
                        <div className="mt-12 pt-12 border-t border-white/10">
                            <h3 className="text-3xl font-extrabold text-white mb-8 tracking-wide">
                                Community Reviews
                                {temple.reviews && temple.reviews.length > 0 && (
                                    <span className="ml-3 text-lg font-normal text-slate-400">({temple.reviews.length})</span>
                                )}
                            </h3>

                            {/* REVIEW SUBMIT FORM */}
                            {user ? (
                                <form onSubmit={submitReview} className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 mb-10 shadow-lg">
                                    <h4 className="text-lg font-bold text-orange-400 mb-6 uppercase tracking-widest">Share your experience</h4>
                                    
                                    {reviewMessage && <div className="mb-4 p-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-sm font-bold">{reviewMessage}</div>}
                                    {reviewError && <div className="mb-4 p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-bold">{reviewError}</div>}

                                    <div className="mb-6">
                                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Rating</label>
                                        <select 
                                            value={rating} 
                                            onChange={(e) => setRating(Number(e.target.value))}
                                            className="w-full md:w-48 px-4 py-3 bg-slate-900/80 border border-white/10 rounded-xl text-amber-400 font-bold focus:outline-none focus:border-orange-500/50"
                                        >
                                            <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                                            <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                                            <option value={3}>⭐⭐⭐ (3/5)</option>
                                            <option value={2}>⭐⭐ (2/5)</option>
                                            <option value={1}>⭐ (1/5)</option>
                                        </select>
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Your Thoughts</label>
                                        <textarea 
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            required
                                            rows="3"
                                            placeholder="Write about the peace, architecture, or any tips for other devotees..."
                                            className="w-full px-4 py-3 bg-slate-900/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 resize-none"
                                        ></textarea>
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={reviewLoading}
                                        className="px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] tracking-wider transition-all disabled:opacity-50"
                                    >
                                        {reviewLoading ? 'Submitting...' : 'Post Review'}
                                    </button>
                                </form>
                            ) : (
                                <div className="bg-orange-900/20 p-8 rounded-2xl border border-orange-500/30 text-center mb-10">
                                    <h4 className="text-xl font-bold text-white mb-3">Have you visited this shrine?</h4>
                                    <p className="text-slate-400 mb-6">Please log in to share your spiritual experience with the community.</p>
                                    <button 
                                        onClick={() => navigate('/login')}
                                        className="px-8 py-3 bg-white/10 hover:bg-orange-500/20 border border-white/20 hover:border-orange-500/50 text-white font-bold rounded-xl transition-all"
                                    >
                                        Login to Review
                                    </button>
                                </div>
                            )}

                            {/* REVIEWS LIST */}
                            <div className="space-y-6">
                                {temple.reviews && temple.reviews.length > 0 ? (
                                    [...temple.reviews].reverse().map((rev, index) => (
                                        <div key={index} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h5 className="font-bold text-white text-lg capitalize">{rev.name}</h5>
                                                    <span className="text-xs text-slate-500 uppercase tracking-widest">
                                                        {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <div className="bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                                                    <span className="text-amber-400 font-bold">
                                                        {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-slate-300 italic leading-relaxed">"{rev.comment}"</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <span className="text-4xl block mb-4 opacity-50">✍️</span>
                                        <p className="text-slate-400">No reviews yet. Be the first to share your experience!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TempleDetails;