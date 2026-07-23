import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-950 border-t border-white/5 font-sans">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-3xl">🛕</span>
                            <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200 tracking-widest uppercase">
                                Temple Heritage
                            </h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            India's premier digital pilgrimage portal. Discover the divine architecture, sacred history, and spiritual essence of ancient temples across India.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-5 flex items-center gap-2">
                            <span className="w-4 h-px bg-orange-500 block"></span>
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Home', path: '/' },
                                { label: 'Browse Temples', path: '/temples' },
                                { label: 'Login', path: '/login' },
                                { label: 'Register', path: '/register' },
                            ].map((link) => (
                                <li key={link.path}>
                                    <button
                                        onClick={() => navigate(link.path)}
                                        className="text-slate-400 hover:text-orange-400 text-sm transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="text-orange-500/50 group-hover:text-orange-500 transition-colors">›</span>
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-5 flex items-center gap-2">
                            <span className="w-4 h-px bg-orange-500 block"></span>
                            About Project
                        </h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">🏛️</span> MERN Stack Application</li>
                            <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">🔐</span> JWT Authentication</li>
                            <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">🌟</span> Community Reviews System</li>
                            <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">⚙️</span> Admin Management Portal</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">
                        © {currentYear} India Temple Heritage & Pilgrimage Portal. All rights reserved.
                    </p>
                    <p className="text-slate-600 text-xs">
                        Built with <span className="text-orange-500">❤️</span> using MERN Stack
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
