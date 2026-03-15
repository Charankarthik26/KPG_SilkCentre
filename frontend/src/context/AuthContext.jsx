import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('kpg_user_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            // Check Admin
            const adminToken = localStorage.getItem('kpg_admin_token');
            if (adminToken) {
                setAdmin({ name: 'Owner', role: 'admin' });
            }

            // Check User
            const userToken = localStorage.getItem('kpg_user_token');
            if (userToken) {
                setToken(userToken);
                try {
                    const response = await fetch(`${API_BASE_URL}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${userToken}`
                        }
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                    } else {
                        localStorage.removeItem('kpg_user_token');
                        setToken(null);
                    }
                } catch (error) {
                    console.error("Auth check failed:", error);
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('kpg_user_token', data.token);
            setToken(data.token);
            setUser(data.user);
            localStorage.removeItem('kpg_admin_token');
            setAdmin(null);
            return { success: true };
        }
        return { success: false, message: data.message };
    };

    const adminLogin = (email, password) => {
        if (email === 'owner@kpgsilk.com' && password === 'admin123') {
            localStorage.setItem('kpg_admin_token', 'mock_token');
            setAdmin({ name: 'Owner', role: 'admin' });
            // Clear user if logging in as admin
            localStorage.removeItem('kpg_user_token');
            setToken(null);
            setUser(null);
            return { success: true };
        }
        return { success: false, message: 'Invalid credentials. Access denied.' };
    };

    const signup = async (name, email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (response.ok) {
            if (data.otpSent) {
                return { success: true, otpRequired: true, email };
            }
            // Fallback (if OTP disabled on server)
            localStorage.setItem('kpg_user_token', data.token);
            setToken(data.token);
            setUser(data.user);
            localStorage.removeItem('kpg_admin_token');
            setAdmin(null);
            return { success: true };
        }
        return { success: false, message: data.message };
    };

    const verifySignupOTP = async (email, otp) => {
        const response = await fetch(`${API_BASE_URL}/auth/verify-signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('kpg_user_token', data.token);
            setToken(data.token);
            setUser(data.user);
            localStorage.removeItem('kpg_admin_token');
            setAdmin(null);
            return { success: true };
        }
        return { success: false, message: data.message };
    };

    const updateProfile = async (profileData) => {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });
        const data = await response.json();
        if (response.ok) {
            setUser(data);
            return { success: true };
        }
        return { success: false, message: data.message };
    };

    const logout = () => {
        localStorage.removeItem('kpg_user_token');
        setToken(null);
        localStorage.removeItem('kpg_admin_token');
        setUser(null);
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ user, admin, token, login, signup, verifySignupOTP, adminLogin, updateProfile, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
