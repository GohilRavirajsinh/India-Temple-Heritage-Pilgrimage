import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    // Sample images for the marquee (using high quality unsplash temple images)
    const marqueeImages = [
        "https://images.unsplash.com/photo-1514222020963-31fdf792878d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1602643163983-ed0babc39797?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
    ];

    return (
        <div className="min-h-screen bg-slate-900 overflow-hidden font-sans">
            
            {/* HERO SECTION WITH DWARKADHISH BACKGROUND */}
            <div 
                className="relative h-screen flex flex-col items-center justify-center"
                style={{
                    backgroundImage: "url('https://inditales.com/wp-content/uploads/2018/04/dwarkadhish-temple.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                {/* Adjustable Opacity Overlay (Black to Slate gradient) */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-slate-900 z-0 pointer-events-none"></div>

                {/* Main Content */}
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                    <span className="inline-block py-1 px-4 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-sm shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                        Discover The Divine
                    </span>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight drop-shadow-2xl">
                        India Temple Heritage <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
                            & Pilgrimage Portal
                        </span>
                    </h1>
                    
                    <p className="mt-8 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
                        Explore historical shrines, accurate darshan timings, and ancient history with a dynamic, immersive experience.
                    </p>

                    <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
                        <button 
                            onClick={() => navigate('/temples')}
                            className="px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] hover:scale-105 transition-all duration-300 relative z-20 pointer-events-auto"
                        >
                            Explore Temples
                        </button>
                    </div>
                </div>
            </div>

            {/* SCROLLING MARQUEE SECTION (MOVED BELOW HERO) */}
            <div className="w-full bg-slate-900 py-16 overflow-hidden border-t border-white/5">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                        Glimpse of <span className="text-orange-400">Divinity</span>
                    </h2>
                </div>
                <div className="animate-marquee flex gap-6 px-3">
                    {/* Render array twice for seamless infinite scroll */}
                    {[...marqueeImages, ...marqueeImages].map((img, index) => (
                        <div key={index} className="flex-none w-64 h-40 md:w-80 md:h-48 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10 group">
                            <img 
                                src={img} 
                                alt="Temple" 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                            />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Home;