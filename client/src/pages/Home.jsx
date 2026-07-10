import React from 'react'
import Navbar from '../components/Navbar'

const Home = () => {
    return (
        <div className='min-h-screen bg-slate-50'>
            <Navbar />

            <div className='max-w-4xl mx-auto text-center mt-20 px-4'>
                <h1 className='text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight'>
                    Welcome to India Temple Heritage & <br />
                    <span className='text-blue-600'>Pilgrimage Portal</span>
                </h1>
                <p className='mt-6 text-lg md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed'>
                    Explore historical shrines, darshan timings, and ancient history with dynamic navigation and real-time management.
                </p>

                <div className='mt-10 flex justify-center gap-4'>
                    <button className='px-4 py-3 bg-amber-950 hover:bg-amber-700 text-white hover:text-black rounded-lg shadow transition-all cursor-pointer'>
                        Explore Temples
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Home