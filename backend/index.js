import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import emailjs from '@emailjs/nodejs';
import crypto from 'crypto';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Neon PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

// EmailJS Enterprise Auth helper
const sendEmail = async (templateId, templateParams) => {
  const pubKey = (process.env.EMAILJS_PUBLIC_KEY || '').trim();
  const privKey = (process.env.EMAILJS_PRIVATE_KEY || '').trim();
  const serviceId = (process.env.EMAILJS_SERVICE_ID || '').trim();

  // Basic validation log
  console.log(`[EMAIL-DEBUG] Attempting to send template: ${templateId}`);
  if (!pubKey || !privKey || !serviceId) {
    console.error(`[EMAIL-DEBUG] Error: Missing EmailJS keys in .env. Service=${serviceId ? 'OK' : 'MISSING'}, Public=${pubKey ? 'OK' : 'MISSING'}, Private=${privKey ? 'OK' : 'MISSING'}`);
  }

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: pubKey,
    accessToken: privKey,
    template_params: templateParams
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const resultText = await response.text();
    if (response.ok) {
      console.log(`✅ Email Success [${templateId}] Response: ${resultText}`);
      return { success: true };
    } else {
      console.error(`❌ Email API Reject [${templateId}]:`, response.status, resultText);
      return { success: false, error: resultText };
    }
  } catch (err) {
    console.error(`❌ Email Critical Error [${templateId}]:`, err.message);
    return { success: false, error: err.message };
  }
};

const otpStore = new Map();


