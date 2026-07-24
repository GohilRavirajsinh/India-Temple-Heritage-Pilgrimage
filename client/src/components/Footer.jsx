import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="font-sans" style={{ backgroundColor: '#1A0F0A' }}>
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-3xl">🛕</span>
                            <h3 className="text-xl font-bold font-serif-display tracking-widest uppercase"
                                style={{ color: '#C89030' }}>
                                Temple Heritage
                            </h3>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: '#A89070' }}>
                            India's premier digital pilgrimage portal. Discover the divine architecture,
                            sacred history, and spiritual essence of ancient temples across India.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-5 flex items-center gap-2"
                            style={{ color: '#C89030' }}>
                            <span className="w-4 h-px block" style={{ backgroundColor: '#C89030' }}></span>
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
                                        className="text-sm transition-colors flex items-center gap-2 group"
                                        style={{ color: '#A89070' }}
                                    >
                                        <span style={{ color: '#C89030' }}>›</span>
                                        <span className="group-hover:text-[#C89030] transition-colors">{link.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About Project */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-5 flex items-center gap-2"
                            style={{ color: '#C89030' }}>
                            <span className="w-4 h-px block" style={{ backgroundColor: '#C89030' }}></span>
                            About Project
                        </h4>
                        <ul className="space-y-3 text-sm" style={{ color: '#A89070' }}>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5" style={{ color: '#C89030' }}>🏛️</span>
                                MERN Stack Application
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5" style={{ color: '#C89030' }}>🔐</span>
                                JWT Authentication
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5" style={{ color: '#C89030' }}>🔖</span>
                                Save & Share Temples
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5" style={{ color: '#C89030' }}>⚙️</span>
                                Admin Management Portal
                            </li>
                        </ul>
                    </div>

                    {/* Developer Contact — NEW SECTION */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-5 flex items-center gap-2"
                            style={{ color: '#C89030' }}>
                            <span className="w-4 h-px block" style={{ backgroundColor: '#C89030' }}></span>
                            Developer
                        </h4>

                        {/* Name */}
                        <p className="text-base font-bold mb-4 font-serif-display" style={{ color: '#E8C87A' }}>
                            Ravirajsinh Gohil
                        </p>

                        <ul className="space-y-3 text-sm" style={{ color: '#A89070' }}>

                            {/* Phone */}
                            <li className="flex items-center gap-2">
                                <span style={{ color: '#C89030' }}>📞</span>
                                <a href="tel:+917284088382"
                                    className="hover:text-[#C89030] transition-colors">
                                    +91 72840 88382
                                </a>
                            </li>

                            {/* Instagram */}
                            <li className="flex items-center gap-2">
                                <span style={{ color: '#C89030' }}>📸</span>
                                <a href="https://www.instagram.com/ravirajsinhgohil._"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#C89030] transition-colors">
                                    @ravirajsinhgohil._
                                </a>
                            </li>

                            {/* LinkedIn */}
                            <li className="flex items-center gap-2">
                                <span style={{ color: '#C89030' }}>💼</span>
                                <a href="https://www.linkedin.com/in/ravirajsinh-gohil-empower"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#C89030] transition-colors">
                                    LinkedIn Profile
                                </a>
                            </li>

                        </ul>
                    </div>

                </div>

                {/* Bottom bar — Copyright with name */}
                <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4"
                     style={{ borderColor: 'rgba(200, 144, 48, 0.2)' }}>
                    <p className="text-sm text-center md:text-left" style={{ color: '#6B5040' }}>
                        © {currentYear} India Temple Heritage & Pilgrimage Portal.
                        All rights reserved. Designed & Developed by{' '}
                        <a href="https://www.linkedin.com/in/ravirajsinh-gohil-empower"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold hover:underline transition-all"
                            style={{ color: '#C89030' }}>
                            Ravirajsinh Gohil
                        </a>
                    </p>
                    <p className="text-xs" style={{ color: '#6B5040' }}>
                        Built with <span style={{ color: '#C89030' }}>🙏</span> using MERN Stack
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
