import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, Box, Tag, Ruler, Palette, Smartphone } from 'lucide-react';

const ProductModal = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Womens',
        sub_category: '',
        price: '₹',
        stock: 0,
        color: '',
        image: '',
        description: '',
        model_path: '',
        is_ar: false
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                category: product.category || 'Womens',
                sub_category: product.sub_category || product.subCategory || '',
                price: product.price || '₹',
                stock: product.stock || 0,
                color: product.color || '',
                image: product.image || '',
                description: product.description || '',
                model_path: product.model_path || product.modelPath || '',
                is_ar: product.is_ar || product.isAR || false
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'stock' ? parseInt(value) || 0 : value)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('ProductModal handleSubmit triggered');
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel animate-scale-up">
                <header className="modal-header">
                    <h2 className="text-gradient">{product ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={onClose} className="close-btn"><X /></button>
                </header>

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-grid">
                        <div className="input-group-v full-width">
                            <label><Box size={16} /> Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Pure Kanchipuram Silk"
                            />
                        </div>

                        <div className="input-group-v">
                            <label><Tag size={16} /> Category</label>
                            <select name="category" value={formData.category} onChange={handleChange}>
                                <option value="Womens">Womens</option>
                                <option value="Mens">Mens</option>
                                <option value="Kids">Kids</option>
                            </select>
                        </div>

                        <div className="input-group-v">
                            <label><Ruler size={16} /> Sub-Category</label>
                            <input
                                type="text"
                                name="sub_category"
                                value={formData.sub_category}
                                onChange={handleChange}
                                placeholder="e.g. Silk Saree"
                            />
                        </div>

                        <div className="input-group-v">
                            <label><Tag size={16} /> Price</label>
                            <input
                                type="text"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group-v">
                            <label><Box size={16} /> Initial Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group-v">
                            <label><Palette size={16} /> Primary Color</label>
                            <input
                                type="text"
                                name="color"
                                value={formData.color}
                                onChange={handleChange}
                                placeholder="Red, Gold, Blue..."
                            />
                        </div>

                        <div className="input-group-v flex-row items-center gap-2">
                            <label className="mb-0 pointer"><Smartphone size={16} /> AR Ready?</label>
                            <input
                                type="checkbox"
                                name="is_ar"
                                checked={formData.is_ar}
                                onChange={handleChange}
                                className="w-5 h-5"
                            />
                        </div>

                        <div className="input-group-v full-width">
                            <label><ImageIcon size={16} /> Image URL</label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                required
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="input-group-v full-width">
                            <label><Box size={16} /> 3D Model Path (.glb)</label>
                            <input
                                type="text"
                                name="model_path"
                                value={formData.model_path}
                                onChange={handleChange}
                                placeholder="/models/custom_product_model.glb"
                            />
                        </div>

                        <div className="input-group-v full-width">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Describe the product details, fabric, and craft..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
                        <button type="submit" className="btn btn-primary"><Save size={18} /> {product ? 'Update' : 'Add'} Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
