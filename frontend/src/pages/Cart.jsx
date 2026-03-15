import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, CreditCard, Landmark, Wallet, CheckCircle, MapPin, User, Mail, Phone, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    const { user, token } = useAuth();
    const [step, setStep] = useState(0); // 0: Cart, 1: Billing, 2: Success
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [billingDetails, setBillingDetails] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: ''
    });

    const estimatedTax = totalPrice * 0.05; // 5% GST
    const shipping = totalPrice > 5000 ? 0 : 150;
    const finalTotal = totalPrice + estimatedTax + shipping;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBillingDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleConfirmOrder = async () => {
        try {
            if (token) {
                const response = await fetch(`${API_BASE_URL}/user/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        cartItems: cartItems.map(item => ({
                            id: item.id,
                            quantity: item.quantity,
                            price: item.price
                        })),
                        totalAmount: `₹${finalTotal.toLocaleString()}`,
                        shippingAddress: `${billingDetails.address}, ${billingDetails.city}, ${billingDetails.state} - ${billingDetails.zip}`
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    setBillingDetails(prev => ({ ...prev, trackingId: data.trackingId }));
                    setStep(2);
                    setTimeout(() => {
                        clearCart();
                    }, 3000);
                } else {
                    alert('Failed to place order. Please check your details.');
                }
            } else {
                // Guest Flow
                alert('Please login to place a formal order and receive email confirmations. Showing demo success page.');
                setStep(2);
                setTimeout(() => {
                    clearCart();
                }, 3000);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert(`Network Error: ${error.message}. Please ensure the backend server is running.`);
        }
    };

    const isBillingValid = () => {
        return Object.values(billingDetails).every(val => val.trim() !== '');
    };

    if (step === 2) {
        return (
            <div className="cart-page success-page-container">
                <div className="container">
                    <div className="success-card glass-panel animate-scale-in">
                        <div className="success-icon-wrapper">
                            <div className="success-icon-glow"></div>
                            <svg className="success-tick-svg" viewBox="0 0 52 52">
                                <circle className="success-tick-circle" cx="26" cy="26" r="25" fill="none" />
                                <path className="success-tick-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                        </div>

                        <div className="success-text-content">
                            <h1 className="text-gradient">Order Confirmed!</h1>
                            <p className="success-subtitle">Thank you for shopping with KPG Silk Centre. Your silk attire is on its way!</p>
                            {billingDetails.trackingId && (
                                <div className="tracking-badge glass-panel mt-4">
                                    <span>Tracking ID: </span>
                                    <strong>{billingDetails.trackingId}</strong>
                                </div>
                            )}
                        </div>

                        <div className="success-details-grid mt-10">
                            <div className="shipping-info-card glass-panel">
                                <h3><MapPin size={18} /> Shipping to</h3>
                                <div className="shipping-address-content">
                                    <p className="customer-name">{billingDetails.fullName}</p>
                                    <p className="customer-address">
                                        {billingDetails.address}, <br />
                                        {billingDetails.city}, {billingDetails.state} - {billingDetails.zip}
                                    </p>
                                </div>
                            </div>

                            <div className="rating-card glass-panel">
                                <h3>Rate Your Experience</h3>
                                <div className="star-rating-container">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            className={`star-btn ${(hoverRating || rating) >= star ? 'active' : ''}`}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                        >
                                            <Star size={32} fill={(hoverRating || rating) >= star ? 'var(--color-primary)' : 'none'} />
                                        </button>
                                    ))}
                                </div>
                                {rating > 0 && <p className="rating-feedback animate-fade-in">Thank you for your {rating}-star rating!</p>}
                            </div>
                        </div>

                        <div className="success-actions mt-10">
                            <Link to="/shop" className="btn btn-primary btn-lg">
                                Continue Shopping <ArrowRight size={20} />
                            </Link>
                            <Link to="/profile" className="btn btn-outline btn-lg mt-4 w-full">
                                View Order History
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0 && step === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart glass-panel animate-fade-in">
                        <div className="empty-cart-icon">
                            <ShoppingBag size={80} />
                        </div>
                        <h2>Your Cart is Empty</h2>
                        <p className="text-muted mt-2">Discover our exclusive collection and find your perfect silk.</p>
                        <Link to="/shop" className="btn btn-primary mt-8">Go to Shop</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page animate-fade-in">
            <div className="container">
                <div className="cart-header">
                    <div className="checkout-steps">
                        <div className={`step-item ${step >= 0 ? 'active' : ''}`}><span>1</span> Cart</div>
                        <div className="step-line"></div>
                        <div className={`step-item ${step >= 1 ? 'active' : ''}`}><span>2</span> Billing</div>
                    </div>
                    <h1 className="text-gradient mt-4">{step === 0 ? 'Your Cart' : 'Billing Details'}</h1>
                    <p className="text-muted">{cartItems.length} items in your bag</p>
                </div>

                <div className="cart-container">
                    <div className="cart-main-section">
                        {step === 0 ? (
                            <div className="cart-items-section">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="cart-item glass-panel">
                                        <div className="cart-item-image">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className="cart-item-info">
                                            <h3 className="cart-item-name">{item.name}</h3>
                                            <p className="cart-item-price">{item.price}</p>
                                            <div className="cart-item-controls mt-4">
                                                <button
                                                    className="quantity-btn"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="quantity-text">{item.quantity}</span>
                                                <button
                                                    className="quantity-btn"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item.id)}
                                            title="Remove Item"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="billing-section glass-panel">
                                <button className="back-to-cart-btn" onClick={() => setStep(0)}>
                                    <ArrowLeft size={16} /> Back to Cart
                                </button>
                                <div className="billing-form mt-6">
                                    <div className="form-group">
                                        <label><User size={14} /> Full Name</label>
                                        <input type="text" name="fullName" value={billingDetails.fullName} onChange={handleInputChange} placeholder="John Doe" />
                                    </div>
                                    <div className="form-group-row">
                                        <div className="form-group">
                                            <label><Mail size={14} /> Email</label>
                                            <input type="email" name="email" value={billingDetails.email} onChange={handleInputChange} placeholder="john@example.com" />
                                        </div>
                                        <div className="form-group">
                                            <label><Phone size={14} /> Phone</label>
                                            <input type="tel" name="phone" value={billingDetails.phone} onChange={handleInputChange} placeholder="+91 9876543210" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label><MapPin size={14} /> Street Address</label>
                                        <input type="text" name="address" value={billingDetails.address} onChange={handleInputChange} placeholder="123 Silk Lane" />
                                    </div>
                                    <div className="form-group-row">
                                        <div className="form-group">
                                            <label>City</label>
                                            <input type="text" name="city" value={billingDetails.city} onChange={handleInputChange} placeholder="Kanchipuram" />
                                        </div>
                                        <div className="form-group">
                                            <label>State</label>
                                            <input type="text" name="state" value={billingDetails.state} onChange={handleInputChange} placeholder="Tamil Nadu" />
                                        </div>
                                        <div className="form-group">
                                            <label>ZIP Code</label>
                                            <input type="text" name="zip" value={billingDetails.zip} onChange={handleInputChange} placeholder="631501" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="order-summary glass-panel">
                        <h2 className="summary-title">Order Summary</h2>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Estimated Tax (5%)</span>
                            <span>₹{estimatedTax.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                        </div>

                        <div className="summary-row total">
                            <span>Total Amount</span>
                            <span className="total-amount">₹{finalTotal.toLocaleString()}</span>
                        </div>

                        {step === 1 && (
                            <div className="payment-section">
                                <h3 className="payment-title">Select Payment Option</h3>
                                <div className="payment-options">
                                    <div
                                        className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod('card')}
                                    >
                                        <div className="payment-radio"></div>
                                        <CreditCard size={20} />
                                        <span>Credit / Debit Card</span>
                                    </div>
                                    <div
                                        className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod('upi')}
                                    >
                                        <div className="payment-radio"></div>
                                        <Wallet size={20} />
                                        <span>UPI / Net Banking</span>
                                    </div>
                                    <div
                                        className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod('cod')}
                                    >
                                        <div className="payment-radio"></div>
                                        <Landmark size={20} />
                                        <span>Cash on Delivery</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            className={`btn btn-primary confirm-btn ${step === 1 && !isBillingValid() ? 'disabled' : ''}`}
                            onClick={() => step === 0 ? setStep(1) : handleConfirmOrder()}
                            disabled={step === 1 && !isBillingValid()}
                        >
                            {step === 0 ? (
                                <>Proceed to Billing <ArrowRight size={18} /></>
                            ) : (
                                'Confirm Order'
                            )}
                        </button>
                        {step === 1 && !isBillingValid() && (
                            <p className="text-muted text-xs text-center mt-2">Please complete the billing details to confirm.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
