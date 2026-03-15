import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import './index.css';

// Lazy load pages to isolate potential crashes
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const XRViewer = lazy(() => import('./pages/XRViewer'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Cart = lazy(() => import('./pages/Cart'));
const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const VirtualRunway = lazy(() => import('./pages/VirtualRunway'));
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <ThemeProvider>
            <Router>
              <div className="app-container">
                <Navbar />
                <main>
                  <Suspense fallback={
                    <div style={{ padding: '100px', textAlign: 'center', color: '#D4AF37' }}>
                      <h2>Loading Experience...</h2>
                    </div>
                  }>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/ar-view/:id" element={<XRViewer />} />
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/virtual-runway" element={<VirtualRunway />} />
                      <Route path="*" element={
                        <div style={{ padding: '100px', textAlign: 'center', color: 'white' }}>
                          <h1 className="text-gradient">404 - Page Not Found</h1>
                          <p className="text-muted">The silk room you are looking for doesn't exist.</p>
                          <Link to="/shop" className="btn btn-primary mt-4">Return to Shop</Link>
                        </div>
                      } />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </Router>
          </ThemeProvider>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