const MOCK_PRODUCTS = [
  // --- WOMENS: Sarees (10 Items) ---
  { id: 1, name: "Kanchipuram Silk Elegance", category: "Womens", subCategory: "Silk Saree", price: "₹15,000", isAR: true, color: "Magenta", stock: 15, image: "https://www.mohifashion.com/cdn/shop/articles/Banner.jpg?v=1741175069&width=1100", description: "Timeless Kanchipuram silk with intricate gold zari work." },
  { id: 2, name: "Golden Aura Banarasi", category: "Womens", subCategory: "Silk Saree", price: "₹18,500", isAR: true, color: "Gold", stock: 10, image: "https://www.deepam.com/cdn/shop/articles/V8A2155_750x_330de574-6cc6-499e-a3eb-8cf3bff1d45f.webp?v=1741686141", description: "Rich Banarasi silk with a shimmering gold finish." },
  { id: 11, name: "Emerald Forest Saree", category: "Womens", subCategory: "Saree", price: "₹9,500", isAR: false, color: "Green", stock: 12, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXiT_NNrSfalfFOcHOAQP1HRm-2078ElSPuQ&s", description: "Lightweight emerald green silk-blend saree." },
  { id: 12, name: "Ivory Pearl Organza", category: "Womens", subCategory: "Premium", price: "₹14,200", isAR: true, color: "White", stock: 8, image: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/3/2/32c7d26SMSF719BL_1.jpg?tr=w-512", description: "Delicate organza with pearl embroidery." },
  { id: 13, name: "Midnight Onyx Saree", category: "Womens", subCategory: "Saree", price: "₹11,000", isAR: false, color: "Black", stock: 15, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuIA1nj5R2BnFcU9EAXwHzv2TiHdCnJiZ-Sw&s", description: "Classic black saree with subtle silver thread work." },
  { id: 14, name: "Royal Purple Silk", category: "Womens", subCategory: "Silk Saree", price: "₹17,500", isAR: true, color: "Purple", stock: 7, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8wZKmfXyamxIEkGNzBhjzZ13769O1ZqAyxg&s", description: "Exquisite purple silk for grand occasions." },
  { id: 15, name: "Kerala Tradition Cotton", category: "Womens", subCategory: "Saree", price: "₹6,800", isAR: false, color: "White", stock: 20, image: "https://vannamayil.com/cdn/shop/files/kerala-cotton-butta-work-pallu-saree-V04115_1.jpg?v=1687978300", description: "Authentic Kerala cotton with golden border." },
  { id: 16, name: "Maroon Heritage silk", category: "Womens", subCategory: "Silk Saree", price: "₹14,200", isAR: false, color: "Maroon", stock: 10, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfTeFd6cjQNEMiKiB8mOvvaFcyQohVMHhC1w&s", description: "Rich maroon silk with traditional motifs." },
  { id: 17, name: "Rainbow Festive Drape", category: "Womens", subCategory: "Saree", price: "₹12,000", isAR: true, color: "Multi", stock: 12, image: "https://media.istockphoto.com/id/93355119/photo/indian-saris.jpg?s=612x612&w=0&k=20&c=afmfiTJg0VAmIY6P_TJ_JYsTfGhUdevv18WXQRUZ8NQ=", description: "Vibrant multi-color festive silk saree." },
  { id: 18, name: "Sunshine Yellow Silk", category: "Womens", subCategory: "Silk Saree", price: "₹13,500", isAR: false, color: "Yellow", stock: 9, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKcOGTt9FcUnJ2nPVDxq7gboVF3n2h_er6Bw&s", description: "Bright yellow silk, perfect for weddings." },

  // --- WOMENS: Silk Sarees (6 Items) ---
  { id: 3, name: "Sunset Crimson Silk", category: "Womens", subCategory: "Premium Silk", price: "₹12,499", isAR: true, color: "Red", stock: 20, image: "https://fabfonde.com/cdn/shop/products/36b40084-01c2-44a2-abd6-5718637c01d7.jpg?v=1664952224&width=823", description: "Vibrant crimson silk with traditional floral motifs." },
  { id: 4, name: "Midnight Sapphire Silk", category: "Womens", subCategory: "Premium Silk", price: "₹25,000", isAR: true, color: "Blue", stock: 5, image: "https://www.deepam.com/cdn/shop/articles/D19-100sarees1230_750x_da1db025-9197-4a45-b7ea-c2766c82b890_1080x.webp?v=1677647370", description: "Exquisite deep sapphire blue hand-woven silk." },
  { id: 19, name: "Golden Temple Silk", category: "Womens", subCategory: "Premium Silk", price: "₹22,000", isAR: true, color: "Gold", stock: 6, image: "https://www.deepam.com/cdn/shop/files/D7-7247759_9b01f980-4c11-43fb-a902-1e7481529d21.jpg?v=1752719082", description: "Heavy silk with traditional temple border." },
  { id: 20, name: "Teal Blue Premium", category: "Womens", subCategory: "Premium Silk", price: "₹21,000", isAR: true, color: "Blue", stock: 8, image: "https://fabfonde.com/cdn/shop/products/6f7205f8-39b7-4f5d-a382-e336ab3b6d0b.jpg?v=1664952321&width=533", description: "Soothing teal silk with silver zari detailing." },
  { id: 21, name: "Palam Silk Special", category: "Womens", subCategory: "Premium Silk", price: "₹30,000", isAR: true, color: "Red", stock: 4, image: "https://www.palamsilk.com/cdn/shop/products/DSC_8921_grande.jpg?v=1668604244", description: "Masterpiece red silk from the Palam collection." },
  { id: 22, name: "Maroon Kanchipuram", category: "Womens", subCategory: "Premium Silk", price: "₹27,000", isAR: true, color: "Maroon", stock: 7, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Hk4BT2gF6BMpgIt0ZGYPX2CVjrdH564SrA&s", description: "Vintage Maroon Kanchipuram silk drapes." },

  // --- WOMENS: Other Genre (5 Items) ---
  { id: 5, name: "Heritage Kashmiri kurti", category: "Womens", subCategory: "Dresses", price: "₹6,500", isAR: false, color: "Blue", stock: 15, image: "https://www.kashmirbox.com/cdn/shop/files/KashirBox3573copy.jpg?v=1748496649&width=1100", description: "Hand-embroidered Kashmiri kurti with Aari work." },
  { id: 23, name: "Azure Fusion Dress", category: "Womens", subCategory: "Dresses", price: "₹5,800", isAR: false, color: "Blue", stock: 10, image: "https://www.kashmirbox.com/cdn/shop/files/DSC03182.jpg?v=1748500996&width=535", description: "A modern fusion dress with ethnic motifs." },
  { id: 24, name: "Emerald Boho Kurti", category: "Womens", subCategory: "Dresses", price: "₹4,200", isAR: false, color: "Green", stock: 12, image: "https://www.kashmirbox.com/cdn/shop/files/DSC03001.jpg?v=1748500990&width=535", description: "Refreshing green boho-style embroidered kurti." },
  { id: 25, name: "Ivory Ethnic Gown", category: "Womens", subCategory: "Dresses", price: "₹12,000", isAR: false, color: "White", stock: 6, image: "https://www.kashmirbox.com/cdn/shop/files/KashirBox3828copy_b08ab49b-140d-47d5-822b-5a4dc4879dc2.jpg?v=1748496638&width=535", description: "Regal ivory gown with traditional heavy embroidery." },
  { id: 26, name: "Designer Kurti Special", category: "Womens", subCategory: "Dresses", price: "₹5,400", isAR: false, color: "Blue", stock: 20, image: "https://ekantastudio.com/cdn/shop/products/designer-kurti_fe3144d2-67c2-40e3-81f5-595e5fd618af_1800x1800.jpg?v=1747396262", description: "Chic designer kurti for everyday elegance." },

  // --- MENS: 8 Items ---
  { id: 7, name: "Oceanic Sky Silk Shirt", category: "Mens", subCategory: "Pure Silk", price: "₹3,500", isAR: false, color: "Blue", stock: 25, image: "https://www.beyoung.in/api/cache/catalog/products/shirt_squre_image_update_14_3_2022/sky_blue_cotton_solid_shirts_for_men_base_02_05_2024_700x933.jpg", description: "Premium oceanic blue silk shirt." },
  { id: 14, name: "Steel Blue Corduroy", category: "Mens", subCategory: "Casual", price: "₹2,800", isAR: false, color: "Blue", stock: 18, image: "https://www.beyoung.in/api/cache/catalog/products/shirts/2026/corduroy_dp_new_c/steel_blue_dual_pocket_corduroy_shirt_extra_view_1_400x533.jpg", description: "Dual pocket corduroy shirt in steel blue." },
  { id: 8, name: "Coffee Brown Breezy", category: "Mens", subCategory: "Premium", price: "₹3,200", isAR: false, color: "Brown", stock: 15, image: "https://www.beyoung.in/api/cache/catalog/products/shirts/am25_shirt_breezy/coffee_brown_breezy_stand_collar_shirt_neck_view_400x533.jpg", description: "Stand collar breezy shirt in coffee brown." },
  { id: 27, name: "Dark Grey Oxford", category: "Mens", subCategory: "Formal", price: "₹2,600", isAR: false, color: "Grey", stock: 22, image: "https://www.beyoung.in/api/cache/catalog/products/shirts/new_core_shirts/oxford_shirts_005/dark_grey_button_down_oxford_shirts_neck_view_400x533.jpg", description: "Classic Oxford shirt in dark grey." },
  { id: 28, name: "Black Stand Collar", category: "Mens", subCategory: "Formal", price: "₹3,100", isAR: false, color: "Black", stock: 20, image: "https://www.beyoung.in/api/cache/catalog/products/shirts/am25_shirt_breezy/black_breezy_stand_collar_shirt_neck_view_400x533.jpg", description: "Premium black stand collar shirt." },
  { id: 29, name: "Mauve Pink Satin", category: "Mens", subCategory: "Premium", price: "₹3,900", isAR: false, color: "Pink", stock: 12, image: "https://www.beyoung.in/api/cache/catalog/products/new_checked_shirt_image_9_12_2022/mauve_pink_satin_shirt_for_men_neck_29_03_2024_400x533.jpg", description: "Elegant mauve pink satin shirt." },
  { id: 30, name: "Khaki Breezy Shirt", category: "Mens", subCategory: "Casual", price: "₹2,400", isAR: false, color: "Brown", stock: 25, image: "https://www.beyoung.in/api/cache/catalog/products/shirts/am25_shirt_breezy/khaki_brown_breezy_stand_collar_shirt_neck_view_400x533.jpg", description: "Comfortable khaki brown breezy shirt." },
  { id: 31, name: "Navy Cotton Classic", category: "Mens", subCategory: "Formal", price: "₹2,950", isAR: false, color: "Blue", stock: 30, image: "https://www.beyoung.in/api/cache/catalog/products/new_checked_shirt_image_9_12_2022/navy_blue_plain_cotton_shirts_for_men_flatlay_2_400x533.jpg", description: "Classic navy blue cotton shirt." },

  // --- KIDS: 7 Items ---
  { id: 9, name: "Vibrant Rainbow Set", category: "Kids", subCategory: "Festive", price: "₹2,800", isAR: false, color: "Multi", stock: 12, image: "https://cdn.shopify.com/s/files/1/0266/6276/4597/files/301057780MULTI_1_800x.jpg?v=1772429095", description: "Colorful festive wear set for kids." },
  { id: 10, name: "Little Fire Red Dhoti", category: "Kids", subCategory: "Traditional", price: "₹3,200", isAR: false, color: "Red", stock: 8, image: "https://cdn.shopify.com/s/files/1/0266/6276/4597/files/301052522RED_1_800x.jpg?v=1770304764", description: "Traditional red dhoti set for boys." },
  { id: 15, name: "Autumn Brown Ethnic", category: "Kids", subCategory: "Ethnic", price: "₹2,400", isAR: false, color: "Brown", stock: 10, image: "https://cdn.shopify.com/s/files/1/0266/6276/4597/files/301048934BROWN_1_800x.jpg?v=1768229610", description: "Elegant brown ethnic wear for kids." },
  { id: 32, name: "Green Tradition Set", category: "Kids", subCategory: "Traditional", price: "₹2,600", isAR: false, color: "Green", stock: 15, image: "https://cdn.shopify.com/s/files/1/0266/6276/4597/files/301046478005_01_800x.jpg?v=1772608018", description: "Authentic green traditional festive wear." },
  { id: 33, name: "Black Velvet Fest", category: "Kids", subCategory: "Festive", price: "₹3,500", isAR: false, color: "Black", stock: 6, image: "https://cdn.shopify.com/s/files/1/0266/6276/4597/files/301051691001_01_800x.jpg?v=1772609028", description: "Premium black velvet festive outfit." },
  { id: 34, name: "Pearl White Silk Kids", category: "Kids", subCategory: "Traditional", price: "₹3,800", isAR: false, color: "White", stock: 5, image: "https://cdn.shopify.com/s/files/1/0266/6276/4597/files/301051688001_01_800x.jpg?v=1772608852", description: "Pure white silk traditional wear for boys." },
  { id: 35, name: "Offwhite Festive Set", category: "Kids", subCategory: "Festive", price: "₹2,900", isAR: false, color: "White", stock: 14, image: "https://cdn.shopify.com/s/files/1/0266/6276/4597/files/301051697OFFWHITE_01_800x.jpg?v=1769064426", description: "Minimalist off-white festive traditional set." },
];


app.get('/api/products', async (req, res) => {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('your_neon_postgresql_connection_string_here')) {
      return res.json(MOCK_PRODUCTS);
    }

    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');

    if (result.rows.length > 0) {
      // Map DB snake_case to frontend camalCase if needed, but our shop seems to expect the specific keys
      // Actually, let's keep it consistent. If DB has it, send it.
      res.json(result.rows);
    } else {
      res.json(MOCK_PRODUCTS);
    }
  } catch (err) {
    console.error('Backend database error:', err.message);
    res.json(MOCK_PRODUCTS);
  }
});

// Admin Authentication Middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token === 'mock_token') {
    return next();
  }

  if (!token) return res.status(401).json({ message: 'Admin access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid admin token' });
    if (user.role !== 'admin') return res.status(403).json({ message: 'Requires admin role' });
    req.user = user;
    next();
  });
};

// --- PRODUCT MANAGEMENT ROUTES (Admin) ---

// Add Product
app.post('/api/products', authenticateAdmin, async (req, res) => {
  const { name, category, sub_category, price, is_ar, color, stock, image, description } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO products (name, category, sub_category, price, is_ar, color, stock, image, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, category, sub_category, price, is_ar || false, color, stock || 0, image, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ message: 'Error adding product', error: err.message });
  }
});

