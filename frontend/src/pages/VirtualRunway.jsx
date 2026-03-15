import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Sparkles, Move3d } from 'lucide-react';
import { API_BASE_URL } from '../config';
import './VirtualRunway.css';

const VirtualRunway = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/products`)
            .then(res => res.json())
            .then(data => {
                // Filter only products that are 3D/AR enabled
                const arProducts = data.filter(p => p.is_ar || p.isAR);
                setProducts(arProducts);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching AR products:', err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="virtual-runway-page container">
            <header className="runway-header animate-fade-in">
                <div className="header-icon">
                    <Sparkles className="text-primary" size={32} />
                </div>
                <h1 className="text-gradient">Virtual Runway</h1>
                <p className="text-muted">Explore our 3D-enhanced collection. Step into the future of silk shopping with immersive AR previews.</p>
            </header>

            {loading ? (
                <div className="loading-state h-64 flex items-center justify-center">
                    <h3 className="text-gradient">Preparing the Runway...</h3>
                </div>
            ) : products.length > 0 ? (
                <div className="runway-product-grid">
                    {products.map((product) => (
                        <div key={product.id} className="runway-card glass-panel group">
                            <div className="card-top">
                                <div className={`product-preview-box ${product.image ? 'with-image' : `color-${(product.color || 'white').toLowerCase()}`}`}>
                                    {product.image && <img src={product.image} alt={product.name} className="product-image" />}
                                    <div className="ar-status-badge">
                                        <Smartphone size={14} /> 3D Ready
                                    </div>
                                </div>
                            </div>

                            <div className="card-bottom">
                                <div className="product-meta">
                                    <span className="product-category-tag">{product.sub_category || product.subCategory || product.category}</span>
                                    <h3 className="runway-product-name">{product.name}</h3>
                                    <p className="runway-product-price">₹{product.price?.toLocaleString()}</p>
                                </div>

                                <Link to={`/ar-view/${product.id}`} className="runway-action-btn btn btn-primary w-full">
                                    <Move3d size={18} /> Launch 3D Experience
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state glass-panel">
                    <Smartphone size={48} className="text-muted mb-4" />
                    <h3>No 3D Models Ready</h3>
                    <p className="text-muted mt-2">Our technical team is currently weaving digital twins for our latest collections. Check back soon!</p>
                    <Link to="/shop" className="btn btn-outline mt-6">Shop Regular Collections</Link>
                </div>
            )}
        </div>
    );
};

export default VirtualRunway;
