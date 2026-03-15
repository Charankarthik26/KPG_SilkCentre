import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Box, Sun, Moon, User, ShieldCheck } from 'lucide-react';
import './Navbar.css';

import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { totalItems } = useCart();
    const { theme, toggleTheme } = useTheme();
    const { user, admin, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop Collections', path: '/shop' },
        { name: 'Virtual Runaway', path: '/virtual-runway' },
    ];

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled glass-panel' : ''}`}>
            <div className="container nav-container">
                <Link to="/" className="brand">
                    <span className="brand-icon">
                        <img src="/kpg-icon.png" alt="KPG Logo" className="navbar-logo-icon" />
                    </span>
                    <span className="brand-text text-gradient">KPG Silk Centre</span>
                </Link>

                <div className="nav-links desktop-only">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    {admin && (
                        <Link to="/admin/dashboard" className="nav-link special-link">Dashboard</Link>
                    )}
                </div>

                <div className="nav-actions">
                    <button
                        className="icon-btn theme-toggle"
                        onClick={toggleTheme}
                        aria-label="Toggle Theme"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {admin ? (
                        <div className="user-nav">
                            <Link to="/admin/dashboard" className="user-profile-link">
                                <ShieldCheck size={20} className="text-primary" />
                                <span className="user-name-text desktop-only">Admin Portal</span>
                            </Link>
                            <button onClick={logout} className="nav-link logout-btn desktop-only">Logout</button>
                        </div>
                    ) : user ? (
                        <div className="user-nav">
                            <Link to="/profile" className="user-profile-link" aria-label="Account">
                                <User size={20} />
                                <span className="user-name-text desktop-only">Hi, {user.name.split(' ')[0]}</span>
                            </Link>
                            <button onClick={logout} className="nav-link logout-btn desktop-only">Logout</button>
                        </div>
                    ) : (
                        <Link to="/login" className="nav-link login-link desktop-only">Login</Link>
                    )}

                    <Link to="/cart" className="icon-btn" aria-label="Cart">
                        <ShoppingBag size={24} />
                        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                    </Link>

                    <button
                        className="mobile-menu-btn icon-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu glass-panel ${isMobileMenuOpen ? 'open' : ''}`}>
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        className="mobile-nav-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
