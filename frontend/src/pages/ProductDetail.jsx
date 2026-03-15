import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Smartphone, ShoppingBag, ShieldCheck, Truck, Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { API_BASE_URL } from '../config';
import './ProductDetail.css';

import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);
    const [activeTab, setActiveTab] = useState('Specifications');

    useEffect(() => {
        fetch(`${API_BASE_URL}/products`)
            .then(res => res.json())
            .then(data => {
                const item = data.find(p => p.id === parseInt(id));
                setProduct(item);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching product:', err);
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return (
        <div className="product-detail-page container py-20 text-center">
            <h1 className="text-gradient">Fetching Excellence...</h1>
        </div>
    );

    if (!product) return (
        <div className="product-detail-page container py-20 text-center">
            <h1 className="text-gradient">Product Not Found</h1>
            <Link to="/shop" className="btn btn-primary mt-4">Back to Shop</Link>
        </div>
    );

    return (
        <div className="product-detail-page container">
            <Link to="/shop" className="back-link">
                <ArrowLeft size={20} /> Back to Shop
            </Link>

            <div className="product-detail-grid">
                <div className="product-gallery">
                    <div className={`main-image glass-panel ${product.image ? 'with-image' : `color-${(product.color || 'white').toLowerCase()}`}`}>
                        {product.image && <img src={product.image} alt={product.name} className="detail-product-image" />}
                    </div>
                    <div className="thumbnail-list">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="thumbnail glass-panel"></div>
                        ))}
                    </div>
                </div>

                <div className="product-info-panel animate-fade-in">
                    <div className="badge-wrapper">
                        <span className="pill-badge glass-panel">{product.subCategory || product.category}</span>
                    </div>

                    <h1 className="detail-title">{product.name}</h1>
                    <p className="detail-price">{product.price} <span className="text-muted text-sm">(Incl. of all taxes)</span></p>

                    <p className="detail-description text-muted">
                        {product.description || "Experience the epitome of elegance with this meticulously hand-woven silk attire. Perfect for weddings and grand occasions."}
                    </p>

                    <div className="stock-info mt-4">
                        <span className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                            {product.stock > 0 ? `In Stock: ${product.stock} units available` : 'Out of Stock'}
                        </span>
                    </div>

                    <div className="detail-actions mt-6">
                        <div className="action-row-main">
                            <button
                                className={`btn btn-primary w-full btn-lg ${added ? 'btn-success' : ''}`}
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                            >
                                <ShoppingBag size={20} /> {added ? 'Added to Cart!' : 'Add to Cart'}
                            </button>
                            <button
                                className={`btn-favorite-detail glass-panel ${isFavorite(product.id) ? 'active' : ''}`}
                                onClick={async () => {
                                    const result = await toggleFavorite(product.id);
                                    if (result && !result.success) {
                                        alert(result.message);
                                    }
                                }}
                            >
                                <Heart size={24} fill={isFavorite(product.id) ? "var(--color-primary)" : "none"} />
                            </button>
                        </div>

                        {(product.is_ar || product.isAR) && (
                            <Link to={`/ar-view/${id}`} className="btn btn-outline w-full mt-4 btn-lg">
                                <Smartphone size={20} /> View in Your Space (AR)
                            </Link>
                        )}
                    </div>

                    <div className="delivery-perks mt-6">
                        <div className="perk-item">
                            <Truck size={24} className="text-primary" />
                            <div>
                                <h4>Free Shipping</h4>
                                <p className="text-muted text-sm">On orders over ₹5,000</p>
                            </div>
                        </div>
                        <div className="perk-item">
                            <ShieldCheck size={24} className="text-primary" />
                            <div>
                                <h4>Authenticity Guaranteed</h4>
                                <p className="text-muted text-sm">100% genuine KPG Silk</p>
                            </div>
                        </div>
                    </div>

                    {/* Resourceful Tabs Section */}
                    <div className="product-resource-tabs mt-10">
                        <div className="tabs-header glass-panel">
                            {['Specifications', 'Care Guide', 'Shipping'].map(tab => (
                                <button
                                    key={tab}
                                    className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="tab-content glass-panel p-6 mt-2">
                            {activeTab === 'Specifications' && (
                                <div className="spec-grid animate-fade-in">
                                    <div className="spec-row">
                                        <span>Material</span>
                                        <span>Pure Mulberry Silk</span>
                                    </div>
                                    <div className="spec-row">
                                        <span>Zari Type</span>
                                        <span>Gold & Silver Plated</span>
                                    </div>
                                    <div className="spec-row">
                                        <span>Weave</span>
                                        <span>Hand-loomed Traditional</span>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'Care Guide' && (
                                <div className="spec-grid text-muted animate-fade-in text-sm">
                                    <p>• Dry clean only to maintain the fabric's sheen and color.</p>
                                    <p>• Store in a cool, dry place wrapped in cotton cloth.</p>
                                    <p>• Avoid direct contact with perfumes or harsh chemicals.</p>
                                </div>
                            )}

                            {activeTab === 'Shipping' && (
                                <div className="spec-grid text-muted animate-fade-in text-sm">
                                    <p>• Standard delivery within 5-7 business days across India.</p>
                                    <p>• Express international delivery available at checkout.</p>
                                    <p>• Hassle-free 14 days return policy for unused items.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
