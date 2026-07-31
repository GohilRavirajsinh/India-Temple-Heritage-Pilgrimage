import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`
            fixed top-0 w-full z-50 flex justify-between items-center px-3 sm:px-6 md:px-10 py-3 sm:py-4
            bg-black/40 backdrop-blur-md text-white
            border-b border-white/10
            transition-shadow duration-300
            ${scrolled ? 'shadow-[0_4px_20px_rgba(0,0,0,0.4)]' : ''}
        `}>
            {/* Left Side: Profile (Mobile) + Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile Profile Avatar (Left Side Only on Mobile) */}
                {user && (
                    <button onClick={() => navigate('/profile')}
                        className="flex sm:hidden items-center justify-center w-8 h-8 rounded-full font-bold text-xs uppercase bg-[#7B1E3A] text-[#F5E6B8] ring-1 ring-[#C89030] shadow-md flex-shrink-0">
                        {(user.name || user.role || '?').charAt(0)}
                    </button>
                )}

                {/* Logo */}
                <div
                    onClick={() => navigate('/')}
                    className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group"
                >
                    <span className="text-xl sm:text-2xl md:text-3xl drop-shadow-[0_0_8px_rgba(123,30,58,0.4)] transition-transform group-hover:scale-110">
                        🛕
                    </span>
                    <h2 className="text-[13px] sm:text-lg md:text-xl font-bold tracking-widest uppercase hidden min-[400px]:block font-serif-display"
                        style={{ color: '#f97316' }}>
                        Temple <span className="hidden sm:inline">Heritage</span>
                    </h2>
                </div>
            </div>

            {/* Right Side: Links & Buttons */}
            <div className="flex items-center gap-2 sm:gap-4 md:gap-7">
                <button
                    onClick={() => navigate('/')}
                    className={`text-[10px] sm:text-sm font-semibold tracking-wider uppercase transition-colors relative pb-0.5
                        ${isActive('/')
                            ? 'text-orange-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-400 after:rounded-full'
                            : 'text-slate-300 hover:text-orange-400'
                        }`}
                >
                    Home
                </button>

                <button
                    onClick={() => navigate('/temples')}
                    className={`text-[10px] sm:text-sm font-semibold tracking-wider uppercase transition-colors relative pb-0.5
                        ${isActive('/temples')
                            ? 'text-orange-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-400 after:rounded-full'
                            : 'text-slate-300 hover:text-orange-400'
                        }`}
                >
                    Browse
                </button>

                <button
                    onClick={() => navigate('/about')}
                    className={`text-[10px] sm:text-sm font-semibold tracking-wider uppercase transition-colors relative pb-0.5 hidden min-[350px]:block
                        ${isActive('/about')
                            ? 'text-orange-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-400 after:rounded-full'
                            : 'text-slate-300 hover:text-orange-400'
                        }`}
                >
                    About
                </button>

                {/* Divider */}
                <div className="w-px h-5 bg-white/20 hidden md:block"></div>

                {user ? (
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        {user.role === 'admin' && (
                            <button
                                onClick={() => navigate('/admin-dashboard')}
                                className="px-2 py-1.5 sm:px-4 sm:py-2 hidden md:block bg-orange-500/20 text-orange-400 border border-orange-500/50 hover:bg-orange-500 hover:text-white font-semibold rounded-lg transition-all text-[10px] sm:text-xs uppercase tracking-widest"
                            >
                                Admin
                            </button>
                        )}

                        {/* Desktop Profile Avatar (Hidden on Mobile) */}
                        <button onClick={() => navigate('/profile')}
                            className="hidden sm:flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity group">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm uppercase
                                            bg-[#7B1E3A] text-[#F5E6B8]
                                            ring-2 ring-transparent group-hover:ring-[#C89030] group-hover:ring-offset-1
                                            transition-all duration-200 shadow-md flex-shrink-0">
                                {(user.name || user.role || '?').charAt(0)}
                            </div>
                            <div className="hidden sm:flex flex-col text-left">
                                <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest">Welcome,</span>
                                <span className="text-xs sm:text-sm font-bold text-amber-200 capitalize">{user.name || user.role}</span>
                            </div>
                        </button>

                        <button
                            onClick={() => { logout(); navigate('/'); }}
                            className="px-2 py-1.5 sm:px-4 sm:py-2 md:px-5 bg-white/10 hover:bg-red-500/20 border border-transparent hover:border-red-500/50 text-white hover:text-red-400 font-semibold rounded-lg transition-all text-[10px] sm:text-xs uppercase tracking-widest"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 sm:gap-3 md:gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-1.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors uppercase tracking-wider block"
                        >
                            Login
                        </button>

                        <button
                            onClick={() => navigate('/register')}
                            className="px-2 py-1.5 sm:px-5 sm:py-2.5 bg-[#7B1E3A] hover:bg-[#9A2448] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-widest rounded-lg sm:rounded-xl transition-all shadow-[0_4px_14px_rgba(123,30,58,0.3)] hover:shadow-[0_6px_20px_rgba(123,30,58,0.4)] hover:-translate-y-0.5"
                        >
                            Sign Up
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;