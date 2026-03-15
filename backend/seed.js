import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const MOCK_PRODUCTS = [
    // --- WOMENS: Sarees (10 Items) ---
    { name: "Kanchipuram Silk Elegance", category: "Womens", subCategory: "Silk Saree", price: "₹15,000", isAR: true, color: "Magenta", stock: 15, image: "https://www.mohifashion.com/cdn/shop/articles/Banner.jpg?v=1741175069&width=1100", description: "Timeless Kanchipuram silk with intricate gold zari work." },
    { name: "Golden Aura Banarasi", category: "Womens", subCategory: "Silk Saree", price: "₹18,500", isAR: true, color: "Gold", stock: 10, image: "https://www.deepam.com/cdn/shop/articles/V8A2155_750x_330de574-6cc6-499e-a3eb-8cf3bff1d45f.webp?v=1741686141", description: "Rich Banarasi silk with a shimmering gold finish." },
    { name: "Emerald Forest Saree", category: "Womens", subCategory: "Saree", price: "₹9,500", isAR: false, color: "Green", stock: 12, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXiT_NNrSfalfFOcHOAQP1HRm-2078ElSPuQ&s", description: "Lightweight emerald green silk-blend saree." },
    { name: "Ivory Pearl Organza", category: "Womens", subCategory: "Premium", price: "₹14,200", isAR: true, color: "White", stock: 8, image: "https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/3/2/32c7d26SMSF719BL_1.jpg?tr=w-512", description: "Delicate organza with pearl embroidery." },
    { name: "Midnight Onyx Saree", category: "Womens", subCategory: "Saree", price: "₹11,000", isAR: false, color: "Black", stock: 15, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuIA1nj5R2BnFcU9EAXwHzv2TiHdCnJiZ-Sw&s", description: "Classic black saree with subtle silver thread work." },
    { name: "Royal Purple Silk", category: "Womens", subCategory: "Silk Saree", price: "₹17,500", isAR: true, color: "Purple", stock: 7, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8wZKmfXyamxIEkGNzBhjzZ13769O1ZqAyxg&s", description: "Exquisite purple silk for grand occasions." },
    { name: "Kerala Tradition Cotton", category: "Womens", subCategory: "Saree", price: "₹6,800", isAR: false, color: "White", stock: 20, image: "https://vannamayil.com/cdn/shop/files/kerala-cotton-butta-work-pallu-saree-V04115_1.jpg?v=1687978300", description: "Authentic Kerala cotton with golden border." },
    { name: "Maroon Heritage silk", category: "Womens", subCategory: "Silk Saree", price: "₹14,200", isAR: false, color: "Maroon", stock: 10, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfTeFd6cjQNEMiKiB8mOvvaFcyQohVMHhC1w&s", description: "Rich maroon silk with traditional motifs." },
    { name: "Rainbow Festive Drape", category: "Womens", subCategory: "Saree", price: "₹12,000", isAR: true, color: "Multi", stock: 12, image: "https://media.istockphoto.com/id/93355119/photo/indian-saris.jpg?s=612x612&w=0&k=20&c=afmfiTJg0VAmIY6P_TJ_JYsTfGhUdevv18WXQRUZ8NQ=", description: "Vibrant multi-color festive silk saree." },
    { name: "Sunshine Yellow Silk", category: "Womens", subCategory: "Silk Saree", price: "₹13,500", isAR: false, color: "Yellow", stock: 9, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKcOGTt9FcUnJ2nPVDxq7gboVF3n2h_er6Bw&s", description: "Bright yellow silk, perfect for weddings." },

    // --- WOMENS: Silk Sarees (6 Items) ---
    { name: "Sunset Crimson Silk", category: "Womens", subCategory: "Premium Silk", price: "₹12,499", isAR: true, color: "Red", stock: 20, image: "https://fabfonde.com/cdn/shop/products/36b40084-01c2-44a2-abd6-5718637c01d7.jpg?v=1664952224&width=823", description: "Vibrant crimson silk with traditional floral motifs." },
    { name: "Midnight Sapphire Silk", category: "Womens", subCategory: "Premium Silk", price: "₹25,000", isAR: true, color: "Blue", stock: 5, image: "https://www.deepam.com/cdn/shop/articles/D19-100sarees1230_750x_da1db025-9197-4a45-b7ea-c2766c82b890_1080x.webp?v=1677647370", description: "Exquisite deep sapphire blue hand-woven silk." },
    { name: "Golden Temple Silk", category: "Womens", subCategory: "Premium Silk", price: "₹22,000", isAR: true, color: "Gold", stock: 6, image: "https://www.deepam.com/cdn/shop/files/D7-7247759_9b01f980-4c11-43fb-a902-1e7481529d21.jpg?v=1752719082", description: "Heavy silk with traditional temple border." },
    { name: "Teal Blue Premium", category: "Womens", subCategory: "Premium Silk", price: "₹21,000", isAR: true, color: "Blue", stock: 8, image: "https://fabfonde.com/cdn/shop/products/6f7205f8-39b7-4f5d-a382-e336ab3b6d0b.jpg?v=1664952321&width=533", description: "Soothing teal silk with silver zari detailing." },
    { name: "Palam Silk Special", category: "Womens", subCategory: "Premium Silk", price: "₹30,000", isAR: true, color: "Red", stock: 4, image: "https://www.palamsilk.com/cdn/shop/products/DSC_8921_grande.jpg?v=1668604244", description: "Masterpiece red silk from the Palam collection." },
    { name: "Maroon Kanchipuram", category: "Womens", subCategory: "Premium Silk", price: "₹27,000", isAR: true, color: "Maroon", stock: 7, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Hk4BT2gF6BMpgIt0ZGYPX2CVjrdH564SrA&s", description: "Vintage Maroon Kanchipuram silk drapes." },

    // --- WOMENS: Other Genre (5 Items) ---
    { name: "Heritage Kashmiri kurti", category: "Womens", subCategory: "Dresses", price: "₹6,500", isAR: false, color: "Blue", stock: 15, image: "https://www.kashmirbox.com/cdn/shop/files/KashirBox3573copy.jpg?v=1748496649&width=1100", description: "Hand-embroidered Kashmiri kurti with Aari work." },
    { name: "Azure Fusion Dress", category: "Womens", subCategory: "Dresses", price: "₹5,800", isAR: false, color: "Blue", stock: 10, image: "https://www.kashmirbox.com/cdn/shop/files/DSC03182.jpg?v=1748500996&width=535", description: "A modern fusion dress with ethnic motifs." },
    { name: "Emerald Boho Kurti", category: "Womens", subCategory: "Dresses", price: "₹4,200", isAR: false, color: "Green", stock: 12, image: "https://www.kashmirbox.com/cdn/shop/files/DSC03001.jpg?v=1748500990&width=535", description: "Refreshing green boho-style embroidered kurti." },
    { name: "Ivory Ethnic Gown", category: "Womens", subCategory: "Dresses", price: "₹12,000", isAR: false, color: "White", stock: 6, image: "https://www.kashmirbox.com/cdn/shop/files/KashirBox3828copy_b08ab49b-140d-47d5-822b-5a4dc4879dc2.jpg?v=1748496638&width=535", description: "Regal ivory gown with traditional heavy embroidery." },
    { name: "Designer Kurti Special", category: "Womens", subCategory: "Dresses", price: "₹5,400", isAR: false, color: "Blue", stock: 20, image: "https://ekantastudio.com/cdn/shop/products/designer-kurti_fe3144d2-67c2-40e3-81f5-595e5fd618af_1800x1800.jpg?v=1747396262", description: "Chic designer kurti for everyday elegance." },

    // --- MENS: 8 Items ---
    { name: "Oceanic Sky Silk Shirt", category: "Mens", subCategory: "Pure Silk", price: "₹3,500", isAR: false, color: "Blue", stock: 25, image: "https://www.beyoung.in/api/cache/catalog/products/shirt_squre_image_update_14_3_2022/sky_blue_cotton_solid_shirts_for_men_base_02_05_2024_700x933.jpg", description: "Premium oceanic blue silk shirt." },
    { name: "Steel Blue Corduroy", category: "Mens", subCategory: "Casual", price: "₹2,800", isAR: false, color: "Blue", stock: 18, image: "https://www.beyoung.in/api/cache/catalog/products/shirts/2026/corduroy_dp_new_c/steel_blue_dual_pocket_corduroy_shirt_extra_view_1_400x533.jpg", description: "Dual pocket corduroy shirt in steel blue." },
    { name: "Coffee Brown Breezy", category: "Mens", subCategory: "Premium", price: "₹3,200", isAR: false, color: "Brown", stock: 15, image: "https://www.beyoung.in/api/cache/catalog/products/shirts/am25_shirt_breezy/coffee_brown_breezy_stand_collar_shirt_neck_view_400x533.jpg", description: "Stand collar breezy shirt in coffee brown." },
    { name: "Dark Grey Oxford", category: "Mens", subCategory: "Formal", price: "₹2,600", isAR: false, color: "Grey", stock: 22, image: "https://www.beyoung.in/api/cache/catalog/products/shirts/new_core_shirts/oxford_shirts_005/dark_grey_button_down_oxford_shirts_neck_view_400x533.jpg", description: "Classic Oxford shirt in dark grey." },
    { name: "Black Stand Collar", category: "Mens", subCategory: "Formal", price: "₹3,100", isAR: false, color: "Black", stock: 20, image: "https://www.beyoung.in/api/cache/catalog/products/shirts/am25_shirt_breezy/black_breezy_stand_collar_shirt_neck_view_400x533.jpg", description: "Premium black stand collar shirt." },
    { name: "Mauve Pink Satin", category: "Mens", subCategory: "Premium", price: "₹3,900", isAR: false, color: "Pink", stock: 12, image: "https://www.beyoung.in/api/cache/catalog/products/new_checked_shirt_image_9_12_2022/mauve_pink_satin_shirt_for_men_neck_29_03_2024_400x533.jpg", description: "Elegant mauve pink satin shirt." },
    { name: "Khaki Breezy Shirt", category: "Mens", subCategory: "Casual", price: "₹2,400", isAR: false, color: "Brown", stock: 25, image: "https://www.beyoung.in/api/cache/catalog/products/shirts/am25_shirt_breezy/khaki_brown_breezy_stand_collar_shirt_neck_view_400x533.jpg", description: "Comfortable khaki brown breezy shirt." },
    { name: "Navy Cotton Classic", category: "Mens", subCategory: "Formal", price: "₹2,950", isAR: false, color: "Blue", stock: 30, image: "https://www.beyoung.in/api/cache/catalog/products/new_checked_shirt_image_9_12_2022/navy_blue_plain_cotton_shirts_for_men_flatlay_2_400x533.jpg", description: "Classic navy blue cotton shirt." },

    // --- KIDS: 7 Items ---
    { name: "Vibrant Rainbow Set", category: "Kids", subCategory: "Festive", price: "₹2,800", isAR: false, color: "Multi", stock: 12, image: "https://cdn.shopify.com/s/files/1/0266/6276/4597/files/301057780MULTI_1_800x.jpg?v=1772429095", description: "Colorful festive wear set for kids." },
    { name: "Little Fire Red Dhoti", category: "Kids", subCategory: "Traditional", price: "₹3,200", isAR: false, color: "Red", stock: 8, image: "https://cdn.shopify.com/s/files/1/0266/6276/4597/files/301052522RED_1_800x.jpg?v=1770304764", description: "Traditional red dhoti set for boys." },
    { name: "Autumn Brown Ethnic", category: "Kids", subCategory: "Ethnic", price: "₹2,400", isAR: false, color: "Brown", stock: 10, image: "https://cdn.shopify.com/s/files/1/0266/6276/4597/files/301048934BROWN_1_800x.jpg?v=1768229610", description: "Elegant brown ethnic wear for kids." },
    { name: "Green Tradition Set", category: "Kids", subCategory: "Traditional", price: "₹2,600", isAR: false, color: "Green", stock: 15, image: "https://cdn.shopify.com/s/files/1/0266/6276/4597/files/301046478005_01_800x.jpg?v=1772608018", description: "Authentic green traditional festive wear." },
    { name: "Black Velvet Fest", category: "Kids", subCategory: "Festive", price: "₹3,500", isAR: false, color: "Black", stock: 6, image: "https://cdn.shopify.com/s/files/1/0266/6276/4597/files/301051691001_01_800x.jpg?v=1772609028", description: "Premium black velvet festive outfit." },
    { name: "Pearl White Silk Kids", category: "Kids", subCategory: "Traditional", price: "₹3,800", isAR: false, color: "White", stock: 5, image: "https://cdn.shopify.com/s/files/1/0266/6276/4597/files/301051688001_01_800x.jpg?v=1772608852", description: "Pure white silk traditional wear for boys." },
    { name: "Offwhite Festive Set", category: "Kids", subCategory: "Festive", price: "₹2,900", isAR: false, color: "White", stock: 14, image: "https://cdn.shopify.com/s/files/1/0266/6276/4597/files/301051697OFFWHITE_01_800x.jpg?v=1769064426", description: "Minimalist off-white festive traditional set." },
];

async function seedDatabase() {
    console.log("Starting database seed process...");

    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('your_neon_postgresql_connection_string_here')) {
        console.error("ERROR: DATABASE_URL is missing or invalid in .env file.");
        process.exit(1);
    }

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { require: true },
    });

    try {
        console.log("Connecting to database...");
        await pool.query('SELECT NOW()'); // Test connection

        console.log("Creating products table if it doesn't exist...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(50) NOT NULL,
                "subCategory" VARCHAR(50),
                price VARCHAR(50),
                "isAR" BOOLEAN DEFAULT false,
                color VARCHAR(50),
                stock INTEGER DEFAULT 0,
                image TEXT,
                description TEXT
            );
        `);

        // Check if data already exists
        const { rows } = await pool.query('SELECT COUNT(*) FROM products');
        if (parseInt(rows[0].count) > 0) {
            console.log("Database already contains product data. Skipping seed.");
            process.exit(0);
        }

        console.log(`Inserting ${MOCK_PRODUCTS.length} products...`);
        for (const product of MOCK_PRODUCTS) {
            await pool.query(
                `INSERT INTO products (name, category, "subCategory", price, "isAR", color, stock, image, description)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [product.name, product.category, product.subCategory, product.price, product.isAR, product.color, product.stock, product.image, product.description]
            );
        }

        console.log("Database seeded successfully!");
    } catch (err) {
        console.error("Database seeding failed:", err);
    } finally {
        await pool.end();
    }
}

seedDatabase();
