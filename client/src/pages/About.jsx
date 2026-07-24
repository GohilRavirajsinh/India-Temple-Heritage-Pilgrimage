import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    const howItWorks = [
        {
            icon: '📝',
            step: '01',
            title: 'Register / Login',
            desc: 'Create a free account or login to unlock saving and sharing features. Guest users can still browse and explore all temple information without an account.'
        },
        {
            icon: '🔍',
            step: '02',
            title: 'Search & Filter',
            desc: 'Search temples by name, deity, or city using the search bar. Use state filter chips to instantly narrow down temples by location across India.'
        },
        {
            icon: '📜',
            step: '03',
            title: 'Explore Details',
            desc: 'View complete temple profiles — darshan timings, dress code, historical significance, rituals & pooja, festivals celebrated, and nearby facilities.'
        },
        {
            icon: '🔖',
            step: '04',
            title: 'Save Temples',
            desc: 'Logged-in devotees can bookmark any temple with one click. All saved temples appear in your Profile dashboard under the "Saved Temples" tab for quick access.'
        },
        {
            icon: '🔗',
            step: '05',
            title: 'Share Anywhere',
            desc: 'Share any temple page directly via WhatsApp, Telegram, or any app. On mobile, the native share sheet opens automatically. On desktop, the link is copied to clipboard.'
        },
    ];

    const features = [
        { icon: '🏛️', title: 'Temple Directory', desc: 'Centralized database of temples from across India with verified information.' },
        { icon: '🗺️', title: 'Location Based', desc: 'Filter temples by state and city to find shrines near your pilgrimage destination.' },
        { icon: '🕐', title: 'Darshan Timings', desc: 'Accurate and up-to-date darshan timings for every listed temple.' },
        { icon: '🎉', title: 'Festivals Info', desc: 'Know which festivals are celebrated at each temple before you plan your visit.' },
        { icon: '👗', title: 'Dress Code', desc: 'Understand dress code requirements and guidelines for respectful visits.' },
        { icon: '🏨', title: 'Nearby Facilities', desc: 'Information on hotels, parking, ATMs, and other facilities near each temple.' },
        { icon: '🔐', title: 'Secure Auth', desc: 'JWT-based authentication keeps your account and saved temples data safe.' },
        { icon: '⚙️', title: 'Admin Control', desc: 'Admins can add, edit, delete temples and manage users from a dedicated portal.' },
    ];

    return (
        <div className="min-h-screen bg-slate-900 font-sans pt-24 pb-16">

            {/* ─── HERO BANNER ─── */}
            <div className="text-center px-6 py-16 max-w-4xl mx-auto">
                <span className="inline-block py-1.5 px-5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold tracking-widest uppercase mb-6">
                    🛕 About This Portal
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                    India Temple Heritage
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
                        & Pilgrimage Portal
                    </span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
                    A centralized digital portal providing comprehensive information about temples across India —
                    including historical significance, rituals, festivals, darshan timings, and visitor guidelines.
                    Built to support pilgrims, tourists, and researchers with reliable, well-organized information.
                </p>
            </div>

            {/* ─── DIVIDER ─── */}
            <div className="max-w-4xl mx-auto px-6">
                <hr className="heritage-divider" />
            </div>

            {/* ─── PROBLEM WE SOLVE ─── */}
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">Why This Exists</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Problem</span> We Solve
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { icon: '😔', problem: 'Difficulty finding authentic and complete temple information online.' },
                        { icon: '⏰', problem: 'No single source for accurate darshan timings, rituals, and dress codes.' },
                        { icon: '🗺️', problem: 'Poor visibility of pilgrimage routes and nearby visitor facilities.' },
                        { icon: '🔎', problem: 'Absence of a centralized, trusted digital information source for temples.' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-6">
                            <span className="text-3xl flex-shrink-0">{item.icon}</span>
                            <p className="text-slate-300 leading-relaxed">{item.problem}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── HOW IT WORKS ─── */}
            <div className="py-16 px-6 bg-white/[0.02] border-y border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">Simple Steps</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">
                            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Works</span>
                        </h2>
                        <p className="text-slate-400 mt-3 text-sm">From registering to sharing — the complete user journey</p>
                    </div>
                    <div className="flex flex-col gap-6">
                        {howItWorks.map((step, i) => (
                            <div key={i} className="flex flex-col sm:flex-row items-start gap-5 bg-white/5 border border-white/10 hover:border-orange-500/30 rounded-2xl p-6 transition-all group hover:bg-white/[0.07]">
                                {/* Step Number */}
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 font-extrabold flex items-center justify-center text-sm tracking-widest">
                                    {step.step}
                                </div>
                                {/* Icon */}
                                <span className="text-4xl flex-shrink-0 hidden sm:block">{step.icon}</span>
                                {/* Text */}
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                        <span className="sm:hidden">{step.icon}</span>
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── FEATURES GRID ─── */}
            <div className="py-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">What's Inside</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">
                            Key <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Features</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 hover:border-orange-500/30 rounded-2xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                                <span className="text-4xl block mb-3">{f.icon}</span>
                                <h4 className="text-white font-bold mb-2">{f.title}</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── TECH STACK ─── */}
            <div className="py-16 px-6 bg-white/[0.02] border-y border-white/5">
                <div className="max-w-3xl mx-auto text-center">
                    <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">Built With</span>
                    <h2 className="text-3xl font-extrabold text-white mt-2 mb-10">
                        Tech <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Stack</span>
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            // Frontend Core
                            { label: 'React.js', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
                            { label: 'React Router DOM', color: 'bg-red-500/10 border-red-500/30 text-red-400' },
                            { label: 'Tailwind CSS', color: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' },
                            { label: 'Axios', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
                            { label: 'Vite', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
                            // Backend Core
                            { label: 'Node.js', color: 'bg-green-500/10 border-green-500/30 text-green-400' },
                            { label: 'Express.js', color: 'bg-slate-500/10 border-slate-400/30 text-slate-300' },
                            { label: 'MongoDB', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
                            { label: 'Mongoose', color: 'bg-red-600/10 border-red-600/30 text-red-500' },
                            // Auth & Security
                            { label: 'JWT Auth (jsonwebtoken)', color: 'bg-pink-500/10 border-pink-500/30 text-pink-400' },
                            { label: 'Bcrypt.js', color: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' },
                            { label: 'CORS', color: 'bg-teal-500/10 border-teal-500/30 text-teal-400' },
                            // Utilities
                            { label: 'Multer (File Uploads)', color: 'bg-orange-500/10 border-orange-500/30 text-orange-400' },
                            { label: 'Dotenv', color: 'bg-lime-500/10 border-lime-500/30 text-lime-400' },
                            { label: 'Nodemon', color: 'bg-green-600/10 border-green-600/30 text-green-500' },
                        ].map((tech, i) => (
                            <span key={i} className={`px-5 py-2 rounded-full border font-bold text-sm ${tech.color}`}>
                                {tech.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── CTA ─── */}
            <div className="py-10 px-6 text-center">
                <button
                    onClick={() => navigate('/temples')}
                    className="px-10 py-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold rounded-full shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:scale-105 transition-all text-lg"
                >
                    🛕 Start Exploring Temples
                </button>
            </div>

        </div>
    );
};

export default About;
