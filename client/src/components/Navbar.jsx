import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    const handleMobileNavigate = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    return (
        <nav className={`
            fixed top-0 w-full z-50 flex flex-col px-4 sm:px-6 md:px-10 py-3 sm:py-4
            bg-black/40 backdrop-blur-md text-white
            border-b border-white/10
            transition-all duration-300
            ${scrolled || mobileMenuOpen ? 'shadow-[0_4px_20px_rgba(0,0,0,0.4)] bg-black/70' : ''}
        `}>
            {/* Top Bar (Always visible) */}
            <div className="flex justify-between items-center w-full">
                
                {/* Left Side: Logo + Profile */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Logo & Title */}
                    <div
                        onClick={() => navigate('/')}
                        className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group"
                    >
                        <span className="text-2xl md:text-3xl drop-shadow-[0_0_8px_rgba(123,30,58,0.4)] transition-transform group-hover:scale-110">
                            🛕
                        </span>
                        <h2 className="text-sm md:text-xl font-bold tracking-widest uppercase font-serif-display"
                            style={{ color: '#f97316' }}>
                            Temple <span className="hidden sm:inline">Heritage</span>
                        </h2>
                    </div>

                    {/* Mobile Profile Avatar & Name (Left side only on Mobile) */}
                    {user && (
                        <button onClick={() => navigate('/profile')}
                            className="flex md:hidden items-center gap-2 hover:opacity-80 transition-opacity pl-2 sm:pl-4 border-l border-white/10">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs uppercase bg-[#7B1E3A] text-[#F5E6B8] ring-1 ring-[#C89030] shadow-md flex-shrink-0">
                                {(user.name || user.role || '?').charAt(0)}
                            </div>
                            <div className="flex flex-col text-left hidden min-[350px]:flex">
                                <span className="text-[9px] text-slate-400 uppercase tracking-widest leading-tight">Welcome</span>
                                <span className="text-xs font-bold text-amber-200 capitalize leading-tight">{user.name || user.role}</span>
                            </div>
                        </button>
                    )}
                </div>

                {/* Right Side: Desktop Links & Mobile Hamburger */}
                <div className="flex items-center gap-4 md:gap-7">
                    
                    {/* Hamburger Icon (Mobile Only) */}
                    <button 
                        className="md:hidden text-2xl text-slate-200 hover:text-orange-400 transition-colors focus:outline-none"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>

                    {/* Desktop Links (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center gap-7">
                        <button onClick={() => navigate('/')} className={`text-sm font-semibold tracking-wider uppercase transition-colors relative pb-0.5 ${isActive('/') ? 'text-orange-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-400 after:rounded-full' : 'text-slate-300 hover:text-orange-400'}`}>Home</button>
                        <button onClick={() => navigate('/temples')} className={`text-sm font-semibold tracking-wider uppercase transition-colors relative pb-0.5 ${isActive('/temples') ? 'text-orange-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-400 after:rounded-full' : 'text-slate-300 hover:text-orange-400'}`}>Browse</button>
                        <button onClick={() => navigate('/about')} className={`text-sm font-semibold tracking-wider uppercase transition-colors relative pb-0.5 ${isActive('/about') ? 'text-orange-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-400 after:rounded-full' : 'text-slate-300 hover:text-orange-400'}`}>About</button>

                        <div className="w-px h-5 bg-white/20"></div>

                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.role === 'admin' && (
                                    <button onClick={() => navigate('/admin-dashboard')} className="px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/50 hover:bg-orange-500 hover:text-white font-semibold rounded-lg transition-all text-xs uppercase tracking-widest">Admin</button>
                                )}
                                <button onClick={() => navigate('/profile')} className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm uppercase bg-[#7B1E3A] text-[#F5E6B8] ring-2 ring-transparent group-hover:ring-[#C89030] group-hover:ring-offset-1 transition-all duration-200 shadow-md flex-shrink-0">
                                        {(user.name || user.role || '?').charAt(0)}
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-xs text-slate-400 uppercase tracking-widest">Welcome,</span>
                                        <span className="text-sm font-bold text-amber-200 capitalize">{user.name || user.role}</span>
                                    </div>
                                </button>
                                <button onClick={() => { logout(); navigate('/'); }} className="px-5 py-2 bg-white/10 hover:bg-red-500/20 border border-transparent hover:border-red-500/50 text-white hover:text-red-400 font-semibold rounded-xl transition-all text-xs uppercase tracking-widest">Logout</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors uppercase tracking-wider block">Login</button>
                                <button onClick={() => navigate('/register')} className="px-5 py-2.5 bg-[#7B1E3A] hover:bg-[#9A2448] text-white text-xs font-semibold uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_14px_rgba(123,30,58,0.3)] hover:shadow-[0_6px_20px_rgba(123,30,58,0.4)] hover:-translate-y-0.5">Sign Up</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="md:hidden flex flex-col mt-4 pt-4 border-t border-white/10 gap-5 pb-3">
                    <button onClick={() => handleMobileNavigate('/')} className={`text-left text-sm font-semibold tracking-wider uppercase transition-colors pl-2 ${isActive('/') ? 'text-orange-400' : 'text-slate-300 hover:text-orange-400'}`}>Home</button>
                    <button onClick={() => handleMobileNavigate('/temples')} className={`text-left text-sm font-semibold tracking-wider uppercase transition-colors pl-2 ${isActive('/temples') ? 'text-orange-400' : 'text-slate-300 hover:text-orange-400'}`}>Browse</button>
                    <button onClick={() => handleMobileNavigate('/about')} className={`text-left text-sm font-semibold tracking-wider uppercase transition-colors pl-2 ${isActive('/about') ? 'text-orange-400' : 'text-slate-300 hover:text-orange-400'}`}>About</button>

                    {user ? (
                        <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-white/5">
                            {user.role === 'admin' && (
                                <button onClick={() => handleMobileNavigate('/admin-dashboard')} className="w-full px-4 py-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg text-xs font-bold uppercase tracking-widest text-left transition-colors">Admin Portal</button>
                            )}
                            <button onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }} className="w-full px-4 py-3 bg-white/5 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold uppercase tracking-widest text-left transition-colors">Logout</button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-white/5">
                            <button onClick={() => handleMobileNavigate('/login')} className="text-left pl-2 text-sm font-semibold text-slate-300 hover:text-white uppercase tracking-wider transition-colors">Login</button>
                            <button onClick={() => handleMobileNavigate('/register')} className="w-full mt-2 px-5 py-3 bg-[#7B1E3A] hover:bg-[#9A2448] text-white text-xs font-semibold uppercase tracking-widest rounded-lg text-center shadow-md transition-colors">Sign Up</button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;