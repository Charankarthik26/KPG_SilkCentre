> **KPG Silk Centre** is a premium full-stack e-commerce platform dedicated to traditional silk sarees, enhanced with cutting-edge **3D Visualization** and **Augmented Reality (AR)**. Experience the elegance of heritage silk from the comfort of your home.

---

## ✨ Key Features

### 🛍️ Immersive Shopping Experience
- **🚀 3D Saree Viewer**: Interact with high-fidelity 3D models of sarees using `@react-three/fiber`.
- **🕶️ Web AR/XR Support**: Visualize products in your own space using Augmented Reality.
- **🖼️ High-Res Gallery**: Stunning product imagery and detailed descriptions.

### 🔐 Secure & Personalized
- **🔑 OTP-Verified Signup**: Robust registration flow using EmailJS for secure one-time passwords.
- **🛡️ JWT Authentication**: Secure login and session management with Bcrypt password hashing.
- **👤 User Dashboard**: Manage your profile, view recent orders, and track your favorites.

### 🛒 E-Commerce Excellence
- **❤️ Favorites System**: Save your preferred designs for later.
- **💳 Seamless Checkout**: Integrated order processing with automated email confirmations.
- **📦 Order Tracking**: Unique tracking IDs generated for every purchase.

### 🛠️ Admin Control
- **📊 Product Management**: Dedicated admin routes for adding, updating, and deleting inventory.
- **🛡️ Role-Based Access**: Restricted access to sensitive portal features.

---

## 🚀 Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **3D Engine**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Styling**: Vanilla CSS (Custom UI Components)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router](https://reactrouter.com/)

### Backend
- **Environment**: [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Hosted on [Neon](https://neon.tech/))
- **Auth**: JWT (JSON Web Tokens) & BcryptJS
- **Email Service**: [EmailJS](https://www.emailjs.com/) (Node.js SDK)

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database (Neon.tech recommended)
- EmailJS Account (for OTP and Order Emails)

### 1. Clone the Repository
```bash
git clone https://github.com/Charankarthik26/KPG_SilkCentre.git
cd KPG_SilkCentre
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder and add:
```env
DATABASE_URL=your_postgresql_url
PORT=5000
JWT_SECRET=your_jwt_secret
EMAILJS_SERVICE_ID=your_id
EMAILJS_TEMPLATE_ID=your_signup_template_id
EMAILJS_ORDER_TEMPLATE_ID=your_order_template_id
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
```
Start the server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

---

## 📡 API Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch all products | Public |
| `POST` | `/api/auth/signup` | Initialize signup + OTP | Public |
| `POST` | `/api/auth/login` | User login | Public |
| `GET` | `/api/user/favorites` | Get favorite IDs | User |
| `POST` | `/api/user/orders` | Create new order | User |
| `POST` | `/api/products` | Add new product | Admin |

---

## 📁 Project Structure
```text
KPG_SilkCentre/
├── backend/            # Express server & DB logic
│   ├── index.js        # Main entry point
│   └── seed.js         # Database seeding script
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # User & Favorites state
│   │   ├── pages/      # Home, Product, Dashboard
│   │   └── models/     # 3D Assets (.glb)
│   └── public/         # Images & static assets
└── README.md
```

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the **ISC License**.

---
*Created with ❤️ by [Charankarthik26](https://github.com/Charankarthik26)*
Elevating tradition through technology.
