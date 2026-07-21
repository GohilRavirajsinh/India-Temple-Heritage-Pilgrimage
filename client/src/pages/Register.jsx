import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });

            if (res.data.success) {
                setMessage('Registration Successful! Redirecting...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setMessage(err.res?.data?.message || 'Registration Failed');
        }
    }

    return (
        <div 
            className="min-h-screen bg-slate-900 flex items-center justify-center px-4 font-sans relative"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?auto=format&fit=crop&w=1920&q=80')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90 z-0 pointer-events-none"></div>

            <div className='relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl p-10 border border-white/20 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.6)] mt-20 md:mt-0'>
                
                <div className="text-center mb-8">
                    <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-3">Join The Community</span>
                    <h2 className='text-3xl font-extrabold text-white tracking-tight'>Create Account</h2>
                </div>

                {message && (
                    <div className={`text-center text-sm font-bold py-3 rounded-lg mb-6 ${message.includes('Success') ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-5'>
                    <div>
                        <label className='block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2'>Full Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all" 
                            placeholder="John Doe"
                            required 
                        />
                    </div>

                    <div>
                        <label className='block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2'>Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all" 
                            placeholder="you@example.com"
                            required 
                        />
                    </div>

                    <div>
                        <label className='block text-xs font-bold text-slate-300 uppercase tracking-widest mb-2'>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all" 
                            placeholder="••••••••"
                            required 
                        />
                    </div>

                    <button 
                        type='submit' 
                        className='w-full py-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] transition-all duration-300 tracking-wide mt-2'
                    >
                        Sign Up Now
                    </button>
                </form>

                <p className='mt-8 text-sm text-center text-slate-400'>
                    Already have an account?{' '}
                    <span onClick={() => navigate('/login')} className='text-orange-400 font-bold cursor-pointer hover:text-orange-300 transition-colors border-b border-transparent hover:border-orange-300'>
                        Login here
                    </span>
                </p>
            </div>
        </div>
    )
}

export default Register;