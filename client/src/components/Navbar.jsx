import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // ye track krega use kab page badal rha hai.

    // State banayi taaki token badalte hi navbar automatic re-render ho jaye
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));

    // useEffect
    useEffect (() => {
        setToken(localStorage.getItem('token'));
        setRole(localStorage.getItem('role'));
    }, [location])

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken(null); // state empty for change button fast
        setRole(null);
        navigate('/login');
    };

    return (
        <nav className="flex justify-between items-center px-8 py-4 bg-slate-800 text-white shadow-md">

            <h2 className='text-xl font-bold cursor-pointer tracking-wide' onClick={() => navigate('/')}>ॐ Temple Heritage 🛕</h2>

            <div className='flex items-center gap-6'>
                <button
                    onClick={() => navigate('/')}
                >
                    Home
                </button>

                {token ? (
                    // Agar token hai, toh automatic Logout aur Role dikhega
                    <div className="flex items-center gap-4">
                        <span className="bg-slate-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-400">
                            {role || 'User'}
                        </span>
                        <button 
                            onClick={handleLogout} 
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className='flex gap-3'>
                        <button
                            onClick={() => navigate('/login')}
                            className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors'
                        >Login
                        </button>

                        <button
                            onClick={() => navigate('/signIn')}
                            className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors'
                        >Sign In
                        </button>
                    </div>
                )}

            </div>
        </nav>
    )
}

export default Navbar