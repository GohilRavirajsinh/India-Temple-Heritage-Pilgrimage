import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();

    const { user, logout } = useContext(AuthContext); // Store se 'user' aur 'logout' function nikala

    return (
        <nav className="flex justify-between items-center px-8 py-4 bg-slate-800 text-white shadow-md">

            <h2 className='text-xl font-bold cursor-pointer tracking-wide' onClick={() => navigate('/')}>ॐ Temple Heritage 🛕</h2>

            <div className='flex items-center gap-6'>
                <button
                    onClick={() => navigate('/')}
                >
                    Home
                </button>

                {user ? (
                    // Agar token hai, toh automatic Logout aur Role dikhega
                    <div className="flex items-center gap-4">
                        <span className="bg-slate-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-400">
                            {user.role || 'User'}
                        </span>
                        <button
                            onClick={logout}
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
                            onClick={() => navigate('/register')}
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