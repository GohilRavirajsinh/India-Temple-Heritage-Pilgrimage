import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email: email, password: password
            });

            if (res.data.success) {
                localStorage.setItem('token', res.data.token); // ise data broser me store rhega or user refresh krta hai to vo login rhega
                localStorage.setItem('role', res.data.role);
                setMessage('Login Succesfull');

                const userRole = res.data.role;
                setTimeout(() => {
                    if (userRole === 'admin') {
                        navigate('/admin-dashboard'); // Admin shidha dashboard par jayega jab login krega
                    } else {
                        navigate('/'); // User sidha Home page par jayega
                    }
                }, 1000)
            }
        } catch (err) {
            setMessage(err.res?.data?.message || 'Login Failed');
        }
    }

    return (
        <div>
            <div className='min-h-screen bg-slate-50 flex items-center justify-center px-4'>
                <div className='container max-w-md w-full bg-white p-8 border border-slate-500-100 rounded-lg'>
                    <h2 className='text-2xl font-bold text-center text-slate-800 mb-6'>Login Account</h2>

                    {message && <p className='text-center text-sm font-medium text-red-600 mb-4'>{message}</p>}

                    <form onSubmit={handleSubmit} className='space-y-4'>

                        {/* For email */}
                        <div>
                            <label className='block text-sm font-medium text-slate-700'>Email</label>

                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
                        </div>

                        {/* For password */}
                        <div>
                            <label className='block text-sm font-medium text-slate-700'>Password</label>

                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
                        </div>

                        {/* For Login button */}
                        <button type='submit' className='w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow transition-colors cursor-pointer'>
                            Login
                        </button>

                    </form>

                    {/* For Already have an account? */}
                    <p className='mt-6 text-sm text-center text-slate-600'>
                        Already have an account?{' '}
                        <span onClick={() => navigate('/login')} className='text-blue-600 font-medium cursor-pointer hover:underline'>
                            Login here
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login