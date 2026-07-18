-- ========================================================
-- AGRI MARKET CONNECT — MYSQL DATABASE SCHEMA (DDL)
-- Database: agri_market_db
-- ========================================================

CREATE DATABASE IF NOT EXISTS agri_market_db;
USE agri_market_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL, -- FARMER, BUYER, WORKER, ADMIN
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, BLOCKED, PENDING
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    latitude DOUBLE,
    longitude DOUBLE,
    profile_photo TEXT,
    govt_id_number VARCHAR(50),
    verified BOOLEAN DEFAULT FALSE,
    wallet_balance DECIMAL(12,2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- VEGETABLES, FRUITS, CROPS, ORGANIC, SEEDS, FERTILIZERS, EQUIPMENT
    icon VARCHAR(100)
);

-- 4. Products Table (Marketplace)
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id BIGINT NOT NULL,
    category_id BIGINT,
    name VARCHAR(150) NOT NULL,
    category_type VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity DOUBLE NOT NULL,
    unit VARCHAR(20) DEFAULT 'KG',
    harvest_date DATE,
    is_organic BOOLEAN DEFAULT FALSE,
    is_fresh BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    description TEXT,
    location_name VARCHAR(200),
    latitude DOUBLE,
    longitude DOUBLE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Animal Listings Table (Livestock Marketplace)
CREATE TABLE IF NOT EXISTS animal_listings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    animal_type VARCHAR(50) NOT NULL, -- COW, BUFFALO, BULL, GOAT, SHEEP, PIG, HORSE, CHICKEN, DUCK, TURKEY, RABBIT, CAMEL, FISH, BEE_FARMING, FARM_DOGS
    breed VARCHAR(100),
    age_months INT,
    gender VARCHAR(10),
    weight_kg DOUBLE,
    health_cert_url TEXT,
    is_vaccinated BOOLEAN DEFAULT TRUE,
    milk_yield_liters DOUBLE DEFAULT 0.0,
    price DECIMAL(10,2) NOT NULL,
    is_negotiable BOOLEAN DEFAULT TRUE,
    location_name VARCHAR(200),
    latitude DOUBLE,
    longitude DOUBLE,
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Fertilizer Market Table
CREATE TABLE IF NOT EXISTS fertilizer_listings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    suitable_crops VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 100,
    offers_discount INT DEFAULT 0, -- percentage
    govt_subsidy_percentage DOUBLE DEFAULT 0.0,
    predicted_future_price DECIMAL(10,2),
    dealer_name VARCHAR(150),
    dealer_phone VARCHAR(20),
    shop_location VARCHAR(200),
    latitude DOUBLE,
    longitude DOUBLE,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Worker Profiles Table
CREATE TABLE IF NOT EXISTS worker_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    skills VARCHAR(255),
    daily_wage DECIMAL(10,2) NOT NULL,
    experience_years INT DEFAULT 1,
    rating_avg DOUBLE DEFAULT 5.0,
    total_jobs_completed INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    current_lat DOUBLE,
    current_lng DOUBLE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Worker Bookings Table
CREATE TABLE IF NOT EXISTS worker_bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id BIGINT NOT NULL,
    worker_id BIGINT NOT NULL,
    work_type VARCHAR(100) NOT NULL,
    crop_type VARCHAR(100),
    requested_workers INT DEFAULT 1,
    wage_agreed DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    duration_days INT DEFAULT 1,
    urgency VARCHAR(20) DEFAULT 'MEDIUM',
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, ACCEPTED, REJECTED, IN_PROGRESS, COMPLETED, CANCELLED
    attendance_marked BOOLEAN DEFAULT FALSE,
    farmer_lat DOUBLE,
    farmer_lng DOUBLE,
    worker_lat DOUBLE,
    worker_lng DOUBLE,
    eta_minutes INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id),
    FOREIGN KEY (worker_id) REFERENCES users(id)
);

-- 9. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    buyer_id BIGINT NOT NULL,
    farmer_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, PAID, ESCROW_HELD, REFUNDED
    order_status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, DISPATCHED, DELIVERED, CANCELLED
    delivery_address TEXT,
    pickup_lat DOUBLE,
    pickup_lng DOUBLE,
    delivery_lat DOUBLE,
    delivery_lng DOUBLE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (farmer_id) REFERENCES users(id)
);

-- 10. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id BIGINT NOT NULL,
    quantity DOUBLE NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 11. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(50) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_id VARCHAR(50),
    booking_id BIGINT,
    amount DECIMAL(10,2) NOT NULL,
    type VARCHAR(20) NOT NULL, -- CREDIT, DEBIT, ESCROW
    payment_method VARCHAR(50) DEFAULT 'UPI',
    status VARCHAR(20) DEFAULT 'SUCCESS',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 12. Ratings & Reviews Table
CREATE TABLE IF NOT EXISTS ratings_reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reviewer_id BIGINT NOT NULL,
    target_id BIGINT NOT NULL,
    target_type VARCHAR(20) NOT NULL, -- WORKER, FARMER, BUYER, PRODUCT
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

-- 13. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'GENERAL',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 14. Market Prices Table (Live Mandi Data)
CREATE TABLE IF NOT EXISTS market_prices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    commodity_name VARCHAR(100) NOT NULL,
    market_name VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    modal_price DECIMAL(10,2) NOT NULL,
    date_updated DATE DEFAULT (CURRENT_DATE)
);
