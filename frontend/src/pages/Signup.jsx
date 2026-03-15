import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, verifySignupOTP } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signup(formData.name, formData.email, formData.password);
        if (result.success) {
            if (result.otpRequired) {
                setShowOtp(true);
            } else {
                navigate('/shop');
            }
        } else {
            setError(result.message || 'Signup failed');
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await verifySignupOTP(formData.email, otp);
        if (result.success) {
            navigate('/shop');
        } else {
            setError(result.message || 'Invalid verification code');
        }
        setLoading(false);
    };

    return (
        <div className="auth-container container">
            <div className="auth-card glass-panel animate-fade-in">
                {!showOtp ? (
                    <>
                        <div className="auth-header">
                            <h1 className="text-gradient">Join KPG Silk Centre</h1>
                            <p className="text-muted">Create an account to track orders and save favorites</p>
                        </div>

                        <form onSubmit={handleSubmit} className="auth-form">
                            {error && <div className="error-msg">{error}</div>}

                            <div className="input-group glass-panel">
                                <User size={20} className="text-muted" />
                                <input
                                    id="signup-name"
                                    name="name"
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    autoComplete="name"
                                />
                            </div>

                            <div className="input-group glass-panel">
                                <Mail size={20} className="text-muted" />
                                <input
                                    id="signup-email"
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="input-group glass-panel">
                                <Lock size={20} className="text-muted" />
                                <input
                                    id="signup-password"
                                    name="password"
                                    type="password"
                                    placeholder="Create Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
                                {loading ? 'Checking Details...' : 'Sign Up'}
                                {!loading && <ArrowRight size={20} />}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="auth-header">
                            <div className="otp-icon-wrapper">
                                <CheckCircle size={40} className="text-primary" />
                            </div>
                            <h1 className="text-gradient">Verify Email</h1>
                            <p className="text-muted">A verification code has been sent to <strong>{formData.email}</strong></p>
                        </div>

                        <form onSubmit={handleVerifyOtp} className="auth-form">
                            {error && <div className="error-msg">{error}</div>}

                            <div className="otp-input-container">
                                <div className="input-group glass-panel otp-group">
                                    <Mail size={20} className="text-muted" />
                                    <input
                                        id="otp-code"
                                        name="otp"
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        maxLength={6}
                                        className="otp-field"
                                        required
                                        autoFocus
                                        autoComplete="one-time-code"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading || otp.length < 6}>
                                {loading ? 'Verifying...' : 'Verify & Create Account'}
                                {!loading && <ArrowRight size={20} />}
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline w-full mt-4"
                                onClick={() => setShowOtp(false)}
                                disabled={loading}
                            >
                                Back to Form
                            </button>

                            <p className="resend-text text-sm mt-6 text-center text-muted">
                                Didn't receive the email? <span className="text-primary pointer">Resend Code</span>
                            </p>
                        </form>
                    </>
                )}

                <p className="auth-footer">
                    Already have an account? <Link to="/login" className="text-primary">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
