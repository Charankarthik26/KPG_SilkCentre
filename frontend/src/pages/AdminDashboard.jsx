import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrendingUp,
    Package,
    DollarSign,
    AlertCircle,
    LogOut,
    ChevronRight,
    Plus,
    Edit3,
    Trash2
} from 'lucide-react';
import ProductModal from '../components/ProductModal';
import { API_BASE_URL } from '../config';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [stats, setStats] = useState({
        totalRevenue: '₹14,50,000',
        totalSales: 124,
        lowStockItems: 0,
        totalStockValue: '₹45,00,000'
    });
    const navigate = useNavigate();

    const fetchProducts = async () => {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        setProducts(data);
        const lowStock = data.filter(p => p.stock < 10).length;

        // Dynamic stock value calculation
        const totalValue = (data || []).reduce((acc, p) => {
            const price = parseInt(String(p.price || '').replace(/[^\d]/g, '')) || 0;
            return acc + (price * (p.stock || 0));
        }, 0);

        setStats(prev => ({
            ...prev,
            lowStockItems: lowStock,
            totalStockValue: `₹${totalValue.toLocaleString('en-IN')}`
        }));
    };

    useEffect(() => {
        const token = localStorage.getItem('kpg_admin_token');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchProducts();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('kpg_admin_token');
        navigate('/');
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async (id) => {
        // if (!window.confirm('Are you sure you want to delete this product?')) return;

        const token = localStorage.getItem('kpg_admin_token');
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            fetchProducts();
        }
    };

    const handleSaveProduct = async (formData) => {
        const token = localStorage.getItem('kpg_admin_token');
        const url = editingProduct
            ? `${API_BASE_URL}/products/${editingProduct.id}`
            : `${API_BASE_URL}/products`;
        const method = editingProduct ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            setIsModalOpen(false);
            fetchProducts();
        } else {
            alert('Failed to save product');
        }
    };

    return (
        <div className="admin-dashboard-page container">
            <header className="dashboard-header animate-fade-in">
                <div>
                    <h1 className="text-gradient">Welcome back, Owner</h1>
                    <p className="text-muted">Here's what's happening at KPG Silk Centre today</p>
                </div>
                <button onClick={handleLogout} className="btn btn-outline glass-panel logout-btn">
                    <LogOut size={18} /> Logout
                </button>
            </header>

            {/* Stats Section Remains Similar */}
            <div className="stats-grid">
                <div className="stat-card glass-panel">
                    <div className="stat-info">
                        <p className="stat-label">Total Revenue</p>
                        <h2 className="stat-value">{stats.totalRevenue}</h2>
                        <span className="stat-trend trend-up"><TrendingUp size={14} /> +12% from last month</span>
                    </div>
                    <div className="stat-icon rev"><DollarSign /></div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-info">
                        <p className="stat-label">Total Stock Value</p>
                        <h2 className="stat-value">{stats.totalStockValue}</h2>
                        <span className="stat-trend">Inventory worth</span>
                    </div>
                    <div className="stat-icon stock-v"><Package /></div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-info">
                        <p className="stat-label">Low Stock Alerts</p>
                        <h2 className="stat-value">{stats.lowStockItems}</h2>
                        <span className={`stat-trend ${stats.lowStockItems > 0 ? 'trend-down' : ''}`}>
                            {stats.lowStockItems > 0 ? 'Needs immediate restock' : 'All items well stocked'}
                        </span>
                    </div>
                    <div className="stat-icon alert"><AlertCircle /></div>
                </div>
            </div>

            <section className="dashboard-section mt-12">
                <div className="section-header">
                    <h2 className="text-gradient">Inventory Overview</h2>
                    <button onClick={handleAddProduct} className="btn btn-primary btn-sm flex items-center gap-2">
                        <Plus size={16} /> Add New Product
                    </button>
                </div>

                <div className="inventory-table-container glass-panel mt-6">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="p-cell">
                                            <img src={product.image} alt="" className="p-img-sm rounded" width="40" height="40" style={{ objectFit: 'cover' }} />
                                            <span>{product.name}</span>
                                        </div>
                                    </td>
                                    <td>{product.category}</td>
                                    <td>{product.stock} units</td>
                                    <td>{product.price}</td>
                                    <td>
                                        <span className={`status-pill ${product.stock > 10 ? 'active' : 'inactive'}`}>
                                            {product.stock > 10 ? 'Healthy' : 'Low Stock'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                className="table-action-btn edit"
                                                title="Edit Product"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="table-action-btn delete"
                                                title="Delete Product"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {isModalOpen && (
                <ProductModal
                    product={editingProduct}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveProduct}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
