import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { user, logout } = useContext(AuthContext); // Store se 'user' aur 'logout' function nikala

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-black/40 backdrop-blur-md text-white border-b border-white/10">

            {/* Logo */}
            <div
                onClick={() => navigate('/')}
                className='flex items-center gap-2 cursor-pointer group'
            >

                <span className="text-2xl md:text-3xl drop-shadow-[0_0_10px_rgba(249,115,22,0.8)] transition-transform group-hover:scale-110">🛕</span>
                <h2 className='text-lg md:text-xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200 uppercase hidden sm:block'>
                    Temple Heritage
                </h2>
            </div>

            {/* Links & Buttons */}
            <div className='flex items-center gap-4 md:gap-8'>
                <button
                    onClick={() => navigate('/')}
                    className={`text-sm font-bold tracking-wider uppercase transition-colors hover:text-orange-400 ${isActive('/') ? 'text-orange-400' : 'text-slate-300'}`}
                >
                    Home
                </button>

                <button
                    onClick={() => navigate('/temples')}
                    className={`text-sm font-bold tracking-wider uppercase transition-colors hover:text-orange-400 ${isActive('/temples') ? 'text-orange-400' : 'text-slate-300'}`}
                >
                    Browse
                </button>

                {/* Vertical Line Separator */}
                <div className="w-px h-6 bg-white/20 hidden md:block"></div>

                {user ? (
                    // 🌟 LOGGED IN USER KE LIYE UI 🌟
                    <div className="flex items-center gap-4">
                        {/* Agar Admin hai toh extra button dikhao */}
                        {user.role === 'admin' && (
                            <button
                                onClick={() => navigate('/admin-dashboard')}
                                className="px-4 py-2 hidden md:block bg-orange-500/20 text-orange-400 border border-orange-500/50 hover:bg-orange-500 hover:text-white font-bold rounded-lg transition-all shadow-[0_0_10px_rgba(249,115,22,0.2)] text-xs uppercase tracking-widest"
                            >
                                Admin Portal
                            </button>
                        )}

                        <button onClick={() => navigate('/profile')}
                            className="hidden sm:flex flex-col text-right hover:opacity-80 transition-opacity">
                            <span className="text-xs text-slate-400 uppercase tracking-widest">Welcome,</span>
                            <span className="text-sm font-bold text-amber-200 capitalize">{user.name || user.role}</span>
                        </button>

                        <button
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                            className="px-5 py-2 md:px-6 md:py-2.5 bg-white/10 hover:bg-red-500/20 border border-transparent hover:border-red-500/50 text-white hover:text-red-400 font-bold rounded-xl transition-all text-xs uppercase tracking-widest"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    // 🌟 GUEST USER (LOGGED OUT) KE LIYE UI 🌟
                    <div className='flex items-center gap-3 md:gap-4'>
                        <button
                            onClick={() => navigate('/login')}
                            className='px-5 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wider hidden sm:block'
                        >
                            Login
                        </button>

                        <button
                            onClick={() => navigate('/register')}
                            className='px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all'
                        >
                            Sign Up
                        </button>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar;