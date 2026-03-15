import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { User, Phone, MapPin, Ruler, Users, FileText, CheckCircle, Save, Lock } from 'lucide-react';
import './Profile.css';

const ProfilePage = () => {
    const { user, updateProfile, loading: authLoading, token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [sidebarLoading, setSidebarLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        gender: '',
        preferred_size: '',
        address: '',
        bio: ''
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                gender: user.gender || '',
                preferred_size: user.preferred_size || '',
                address: user.address || '',
                bio: user.bio || ''
            });
            fetchUserData();
        }
    }, [user, token]);

    const fetchUserData = async () => {
        if (!token) return;
        setSidebarLoading(true);
        try {
            // Fetch Orders
            const ordersRes = await fetch(`${API_BASE_URL}/user/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (ordersRes.ok) {
                const ordersData = await ordersRes.json();
                setOrders(ordersData);
            }

            // Fetch Favorites
            const favoritesRes = await fetch(`${API_BASE_URL}/user/favorites/details`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (favoritesRes.ok) {
                const favoritesData = await favoritesRes.json();
                setFavoriteProducts(favoritesData);
            }
        } catch (error) {
            console.error('Error fetching user activity:', error);
        } finally {
            setSidebarLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage({ type: '', text: '' });

        const result = await updateProfile(formData);
        if (result.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } else {
            setMessage({ type: 'error', text: result.message || 'Failed to update profile.' });
        }
        setIsUpdating(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    if (authLoading) return <div className="loading-container"><div className="loader"></div></div>;

    if (!user) return (
        <div className="auth-required-container">
            <div className="auth-required-card glass-panel animate-fade-in">
                <div className="auth-card-header">
                    <div className="auth-icon-circle">
                        <Lock size={32} />
                    </div>
                </div>
                <h2 className="text-gradient">Members Only</h2>
                <p className="text-muted">Please login to access your personalized silk profile, track orders, and manage your preferences.</p>

                <div className="brand-badge-mini">
                    <img src="/kpg-icon.png" alt="KPG Logo" className="mini-logo" />
                    <span>KPG Silk Centre</span>
                </div>

                <div className="auth-required-actions">
                    <Link to="/login" className="btn btn-primary w-full">Sign In</Link>
                    <Link to="/signup" className="btn btn-outline w-full">Create Account</Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="profile-page container">
            <div className="profile-grid animate-fade-in">
                {/* Profile Header */}
                <div className="profile-card profile-header-card glass-panel">
                    <div className="profile-avatar">
                        <div className="avatar-circle">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="profile-info">
                        <h1 className="text-gradient">Welcome, {user.name}</h1>
                        <p className="text-muted">{user.email}</p>
                        <div className="profile-badges">
                            <span className="badge">KPG Member</span>
                            {user.preferred_size && <span className="badge size-badge">{user.preferred_size}</span>}
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="profile-card glass-panel profile-form">
                    <h2 className="section-title">Personal Details</h2>

                    {message.text && (
                        <div className={`form-message ${message.type}`}>
                            {message.type === 'success' ? <CheckCircle size={18} /> : null}
                            {message.text}
                        </div>
                    )}

                    <div className="form-grid">
                        <div className="input-group-v">
                            <label><User size={16} /> Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your Name"
                                className="glass-panel"
                            />
                        </div>

                        <div className="input-group-v">
                            <label><Phone size={16} /> Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 XXX XXX XXXX"
                                className="glass-panel"
                            />
                        </div>

                        <div className="input-group-v">
                            <label><Users size={16} /> Gender</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="glass-panel"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>

                        <div className="input-group-v">
                            <label><Ruler size={16} /> Preferred Size</label>
                            <select
                                name="preferred_size"
                                value={formData.preferred_size}
                                onChange={handleChange}
                                className="glass-panel"
                            >
                                <option value="">Select Size</option>
                                <option value="XS">Extra Small (XS)</option>
                                <option value="S">Small (S)</option>
                                <option value="M">Medium (M)</option>
                                <option value="L">Large (L)</option>
                                <option value="XL">Extra Large (XL)</option>
                                <option value="XXL">Double XL (XXL)</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group-v full-width">
                        <label><MapPin size={16} /> Delivery Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Your full delivery address"
                            className="glass-panel"
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="input-group-v full-width">
                        <label><FileText size={16} /> Personal Bio / Style Notes</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about your style preferences..."
                            className="glass-panel"
                            rows="2"
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary save-btn" disabled={isUpdating}>
                        {isUpdating ? 'Saving...' : <><Save size={20} /> Save Profile</>}
                    </button>
                </form>

                {/* Sidebar Cards */}
                <div className="profile-sidebar">
                    <div className="profile-card glass-panel sidebar-activity-card">
                        <div className="card-header-v">
                            <h3>Order History</h3>
                            <Link to="/cart" className="view-all-link">Checkout New Bag</Link>
                        </div>

                        {sidebarLoading ? (
                            <div className="mini-loader"></div>
                        ) : orders.length > 0 ? (
                            <div className="activity-list scrollbar-v">
                                {orders.map(order => (
                                    <div key={order.id} className="activity-item glass-panel">
                                        <div className="activity-main">
                                            <div className="order-primary-info">
                                                <span className="order-id">Order #{order.id}</span>
                                                {order.tracking_id && <span className="tracking-info">Tracking: {order.tracking_id}</span>}
                                            </div>
                                            <span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="order-meta">
                                            <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
                                            <span className="order-total">{order.total_amount}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted empty-msg">You haven't placed any orders yet.</p>
                        )}
                        <Link to="/shop" className="btn btn-outline btn-sm w-full mt-4">Browse Collection</Link>
                    </div>

                    <div className="profile-card glass-panel sidebar-activity-card">
                        <div className="card-header-v">
                            <h3>Favorites</h3>
                            <span className="count-badge">{favoriteProducts.length}</span>
                        </div>

                        {sidebarLoading ? (
                            <div className="mini-loader"></div>
                        ) : favoriteProducts.length > 0 ? (
                            <div className="activity-list scrollbar-v">
                                {favoriteProducts.map(fav => (
                                    <Link to={`/product/${fav.id}`} key={fav.id} className="fav-item glass-panel animate-fade-in">
                                        <div className="fav-img">
                                            <img src={fav.image} alt={fav.name} />
                                        </div>
                                        <div className="fav-info">
                                            <h4>{fav.name}</h4>
                                            <p>{fav.price}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted empty-msg">Save the silks you love to your wishlist.</p>
                        )}
                        <Link to="/shop" className="btn btn-outline btn-sm w-full mt-4">Explore More</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
