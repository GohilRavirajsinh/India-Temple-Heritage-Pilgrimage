import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 font-sans text-center">
            <div className="animate-float mb-6">
                <span className="text-8xl">🛕</span>
            </div>
            <h1 className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200 mb-4">
                404
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                This Path Leads Nowhere
            </h2>
            <p className="text-slate-400 max-w-md mb-10 leading-relaxed">
                The sacred page you seek has not been found. Perhaps the divine has redirected your journey elsewhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => navigate('/')}
                    className="px-8 py-3.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all hover:scale-105"
                >
                    Return Home
                </button>
                <button
                    onClick={() => navigate('/temples')}
                    className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/30 text-white font-bold rounded-full transition-all"
                >
                    Browse Temples
                </button>
            </div>
        </div>
    );
};

export default NotFound;
