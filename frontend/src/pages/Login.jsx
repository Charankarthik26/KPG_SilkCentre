import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Timer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);
        if (result.success) {
            navigate('/shop');
        } else {
            setError(result.message || 'Login failed');
        }
        setLoading(false);
    };

    return (
        <div className="auth-container container">
            <div className="auth-card glass-panel animate-fade-in">
                <div className="auth-header">
                    <h1 className="text-gradient">Welcome Back</h1>
                    <p className="text-muted">Enter your credentials to access your account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="error-msg">{error}</div>}

                    <div className="input-group glass-panel">
                        <Mail size={20} className="text-muted" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group glass-panel">
                        <Lock size={20} className="text-muted" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                        {!loading && <LogIn size={20} />}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup" className="text-primary">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
