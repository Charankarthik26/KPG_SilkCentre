import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { adminLogin } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const result = adminLogin(email, password);
        if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="admin-login-page container">
            <div className="login-card glass-panel animate-fade-in">
                <div className="login-header">
                    <ShieldCheck size={48} className="text-primary" />
                    <h1 className="text-gradient">Owner Portal</h1>
                    <p className="text-muted">Secure access for KPG Silk Centre management</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    {error && <div className="error-msg">{error}</div>}

                    <div className="input-group glass-panel">
                        <User size={20} className="text-muted" />
                        <input
                            type="email"
                            placeholder="Owner Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group glass-panel">
                        <Lock size={20} className="text-muted" />
                        <input
                            type="password"
                            placeholder="Security Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg">
                        Verify & Enter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
