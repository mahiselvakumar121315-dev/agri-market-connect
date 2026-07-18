/* ====================================================
   AGRI MARKET CONNECT — Database & REST API Sync Engine
   Integrates directly with Spring Boot Java MySQL REST Server (Port 8080)
   ==================================================== */

window.AgriDB = {
    isServer: false,
    serverUrl: 'http://localhost:8080',
    expressUrl: 'http://localhost:3000',
    db: null,
    jwtToken: sessionStorage.getItem('agri_jwt_token') || null,

    initPromise: null,

    init: function() {
        if (this.initPromise) return this.initPromise;
        this.initPromise = (async () => {
            console.log("⚙️ [AgriDB] Probing for Spring Boot MySQL REST Backend on port 8080...");
            try {
                const controller = new AbortController();
                const id = setTimeout(() => controller.abort(), 1000);
                const response = await fetch(`${this.serverUrl}/api/v1/products`, { signal: controller.signal });
                clearTimeout(id);
                if (response.ok) {
                    this.isServer = true;
                    console.log("🚀 [AgriDB] Connected to Spring Boot MySQL Engine!");
                }
            } catch (e) {
                console.log("🔌 [AgriDB] Spring Boot probe offline. Running in hybrid Local/MarketData Mode.");
                this.isServer = false;
            }
        })();
        return this.initPromise;
    },

    getAuthHeaders: function() {
        const headers = { 'Content-Type': 'application/json' };
        if (this.jwtToken) {
            headers['Authorization'] = `Bearer ${this.jwtToken}`;
        }
        return headers;
    },

    /* ── 1. AUTHENTICATION (Spring Boot JWT) ────────────── */
    login: async function(username, password, role) {
        if (this.isServer) {
            const res = await fetch(`${this.serverUrl}/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Login failed. Check credentials & role permissions.');
            }
            const data = await res.json();
            if (data.token) {
                this.jwtToken = data.token;
                sessionStorage.setItem('agri_jwt_token', data.token);
            }
            return data;
        } else {
            if (role === 'admin' && (username !== 'admin@agri.com' || password !== 'admin123')) {
                throw new Error("Invalid Admin credentials! Access denied.");
            }
            return { username, name: username.split('@')[0], role: role, token: 'demo-jwt-token' };
        }
    },

    register: async function(name, mobile, email, password, role) {
        const username = email || mobile;
        if (this.isServer) {
            const res = await fetch(`${this.serverUrl}/api/v1/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, mobile, email, password, role, username })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Registration failed');
            }
            const data = await res.json();
            if (data.token) {
                this.jwtToken = data.token;
                sessionStorage.setItem('agri_jwt_token', data.token);
            }
            return data;
        } else {
            return { username, name, role };
        }
    },

    /* ── 2. CROPS & MARKETPLACE ────────────────────────── */
    getCrops: async function(category) {
        let serverCrops = [];
        if (this.isServer) {
            try {
                const url = category && category !== 'all' ? `${this.serverUrl}/api/v1/products?category=${category}` : `${this.serverUrl}/api/v1/products`;
                const res = await fetch(url, { headers: this.getAuthHeaders() });
                if (res.ok) {
                    const raw = await res.json();
                    serverCrops = raw.map(c => ({
                        id: 'crop-db-' + c.id,
                        name: c.name,
                        category: (c.categoryType || 'vegetables').toLowerCase(),
                        price: c.price || 25,
                        quantity: c.quantity || 100,
                        unit: c.unit || 'KG',
                        harvestDate: c.harvestDate || new Date().toISOString().split('T')[0],
                        organic: !!c.isOrganic,
                        fresh: !!c.isFresh,
                        farmer: c.farmer ? (c.farmer.name || c.farmer.username) : 'Rajesh Kumar',
                        location: c.locationName || 'Salem, Tamil Nadu',
                        distance: '2.5 km',
                        img: c.imageUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=400'
                    }));
                }
            } catch(e) {
                console.warn("Server crop fetch failed:", e);
            }
        }

        const defaultCrops = window.MarketData && typeof window.MarketData.getAllCrops === 'function' ? window.MarketData.getAllCrops() : [];
        
        if (serverCrops.length === 0) {
            return defaultCrops;
        }

        // Combine server crops with default crops ensuring no duplicate IDs
        const combined = [...serverCrops];
        defaultCrops.forEach(dc => {
            if (!combined.some(sc => sc.name.toLowerCase() === dc.name.toLowerCase())) {
                combined.push(dc);
            }
        });
        return combined;
    },

    addCrop: async function(crop) {
        if (this.isServer) {
            const res = await fetch(`${this.serverUrl}/api/v1/products`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(crop)
            });
            return await res.json();
        }
        return crop;
    },

    /* ── 3. LIVESTOCK ANIMAL MARKETPLACE ───────────────── */
    getAnimals: async function(type) {
        if (this.isServer) {
            try {
                const url = type && type !== 'all' ? `${this.serverUrl}/api/v1/animals?type=${type}` : `${this.serverUrl}/api/v1/animals`;
                const res = await fetch(url, { headers: this.getAuthHeaders() });
                if (res.ok) return await res.json();
            } catch(e) {}
        }
        return [
            { id: 1, animalType: 'COW', breed: 'Gir Pure Breed', ageMonths: 36, gender: 'FEMALE', weightKg: 380, milkYieldLiters: 16.5, price: 65000, locationName: 'Salem, Tamil Nadu', photoUrl: 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?w=500', isVaccinated: true, ownerName: 'Rajesh Kumar', ownerPhone: '9876543210' },
            { id: 2, animalType: 'BUFFALO', breed: 'Murrah High Yield', ageMonths: 42, gender: 'FEMALE', weightKg: 450, milkYieldLiters: 18.0, price: 78000, locationName: 'Salem, Tamil Nadu', photoUrl: 'https://images.unsplash.com/photo-1570042707222-6804d9c79247?w=500', isVaccinated: true, ownerName: 'Rajesh Kumar', ownerPhone: '9876543210' },
            { id: 3, animalType: 'GOAT', breed: 'Jamnapari Goat', ageMonths: 14, gender: 'MALE', weightKg: 35, milkYieldLiters: 0, price: 14500, locationName: 'Salem, Tamil Nadu', photoUrl: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=500', isVaccinated: true, ownerName: 'Sundar Raj', ownerPhone: '9876543211' },
            { id: 4, animalType: 'CHICKEN', breed: 'Kadaknath Country Hen', ageMonths: 8, gender: 'FEMALE', weightKg: 2.2, milkYieldLiters: 0, price: 850, locationName: 'Salem, Tamil Nadu', photoUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=500', isVaccinated: true, ownerName: 'Sundar Raj', ownerPhone: '9876543211' }
        ];
    },

    addAnimalListing: async function(animal) {
        if (this.isServer) {
            const res = await fetch(`${this.serverUrl}/api/v1/animals`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(animal)
            });
            return await res.json();
        }
        return animal;
    },

    /* ── 4. FERTILIZER MARKET ─────────────────────────── */
    getFertilizers: async function() {
        if (this.isServer) {
            try {
                const res = await fetch(`${this.serverUrl}/api/v1/fertilizers`, { headers: this.getAuthHeaders() });
                if (res.ok) return await res.json();
            } catch(e) {}
        }
        return [
            { id: 1, brandName: 'IFFCO', productName: 'Urea Nano Fertilizer (500ml)', suitableCrops: 'Paddy, Wheat, Sugarcane, Vegetables', price: 240.00, stockQuantity: 300, offersDiscount: 10, govtSubsidyPercentage: 45.0, predictedFuturePrice: 260.00, dealerName: 'Green Earth Agro Dealers', dealerPhone: '9443211234', shopLocation: 'Mettur Road, Salem', imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500' },
            { id: 2, brandName: 'Coromandel', productName: 'Gromor 14-35-14 NPK (50kg)', suitableCrops: 'Cotton, Maize, Chillies, Fruits', price: 1450.00, stockQuantity: 120, offersDiscount: 5, govtSubsidyPercentage: 30.0, predictedFuturePrice: 1520.00, dealerName: 'Salem Farmers Bio Store', dealerPhone: '9443211235', shopLocation: 'Main Bazaar, Salem', imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=500' }
        ];
    },

    /* ── 5. WORKER BOOKING & GPS TRACKING ────────────── */
    getNearbyWorkers: async function(lat, lng) {
        if (this.isServer) {
            try {
                const res = await fetch(`${this.serverUrl}/api/v1/workers/nearby?lat=${lat}&lng=${lng}`, { headers: this.getAuthHeaders() });
                if (res.ok) return await res.json();
            } catch(e) {}
        }
        return [
            { id: 1, name: 'Suresh V (Agricultural Specialist)', phone: '9876543212', skills: 'Harvesting, Tilling, Tractor Operator', dailyWage: 650, experienceYears: 6, ratingAvg: 4.9, totalJobsCompleted: 38, isAvailable: true, currentLat: 11.6620, currentLng: 78.1480 },
            { id: 2, name: 'Mani K (Crop Protection)', phone: '9876543215', skills: 'Pesticide Spraying, Irrigation Setup', dailyWage: 700, experienceYears: 8, ratingAvg: 4.8, totalJobsCompleted: 52, isAvailable: true, currentLat: 11.6660, currentLng: 78.1420 }
        ];
    },

    bookWorker: async function(req) {
        if (this.isServer) {
            const res = await fetch(`${this.serverUrl}/api/v1/workers/book`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(req)
            });
            return await res.json();
        }
        return { id: Date.now(), status: 'PENDING', ...req };
    },

    /* ── 6. ORDERS & WALLET ──────────────────────────── */
    getOrders: async function() {
        if (this.isServer) {
            try {
                const res = await fetch(`${this.serverUrl}/api/v1/admin/orders`, { headers: this.getAuthHeaders() });
                if (res.ok) return await res.json();
            } catch(e) {}
        }
        return [
            { id: "ord-4821", buyer: "Hotel Fresh & Co", buyerUsername: "buyer@fresh.com", crop: "🍅 Tomato", qty: 50, total: 2250, status: "pending", farmerLoc: "Salem, Tamil Nadu", buyerLoc: "Chennai, Tamil Nadu", date: new Date().toISOString() },
            { id: "ord-4790", buyer: "GreenMart Stores", buyerUsername: "buyer@fresh.com", crop: "🧅 Onion", qty: 100, total: 3200, status: "dispatched", farmerLoc: "Nashik, Maharashtra", buyerLoc: "Pune, Maharashtra", date: new Date().toISOString() }
        ];
    },

    getWalletBalance: async function(username) {
        return 42500.00;
    },

    updateWalletBalance: async function(username, amount) {
        return 42500.00 + amount;
    }
};
