import React, { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    // Jab Website first time load hoga tab check kiya ki kya pehle se token hai ya nhin..
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token) {
            setUser({ token, role });
        }
    }, []);

    // Login Function (Token aur role ko save krne ke liye)
    const login = (token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setUser({ token, role});
    };

    // Logout Function (Sab kuchh delete krne ke liye)
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
    };

    return (
        <AuthContext.Provider value = {{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};  