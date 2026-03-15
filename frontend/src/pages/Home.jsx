import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Smartphone, Box, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { user, admin } = useAuth();
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            badge: admin ? "Admin Management Mode" : "Experience the Future of Fashion",
            title: admin
                ? <>System Control: <span className="text-gradient">Owner Portal</span></>
                : user
                    ? <>Welcome Back, <span className="text-gradient">{user.name.split(' ')[0]}</span></>
                    : <>Redefining Elegance with <br /><span className="text-gradient">Augmented Reality</span></>,
            subtitle: admin
                ? "Manage your product catalog, view analytics, and oversee orders from your central dashboard."
                : user
                    ? "We've curated new silk collections matching your preferences. Check out your personalized recommendations today."
                    : "KPG Silk Centre brings premium textiles and bespoke dresses right into your room. Try on our latest collection virtually before you buy.",
            cta: admin ? "/admin/dashboard" : "/shop",
            extraCta: admin ? "/shop" : "/profile",
            extraCtaText: admin ? "View Live Shop" : "Manage Profile",
            image: "orb-1"
        },
        {
            id: 2,
            badge: "Heritage Meets Technology",
            title: <>Timeless Silk <br /><span className="text-gradient">Modern Experience</span></>,
            subtitle: "Our generational weaving expertise combined with cutting-edge AR technology offers you a shopping experience like never before.",
            cta: "/shop",
            extraCta: "/ar-view/demo",
            extraCtaText: "Virtual Tour",
            image: "orb-2"
        },
        {
            id: 3,
            badge: "The Wedding Collection",
            title: <>Handcrafted for Your <br /><span className="text-gradient">Special Moments</span></>,
            subtitle: "Explore our curated collection of bridal silks and formal attire, designed to make your celebrations truly unforgettable.",
            cta: "/shop",
            extraCta: null,
            image: "orb-1"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="home-container">
            {/* Carousel Hero Section */}
            <section className="hero">
                <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {slides.map((slide, idx) => (
                        <div key={slide.id} className="hero-slide">
                            <div className="hero-background">
                                <div className={`glow-orb ${slide.image}`}></div>
                            </div>
                            <div className="container hero-content animate-fade-in" key={currentSlide}>
                                <div className="pill-badge glass-panel">
                                    <Sparkles size={16} className="text-primary" />
                                    <span>{slide.badge}</span>
                                </div>

                                <h1 className="hero-title">{slide.title}</h1>

                                <p className="hero-subtitle">{slide.subtitle}</p>

                                <div className="hero-cta">
                                    <Link to={slide.cta} className="btn btn-primary">
                                        Explore Collection <ArrowRight size={18} />
                                    </Link>
                                    {slide.extraCta && (
                                        <Link to={slide.extraCta} className="btn btn-outline glass-panel">
                                            <Smartphone size={18} /> {slide.extraCtaText}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Carousel Navigation */}
                <button className="carousel-control prev glass-panel" onClick={prevSlide} aria-label="Previous slide">
                    <ChevronLeft size={24} />
                </button>
                <button className="carousel-control next glass-panel" onClick={nextSlide} aria-label="Next slide">
                    <ChevronRight size={24} />
                </button>

                {/* Dots */}
                <div className="carousel-dots">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            className={`dot ${currentSlide === idx ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* Heritage Section [NEW] */}
            <section className="heritage-section container py-20">
                <div className="heritage-grid">
                    <div className="heritage-text animate-fade-in">
                        <h2 className="section-title text-gradient">A Legacy of Pure Silk</h2>
                        <p className="text-muted leading-relaxed mt-4">
                            Since 1985, KPG Silk Centre has been the guardian of traditional weaving.
                            Our journey began in the heart of traditional silk hubs, where every thread
                            tells a story of meticulous craftsmanship and timeless elegance.
                        </p>
                        <div className="heritage-stats mt-8">
                            <div className="stat-item">
                                <h3>35+</h3>
                                <p>Years of Legacy</p>
                            </div>
                            <div className="stat-item">
                                <h3>10k+</h3>
                                <p>Happy Customers</p>
                            </div>
                        </div>
                    </div>
                    <div className="heritage-visual glass-panel">
                        <img src="/heritage-logo.png" alt="KPG Silk Centre Heritage Logo" className="heritage-logo-img" />
                    </div>
                </div>
            </section>

            {/* Features Section [NEW] */}
            <section className="features-section glass-panel py-20 mb-20">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon"><Smartphone /></div>
                            <h3>AR Fitting Room</h3>
                            <p className="text-muted">Virtually try on any saree or dress using your phone camera.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><Sparkles /></div>
                            <h3>Pure Mulberry Silk</h3>
                            <p className="text-muted">Certified 100% pure silk with authentic gold and silver zari.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon"><Box /></div>
                            <h3>Global Shipping</h3>
                            <p className="text-muted">Delivering the elegance of KPG Silk to over 20 countries.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Collection Section */}
            <section className="featured-section container pb-20">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">The Wedding Edit</h2>
                        <p className="text-muted">Hand-picked premium wedding silks for your special day.</p>
                    </div>
                    <Link to="/shop" className="view-all-link">View All Collections <ArrowRight size={16} /></Link>
                </div>

                <div className="product-grid mt-10">
                    {[
                        { id: 15, name: "Deepam Pure Wedding Silk", price: "₹28,500", img: "https://www.deepam.com/cdn/shop/articles/D19-100sarees1230_750x_da1db025-9197-4a45-b7ea-c2766c82b890_1080x.webp?v=1677647370" },
                        { id: 1, name: "Regal Gold Zari Saree", price: "₹12,499", img: "https://www.mohifashion.com/cdn/shop/articles/Banner.jpg?v=1741175069&width=1100" },
                        { id: 2, name: "Crimson Silk Drape", price: "₹15,000", img: "https://www.deepam.com/cdn/shop/articles/V8A2155_750x_330de574-6cc6-499e-a3eb-8cf3bff1d45f.webp?v=1741686141" }
                    ].map((item) => (
                        <div key={item.id} className="product-card glass-panel">
                            <div className={`product-image-placeholder with-image`}>
                                <img src={item.img} alt={item.name} className="product-image" />
                                <div className="ar-badge">
                                    <Smartphone size={14} /> AR Ready
                                </div>
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{item.name}</h3>
                                <div className="product-price">{item.price}</div>
                                <Link to={`/product/${item.id}`} className="btn btn-primary w-full">View Details</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
