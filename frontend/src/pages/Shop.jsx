import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Smartphone, Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { API_BASE_URL } from '../config';
import './Shop.css';

const Shop = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isFavorite, toggleFavorite } = useFavorites();

    const categories = ['All', 'Sarees', 'Kurtis', 'Mens', 'Kids', 'Premium'];

    useEffect(() => {
        fetch(`${API_BASE_URL}/products`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching products:', err);
                setLoading(false);
            });
    }, []);

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;

        let matchesCategory = false;
        const cat = product.category || '';
        const sub = product.sub_category || product.subCategory || '';

        if (selectedCategory === 'All') {
            matchesCategory = true;
        } else if (selectedCategory === 'Sarees') {
            matchesCategory = cat === 'Womens' &&
                sub &&
                (sub.toLowerCase().includes('saree') || sub.toLowerCase().includes('premium silk'));
        } else if (selectedCategory === 'Kurtis') {
            matchesCategory = cat === 'Womens' &&
                sub &&
                (sub.toLowerCase() === 'dresses' || sub.toLowerCase().includes('kurti'));
        } else if (selectedCategory === 'Premium') {
            matchesCategory = cat === 'Premium' ||
                (sub && sub.toLowerCase().includes('premium'));
        } else {
            matchesCategory = cat === selectedCategory;
        }

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="shop-page container">
            <header className="shop-header animate-fade-in">
                <h1 className="text-gradient">Our Collections</h1>
                <p className="text-muted">Discover the finest silk textiles, meticulously crafted for everyone.</p>
            </header>

            <div className="shop-controls">
                <div className="search-bar glass-panel">
                    <Search size={20} className="text-muted" />
                    <input
                        type="text"
                        placeholder="Search for dresses, sarees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="category-filters">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-chip glass-panel ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <h3 className="text-gradient">Curating Collections...</h3>
                </div>
            ) : (
                <div className="product-grid">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="product-card glass-panel">
                            <div className={`product-image-placeholder ${product.image ? 'with-image' : `color-${(product.color || 'white').toLowerCase()}`}`}>
                                {product.image && <img src={product.image} alt={product.name} className="product-image" />}
                                {(product.is_ar || product.isAR) && (
                                    <div className="ar-badge">
                                        <Smartphone size={14} /> AR Ready
                                    </div>
                                )}
                                <div className="category-tag">{product.sub_category || product.subCategory || product.category}</div>
                                <button
                                    className={`favorite-btn ${isFavorite(product.id) ? 'active' : ''}`}
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        const result = await toggleFavorite(product.id);
                                        if (result && !result.success) {
                                            alert(result.message);
                                        }
                                    }}
                                >
                                    <Heart size={20} fill={isFavorite(product.id) ? "var(--color-primary)" : "none"} />
                                </button>
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <div className="product-price">{product.price}</div>
                                <div className="product-actions">
                                    <Link to={`/product/${product.id}`} className="btn btn-primary w-full">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Shop;
