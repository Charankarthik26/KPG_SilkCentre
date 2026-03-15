import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Mail, Phone, MapPin, Shield } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer glass-panel">
            <div className="container footer-grid">
                <div className="footer-brand">
                    <div className="brand">
                        <span className="brand-icon"><Box /></span>
                        <span className="brand-text text-gradient">KPG Silk Centre</span>
                    </div>
                    <p className="text-muted mt-4">Legacy of excellence, woven with tradition. Providing the finest silk textiles since generations.</p>
                </div>

                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/shop">Shop Collections</Link></li>
                        <li><Link to="/ar-view/demo">Virtual Runaway</Link></li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h4>Contact Us</h4>
                    <ul>
                        <li><MapPin size={16} /> 365, Erode Main Road, Perundurai West, Perundurai-638052</li>
                        <li><Phone size={16} /> +91 9443932208</li>
                        <li><Mail size={16} /> kpgsilk365@gmail.com</li>
                    </ul>
                </div>

                <div className="footer-admin">
                    <h4>Management</h4>
                    <Link to="/admin/login" className="admin-link">
                        <Shield size={16} /> Owner Portal
                    </Link>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} KPG Silk Centre. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