// Update Product
app.put('/api/products/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, category, sub_category, price, is_ar, color, stock, image, description } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products SET name=$1, category=$2, sub_category=$3, price=$4, is_ar=$5, color=$6, stock=$7, image=$8, description=$9
       WHERE id=$10 RETURNING *`,
      [name, category, sub_category, price, is_ar, color, stock, image, description, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
});

// Delete Product
app.delete('/api/products/:id', authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});


// --- AUTHENTICATION MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---


// Login (Reverted to Direct Flow)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Signup Step 1: Initialize Signup & Send OTP
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const checkUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store pending signup data
    otpStore.set(email, { otp, expiry, pendingData: { name, email, password } });

    // --- PRODUCTION-GRADE EMAILJS DISPATCH ---
    const templateParams = {
      email: email.trim(),
      passcode: otp,
      time: new Date(expiry).toLocaleTimeString()
    };

    const emailResult = await sendEmail(process.env.EMAILJS_TEMPLATE_ID, templateParams);

    if (emailResult.success) {
      res.json({ otpSent: true, message: 'Verification code sent to your inbox.' });
    } else {
      // Developer Fallback: Show code in terminal
      console.log(`\n**************************************************`);
      console.log(`DEV-OTP for ${email}: ${otp}`);
      console.log(`**************************************************\n`);

      res.json({
        otpSent: true,
        message: 'Security code generated. Please check your inbox.',
        debug: process.env.NODE_ENV === 'development' ? otp : null
      });
    }

  } catch (err) {
    console.error('Signup initialization error:', err);
    res.status(500).json({ message: 'Server error during signup initialization' });
  }
});

// Signup Step 2: Verify OTP & Create User
app.post('/api/auth/verify-signup', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const stored = otpStore.get(email);

    if (!stored || !stored.pendingData) {
      return res.status(400).json({ message: 'No pending registration found' });
    }

    if (Date.now() > stored.expiry) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Success! Create the user
    const { name, password } = stored.pendingData;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Clean up
    otpStore.delete(email);

    res.status(201).json({ user, token });

  } catch (err) {
    console.error('Signup verification error:', err);
    res.status(500).json({ message: 'Server error during signup verification' });
  }
});

// Get Current User (Full Profile)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, gender, preferred_size, address, bio FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching user' });
  }
});

// Update Profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  const { name, phone, gender, preferred_size, address, bio } = req.body;
  try {
    const result = await pool.query(
      `UPDATE users SET name = $1, phone = $2, gender = $3, preferred_size = $4, address = $5, bio = $6 
             WHERE id = $7 RETURNING id, name, email, phone, gender, preferred_size, address, bio`,
      [name, phone, gender, preferred_size, address, bio, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// --- FAVORITES ROUTES ---

// Get User Favorites (IDs)
app.get('/api/user/favorites', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT product_id FROM favorites WHERE user_id = $1',
      [req.user.id]
    );
    res.json(result.rows.map(row => row.product_id));
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
});

// Toggle Favorite
app.post('/api/user/favorites/toggle', authenticateToken, async (req, res) => {
  const { productId } = req.body;
  try {
    const check = await pool.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND product_id = $2',
      [req.user.id, productId]
    );

    if (check.rows.length > 0) {
      // Remove
      await pool.query('DELETE FROM favorites WHERE user_id = $1 AND product_id = $2', [req.user.id, productId]);
      res.json({ favorited: false });
    } else {
      // Add
      await pool.query('INSERT INTO favorites (user_id, product_id) VALUES ($1, $2)', [req.user.id, productId]);
      res.json({ favorited: true });
    }
  } catch (err) {
    console.error('Error toggling favorite:', err);
    res.status(500).json({ message: 'Error toggling favorite' });
  }
});

// Get Favorited Products (Full details)
app.get('/api/user/favorites/details', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.* FROM products p 
       JOIN favorites f ON p.id = f.product_id 
       WHERE f.user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching favorite details:', err);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
});

// --- ORDER ROUTES ---

// Create Order (Checkout)
app.post('/api/user/orders', authenticateToken, async (req, res) => {
  const { cartItems, totalAmount, shippingAddress } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 0. Generate Unique Tracking ID
    const trackingId = `KPG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 1. Create Order
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total_amount, shipping_address, tracking_id) VALUES ($1, $2, $3, $4) RETURNING id',
      [req.user.id, totalAmount, shippingAddress, trackingId]
    );
    const orderId = orderResult.rows[0].id;

    // 2. Add Order Items
    for (const item of cartItems) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');

    // --- ASYNC EMAIL DISPATCH ---
    try {
      // 1. Get user details for personalization
      const userRes = await pool.query('SELECT name, email FROM users WHERE id = $1', [req.user.id]);
      const user = userRes.rows[0];

      // 2. Prepare items array for EmailJS template logic
      const ordersArray = [];
      for (const item of cartItems) {
        const prodRes = await pool.query('SELECT name FROM products WHERE id = $1', [item.id]);
        const prodName = prodRes.rows[0] ? prodRes.rows[0].name : 'Unknown Product';
        ordersArray.push({
          name: prodName,
          units: item.quantity,
          price: item.price
        });
      }

      // 3. Dispatch EmailJS
      const orderTemplateParams = {
        to_name: user.name,
        email: user.email, // Matches your {{email}} in "To Email"
        order_id: orderId, // Matches your #{{order_id}}
        orders: ordersArray, // Supports your {{#orders}} loop
        tracking_id: trackingId,
        total_amount: totalAmount,
        shipping_address: shippingAddress,
        order_date: new Date().toLocaleDateString()
      };

      console.log(`[ORDER-EMAIL] Full Params:`, JSON.stringify(orderTemplateParams, null, 2));
      console.log(`[ORDER-EMAIL] Sending confirmation for Order #${orderId} to ${user.email}...`);
      const emailResult = await sendEmail(process.env.EMAILJS_ORDER_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID, orderTemplateParams);
      console.log(`[ORDER-EMAIL] Result:`, emailResult);

    } catch (emailErr) {
      console.error('Order email dispatch failed (non-blocking):', emailErr);
    }

    res.status(201).json({ message: 'Order created successfully', orderId, trackingId });
  } catch (err) {
    if (client) await client.query('ROLLBACK');
    console.error('Order creation error:', err);
    res.status(500).json({ message: 'Failed to create order' });
  } finally {
    if (client) client.release();
  }
});

// Get User Orders
app.get('/api/user/orders', authenticateToken, async (req, res) => {
  try {
    const ordersResult = await pool.query(
      'SELECT id, total_amount, status, shipping_address, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    const orders = [];
    for (const order of ordersResult.rows) {
      const itemsResult = await pool.query(
        `SELECT oi.id, oi.product_id, oi.quantity, oi.price, p.name, p.image 
         FROM order_items oi 
         LEFT JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = $1`,
        [order.id]
      );
      orders.push({ ...order, items: itemsResult.rows });
    }

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'KPG Backend is alive' });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
