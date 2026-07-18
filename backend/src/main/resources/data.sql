-- ========================================================
-- AGRI MARKET CONNECT — INITIAL SEED DATA (DML)
-- Pre-fills MySQL with realistic platform accounts, crops, animals, fertilizers, & workers
-- ========================================================

USE agri_market_db;

-- 1. Demo Accounts (Passwords hashed with BCrypt or demo standard '$2a$10$e.g...' / plain fallback for auth service)
-- Admin: admin@agri.com / admin123
-- Farmer: farmer@agri.com / farmer123
-- Buyer: buyer@agri.com / buyer123
-- Worker: worker@agri.com / worker123

INSERT INTO users (id, username, password, name, email, phone, role, status) VALUES
(1, 'farmer@agri.com', '$2a$10$7Z8bQ2y1vK3W4x5y6z7u8.abcdefghijklmnopqrstuvwxyz123', 'Rajesh Kumar (Farmer)', 'farmer@agri.com', '9876543210', 'FARMER', 'ACTIVE'),
(2, 'buyer@agri.com', '$2a$10$7Z8bQ2y1vK3W4x5y6z7u8.abcdefghijklmnopqrstuvwxyz123', 'Hotel Fresh & Co (Buyer)', 'buyer@agri.com', '9876543211', 'BUYER', 'ACTIVE'),
(3, 'worker@agri.com', '$2a$10$7Z8bQ2y1vK3W4x5y6z7u8.abcdefghijklmnopqrstuvwxyz123', 'Suresh V (Agricultural Labour)', 'worker@agri.com', '9876543212', 'WORKER', 'ACTIVE'),
(4, 'admin@agri.com', '$2a$10$7Z8bQ2y1vK3W4x5y6z7u8.abcdefghijklmnopqrstuvwxyz123', 'System Administrator', 'admin@agri.com', '9876543213', 'ADMIN', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO user_profiles (id, user_id, address, city, state, pincode, latitude, longitude, verified, wallet_balance) VALUES
(1, 1, 'Green Agro Farm, Attur Road', 'Salem', 'Tamil Nadu', '636001', 11.6643, 78.1460, TRUE, 15400.00),
(2, 2, 'No 45, Fresh Mart Complex', 'Chennai', 'Tamil Nadu', '600001', 13.0827, 80.2707, TRUE, 68000.00),
(3, 3, '5th Ward, Village Union', 'Salem', 'Tamil Nadu', '636002', 11.6600, 78.1500, TRUE, 3200.00),
(4, 4, 'Agri Tech Headquarters', 'Coimbatore', 'Tamil Nadu', '641001', 11.0168, 76.9558, TRUE, 1000000.00)
ON DUPLICATE KEY UPDATE city=VALUES(city);

-- 2. Worker Profile
INSERT INTO worker_profiles (id, user_id, skills, daily_wage, experience_years, rating_avg, total_jobs_completed, is_available, current_lat, current_lng) VALUES
(1, 3, 'Harvesting, Tilling, Tractor Operation, Irrigation setup', 650.00, 6, 4.9, 38, TRUE, 11.6620, 78.1480)
ON DUPLICATE KEY UPDATE daily_wage=VALUES(daily_wage);

-- 3. Products
INSERT INTO products (id, farmer_id, category_id, name, category_type, price, quantity, unit, harvest_date, is_organic, is_fresh, image_url, description, location_name, latitude, longitude) VALUES
(1, 1, 1, 'Organic Country Tomatoes', 'VEGETABLES', 32.00, 250, 'KG', '2026-07-15', TRUE, TRUE, 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500', '100% Organic naturally grown tomatoes, rich in Lycopene.', 'Salem, Tamil Nadu', 11.6643, 78.1460),
(2, 1, 1, 'Fresh Red Onions', 'VEGETABLES', 26.00, 500, 'KG', '2026-07-14', FALSE, TRUE, 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500', 'High quality dried red onions suitable for long storage.', 'Salem, Tamil Nadu', 11.6643, 78.1460),
(3, 1, 2, 'Alphonso Mangoes (Grade A)', 'FRUITS', 120.00, 150, 'KG', '2026-07-12', TRUE, TRUE, 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=500', 'Sweet farm-fresh Alphonso mangoes without carbide ripening.', 'Salem, Tamil Nadu', 11.6643, 78.1460),
(4, 1, 3, 'Premium Sona Masoori Paddy Rice', 'CROPS', 24.50, 2000, 'KG', '2026-07-10', FALSE, FALSE, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500', 'Double polished high yield paddy crop direct from harvest field.', 'Salem, Tamil Nadu', 11.6643, 78.1460)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. Animal Listings (16 Animal Types Support)
INSERT INTO animal_listings (id, owner_id, animal_type, breed, age_months, gender, weight_kg, health_cert_url, is_vaccinated, milk_yield_liters, price, is_negotiable, location_name, latitude, longitude, status, photo_url) VALUES
(1, 1, 'COW', 'Gir Pure Breed', 36, 'FEMALE', 380.0, 'CERT-VET-9821.pdf', TRUE, 16.5, 65000.00, TRUE, 'Salem, Tamil Nadu', 11.6643, 78.1460, 'AVAILABLE', 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?w=500'),
(2, 1, 'BUFFALO', 'Murrah High Yield', 42, 'FEMALE', 450.0, 'CERT-VET-9822.pdf', TRUE, 18.0, 78000.00, TRUE, 'Salem, Tamil Nadu', 11.6643, 78.1460, 'AVAILABLE', 'https://images.unsplash.com/photo-1570042707222-6804d9c79247?w=500'),
(3, 1, 'GOAT', 'Jamnapari Goat', 14, 'MALE', 35.0, 'CERT-VET-9823.pdf', TRUE, 0.0, 14500.00, FALSE, 'Salem, Tamil Nadu', 11.6643, 78.1460, 'AVAILABLE', 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=500'),
(4, 1, 'CHICKEN', 'Kadaknath Country Hen', 8, 'FEMALE', 2.2, 'CERT-VET-9824.pdf', TRUE, 0.0, 850.00, FALSE, 'Salem, Tamil Nadu', 11.6643, 78.1460, 'AVAILABLE', 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500')
ON DUPLICATE KEY UPDATE breed=VALUES(breed);

-- 5. Fertilizer Listings & Government Subsidy
INSERT INTO fertilizer_listings (id, brand_name, product_name, suitable_crops, price, stock_quantity, offers_discount, govt_subsidy_percentage, predicted_future_price, dealer_name, dealer_phone, shop_location, latitude, longitude, image_url) VALUES
(1, 'IFFCO', 'Urea Nano Fertilizer (500ml)', 'Paddy, Wheat, Sugarcane, Vegetables', 240.00, 300, 10, 45.0, 260.00, 'Green Earth Agro Dealers', '9443211234', 'Mettur Road, Salem', 11.6700, 78.1400, 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'),
(2, 'Coromandel', 'Gromor 14-35-14 NPK (50kg)', 'Cotton, Maize, Chillies, Fruit Orchards', 1450.00, 120, 5, 30.0, 1520.00, 'Salem Farmers Bio Store', '9443211235', 'Main Bazaar, Salem', 11.6650, 78.1450, 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500')
ON DUPLICATE KEY UPDATE brand_name=VALUES(brand_name);

-- 6. Live Mandi Market Prices
INSERT INTO market_prices (id, commodity_name, market_name, state, min_price, max_price, modal_price) VALUES
(1, 'Tomato', 'Salem Mandi', 'Tamil Nadu', 28.00, 35.00, 32.00),
(2, 'Onion', 'Nashik Mandi', 'Maharashtra', 22.00, 29.00, 26.00),
(3, 'Paddy Rice', 'Tanjore Mandi', 'Tamil Nadu', 21.00, 26.00, 24.50),
(4, 'Mango', 'Krishnagiri Market', 'Tamil Nadu', 90.00, 140.00, 120.00)
ON DUPLICATE KEY UPDATE modal_price=VALUES(modal_price);
