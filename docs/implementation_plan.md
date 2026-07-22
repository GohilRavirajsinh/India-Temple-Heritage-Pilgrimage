# ⭐ Phase 2: Review & Rating System (Frontend UI)

Bhai, Backend (Database API) ready hai (reviews array aur addReview API). Ab humein sirf Frontend (`TempleDetails.jsx`) me changes karne hain jisse Review Form aur logo ke diye gaye reviews dikhe.

Apni file **`client/src/pages/TempleDetails.jsx`** kholiye aur neeche diye gaye exact lines par ye code replace/add kijiye:

---

### 1. Line 1 se 3 (Imports Update Karein)
In lines ko mitakar ye naya code daaliye:
```jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
```

---

### 2. Line 6 se 9 (Variables Update Karein)
In lines ko mitakar ye naya code daaliye:
```jsx
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [temple, setTemple] = useState(null);
    const [loading, setLoading] = useState(true);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewMessage, setReviewMessage] = useState('');
```

---

### 3. Line 11 se 23 (`useEffect` ko replace karke Submit Function daalein)
Is poore block ko mitakar ye naya code daaliye:
```jsx
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
        setReviewMessage('');
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/temple-data/${id}/reviews`, 
                { rating, comment }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReviewMessage('Review added successfully! 🎉');
            setComment(''); setRating(5);
            fetchSingleTemple();
        } catch (err) {
            setReviewMessage(err.response?.data?.message || 'Failed to submit review');
        }
    };
```

---

### 4. Line 46 (Image par Fallback Lagayein)
Jahan `<img` tag hai, usme `alt={temple.templeName}` ke theek neeche ye line add kijiye:
```jsx
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1623910271032-15f10b7f078e?auto=format&fit=crop&q=80&w=1200'; }}
```

---

### 5. Line 122 (Review UI Design daaliye)
Aapke code me **Line 122 aur 123 ke beech me** (matlab `Details Grid` khatam hone ke theek baad) ye poora naya code daaliye:

```jsx
                        {/* REVIEWS SECTION */}
                        <div className="mt-12 pt-12 border-t border-white/10">
                            <h3 className="text-3xl font-extrabold text-white mb-8 tracking-wide">Community Reviews</h3>
                            
                            {user ? (
                                <form onSubmit={submitReview} className="bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 mb-10 shadow-lg">
                                    <h4 className="text-lg font-bold text-orange-400 mb-6 uppercase tracking-widest">Share your experience</h4>
                                    {reviewMessage && <div className="mb-4 p-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-sm font-bold">{reviewMessage}</div>}
                                    <div className="mb-6">
                                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Rating</label>
                                        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full md:w-48 px-4 py-3 bg-slate-900/80 border border-white/10 rounded-xl text-amber-400 font-bold focus:outline-none focus:border-orange-500/50">
                                            <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option><option value={4}>⭐⭐⭐⭐ (4/5)</option><option value={3}>⭐⭐⭐ (3/5)</option><option value={2}>⭐⭐ (2/5)</option><option value={1}>⭐ (1/5)</option>
                                        </select>
                                    </div>
                                    <div className="mb-6">
                                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">Your Thoughts</label>
                                        <textarea value={comment} onChange={(e) => setComment(e.target.value)} required rows="3" placeholder="Write about the peace, architecture..." className="w-full px-4 py-3 bg-slate-900/80 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 resize-none"></textarea>
                                    </div>
                                    <button type="submit" className="px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)]">Post Review</button>
                                </form>
                            ) : (
                                <div className="bg-orange-900/20 p-8 rounded-2xl text-center mb-10">
                                    <p className="text-slate-400 mb-6">Please log in to share your spiritual experience.</p>
                                    <button onClick={() => navigate('/login')} className="px-8 py-3 bg-white/10 hover:bg-orange-500/20 text-white font-bold rounded-xl border border-white/20 hover:border-orange-500/50">Login to Review</button>
                                </div>
                            )}

                            <div className="space-y-6">
                                {temple.reviews && temple.reviews.length > 0 ? temple.reviews.map((rev, index) => (
                                    <div key={index} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                                        <h5 className="font-bold text-white text-lg capitalize">{rev.name} <span className="text-amber-400 text-sm ml-2">{"★".repeat(rev.rating)}</span></h5>
                                        <p className="text-slate-300 italic mt-2">"{rev.comment}"</p>
                                    </div>
                                )) : <p className="text-slate-400 text-center">No reviews yet. Be the first!</p>}
                            </div>
                        </div>
```

Aap bas is code ko copy karke `AdminDashboard.jsx` mein paste karein aur Admin panel khol kar dekhein! Wahan apko Tab wala layout dikhega!
