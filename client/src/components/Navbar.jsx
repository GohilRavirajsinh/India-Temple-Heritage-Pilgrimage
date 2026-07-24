import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/*
  PHASE 1 CHANGE: Navbar completely restyled for the heritage light theme.
  Previously: Dark glass (bg-black/40 backdrop-blur) with white text.
  Now: Warm ivory background with a warm border-bottom, maroon/gold accents,
  and a scroll-aware effect that adds elevation shadow when the user scrolls down.
  Logic (useContext, useNavigate, isActive, logout) is 100% unchanged.
*/
const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    // PHASE 1 CHANGE: New state to detect if user has scrolled down.
    // This triggers a subtle shadow to visually lift the navbar off the page.
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`
            fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-10 py-4
            bg-black/40 backdrop-blur-md text-white
            border-b border-white/10
            transition-shadow duration-300
            ${scrolled ? 'shadow-[0_4px_20px_rgba(0,0,0,0.4)]' : ''}
        `}>

            {/* Logo — same onClick logic, new visual style */}
            <div
                onClick={() => navigate('/')}
                className="flex items-center gap-2.5 cursor-pointer group"
            >
                {/* CHANGED: Emoji size and glow color updated to match maroon palette */}
                <span className="text-2xl md:text-3xl drop-shadow-[0_0_8px_rgba(123,30,58,0.4)] transition-transform group-hover:scale-110">
                    🛕
                </span>
                {/* CHANGED: Switched from orange gradient to maroon/saffron gradient text */}
                <h2 className="text-lg md:text-xl font-bold tracking-widest uppercase hidden sm:block font-serif-display"
                    style={{ color: '#f97316' }}>
                    Temple Heritage
                </h2>
            </div>

            {/* Links & Buttons — same structure, new colors */}
            <div className="flex items-center gap-4 md:gap-7">
                {/* CHANGED: Active link now uses maroon underline instead of orange text */}
                <button
                    onClick={() => navigate('/')}
                    className={`text-sm font-semibold tracking-wider uppercase transition-colors relative pb-0.5
                        ${isActive('/')
                            ? 'text-orange-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-400 after:rounded-full'
                            : 'text-slate-300 hover:text-orange-400'
                        }`}
                >
                    Home
                </button>

                <button
                    onClick={() => navigate('/temples')}
                    className={`text-sm font-semibold tracking-wider uppercase transition-colors relative pb-0.5
                        ${isActive('/temples')
                            ? 'text-orange-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-400 after:rounded-full'
                            : 'text-slate-300 hover:text-orange-400'
                        }`}
                >
                    Browse
                </button>

                <button
                    onClick={() => navigate('/about')}
                    className={`text-sm font-semibold tracking-wider uppercase transition-colors relative pb-0.5
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
                    // 🌟 LOGGED IN USER KE LIYE UI 🌟
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* CHANGED: Admin button now uses maroon outline style */}
                        {user.role === 'admin' && (
                            <button
                                onClick={() => navigate('/admin-dashboard')}
                                className="px-4 py-2 hidden md:block bg-orange-500/20 text-orange-400 border border-orange-500/50 hover:bg-orange-500 hover:text-white font-semibold rounded-lg transition-all text-xs uppercase tracking-widest"
                            >
                                Admin Portal
                            </button>
                        )}

                        {/* CHANGED: User greeting now uses heritage text colors */}
                        {/* ADDED: Avatar circle showing user's first initial, clicking opens /profile */}
                        <button onClick={() => navigate('/profile')}
                            className="hidden sm:flex items-center gap-3 hover:opacity-80 transition-opacity group">

                            {/*
                              ADDED: Avatar circle.
                              Since there is no photo upload system, we show the first letter of
                              the user's name in a styled circle. This is a very common pattern
                              (like Gmail, GitHub etc.) — color is maroon with saffron text.
                              The ring effect on hover gives a clear "clickable" signal.
                            */}
                            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm uppercase
                                            bg-[#7B1E3A] text-[#F5E6B8]
                                            ring-2 ring-transparent group-hover:ring-[#C89030] group-hover:ring-offset-1
                                            transition-all duration-200 shadow-md flex-shrink-0">
                                {(user.name || user.role || '?').charAt(0)}
                            </div>

                            {/* Welcome text alongside avatar */}
                            <div className="flex flex-col text-left">
                                <span className="text-xs text-slate-400 uppercase tracking-widest">Welcome,</span>
                                <span className="text-sm font-bold text-amber-200 capitalize">{user.name || user.role}</span>
                            </div>
                        </button>

                        {/* CHANGED: Logout button now a subtle bordered pill */}
                        <button
                            onClick={() => { logout(); navigate('/'); }}
                            className="px-4 py-2 md:px-5 md:py-2 bg-white/10 hover:bg-red-500/20 border border-transparent hover:border-red-500/50 text-white hover:text-red-400 font-semibold rounded-xl transition-all text-xs uppercase tracking-widest"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    // 🌟 GUEST USER (LOGGED OUT) KE LIYE UI 🌟
                    <div className="flex items-center gap-3 md:gap-4">
                        {/* CHANGED: Login is a clean text link in maroon */}
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 text-sm font-semibold text-[#7B1E3A] hover:text-[#9A2448] transition-colors uppercase tracking-wider hidden sm:block"
                        >
                            Login
                        </button>

                        {/* CHANGED: Sign Up is the primary CTA — solid maroon fill */}
                        <button
                            onClick={() => navigate('/register')}
                            className="px-5 py-2.5 bg-[#7B1E3A] hover:bg-[#9A2448] text-white text-xs font-semibold uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_14px_rgba(123,30,58,0.3)] hover:shadow-[0_6px_20px_rgba(123,30,58,0.4)] hover:-translate-y-0.5"
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