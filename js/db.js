/* ====================================================
   AGRI MARKET CONNECT — Database & Sync Manager (db.js)
   Supports Dual Mode:
   - Server Mode (Active backend server API)
   - Local Mode (Persistent IndexedDB in browser)
   ==================================================== */

window.AgriDB = {
    isServer: false,
    serverUrl: 'http://localhost:3000',
    db: null,

    // Initial check and database setup
    init: async function() {
        console.log("⚙️ [AgriDB] Checking for backend server...");
        try {
            // Quick health check to see if backend server is online
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 200); // 200ms timeout
            
            const response = await fetch(`${this.serverUrl}/api/health`, { signal: controller.signal });
            clearTimeout(id);
            if (response.ok) {
                this.isServer = true;
                console.log("🚀 [AgriDB] Backend server detected. Running in SERVER Mode.");
            }
        } catch (e) {
            console.log("🔌 [AgriDB] Backend offline. Running in LOCAL (IndexedDB) Mode.");
        }

        if (!this.isServer) {
            await this.initIndexedDB();
        }
    },

    // IndexedDB setup & Seeding
    initIndexedDB: function() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('AgriMarketDB', 2);

            request.onerror = (e) => {
                console.error("❌ [IndexedDB] Error opening database", e);
                reject(e);
            };

            request.onsuccess = (e) => {
                this.db = e.target.result;
                console.log("📦 [IndexedDB] Database connection established.");
                resolve(this.db);
            };

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                console.log("📦 [IndexedDB] Upgrading schema / Seeding initial database...");

                // Users store
                if (!db.objectStoreNames.contains('users')) {
                    db.createObjectStore('users', { keyPath: 'username' });
                }

                // Crops store
                if (!db.objectStoreNames.contains('crops')) {
                    db.createObjectStore('crops', { keyPath: 'id' });
                }

                // Orders store
                if (!db.objectStoreNames.contains('orders')) {
                    db.createObjectStore('orders', { keyPath: 'id' });
                }

                // Labour requests store
                if (!db.objectStoreNames.contains('labour')) {
                    db.createObjectStore('labour', { keyPath: 'id', autoIncrement: true });
                }

                // Cold Storage bookings store
                if (!db.objectStoreNames.contains('storage')) {
                    db.createObjectStore('storage', { keyPath: 'id', autoIncrement: true });
                }

                // Loans store
                if (!db.objectStoreNames.contains('loans')) {
                    db.createObjectStore('loans', { keyPath: 'id', autoIncrement: true });
                }

                // Disputes store
                if (!db.objectStoreNames.contains('disputes')) {
                    db.createObjectStore('disputes', { keyPath: 'id', autoIncrement: true });
                }

                // Wallet store
                if (!db.objectStoreNames.contains('wallet')) {
                    db.createObjectStore('wallet', { keyPath: 'username' });
                }

                // Seed initial data once transaction completes
                const transaction = e.target.transaction;
                this.seedInitialData(transaction);
            };
        });
    },

    seedInitialData: function(transaction) {
        const userStore = transaction.objectStore('users');
        const cropStore = transaction.objectStore('crops');
        const walletStore = transaction.objectStore('wallet');
        const orderStore = transaction.objectStore('orders');

        // Seed demo accounts
        const demoUsers = [
            { username: '9876543210', password: '1234', name: 'Rajesh Kumar', role: 'farmer', location: 'Salem, Tamil Nadu' },
            { username: 'buyer@fresh.com', password: '1234', name: 'Hotel Fresh & Co', role: 'buyer', location: 'Chennai, Tamil Nadu' },
            { username: 'admin@agri.com', password: '1234', name: 'Admin Portal', role: 'admin', location: 'System Headquarters' }
        ];
        demoUsers.forEach(u => userStore.put(u));

        // Seed wallets
        walletStore.put({ username: '9876543210', balance: 5000.00 });
        walletStore.put({ username: 'buyer@fresh.com', balance: 42500.00 });
        walletStore.put({ username: 'admin@agri.com', balance: 1000000.00 });

        // Seed crops from marketData.js if available
        if (window.MarketData && typeof window.MarketData.getAllCrops === 'function') {
            const defaultCrops = window.MarketData.getAllCrops();
            defaultCrops.forEach(c => cropStore.put(c));
            console.log(`🌾 [IndexedDB] Seeded ${defaultCrops.length} crops successfully.`);
        }

        // Seed demo orders
        const demoOrders = [
            { id: "ord-4821", buyer: "Hotel Fresh & Co", buyerUsername: "buyer@fresh.com", crop: "🍅 Tomato", qty: 50, total: 2250, status: "pending", farmerLoc: "Salem, Tamil Nadu", buyerLoc: "Chennai, Tamil Nadu", date: new Date().toISOString() },
            { id: "ord-4790", buyer: "GreenMart Stores", buyerUsername: "buyer@fresh.com", crop: "🧅 Onion", qty: 100, total: 3200, status: "dispatched", farmerLoc: "Nashik, Maharashtra", buyerLoc: "Pune, Maharashtra", date: new Date().toISOString() }
        ];
        demoOrders.forEach(o => orderStore.put(o));
    },

    // Unified helper for transaction queries
    _dbTransaction: function(storeName, mode, callback) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject("Database not initialized");
            }
            const tx = this.db.transaction(storeName, mode);
            const store = tx.objectStore(storeName);
            const request = callback(store);

            tx.oncomplete = () => resolve(request.result);
            tx.onerror = (e) => reject(tx.error || e);
        });
    },

    /* ── AUTHENTICATION ───────────────────────────────── */
    login: async function(username, password, role) {
        if (this.isServer) {
            const res = await fetch(`${this.serverUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Login failed');
            }
            return await res.json();
        } else {
            return this._dbTransaction('users', 'readonly', (store) => store.get(username)).then(user => {
                if (!user || user.password !== password || user.role !== role) {
                    throw new Error('Invalid credentials or role mismatch.');
                }
                return user;
            });
        }
    },

    register: async function(name, mobile, email, password, role) {
        const username = email || mobile;
        if (this.isServer) {
            const res = await fetch(`${this.serverUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, mobile, email, password, role })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Registration failed');
            }
            return await res.json();
        } else {
            // First check if user exists
            const existing = await this._dbTransaction('users', 'readonly', (store) => store.get(username));
            if (existing) {
                throw new Error('User already exists with this mobile/email.');
            }

            const newUser = { username, password, name, role, location: role === 'farmer' ? 'Salem, Tamil Nadu' : 'Chennai, Tamil Nadu' };
            await this._dbTransaction('users', 'readwrite', (store) => store.put(newUser));
            
            // Give default starting wallet balance
            const balance = role === 'buyer' ? 50000.00 : 5000.00;
            await this._dbTransaction('wallet', 'readwrite', (store) => store.put({ username, balance }));
            
            return newUser;
        }
    },

    /* ── CROPS ───────────────────────────────────────── */
    getCrops: async function() {
        if (this.isServer) {
            const res = await fetch(`${this.serverUrl}/api/crops`);
            return await res.json();
        } else {
            return new Promise((resolve, reject) => {
                const tx = this.db.transaction('crops', 'readonly');
                const store = tx.objectStore('crops');
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }
    },

    addCrop: async function(crop) {
        if (this.isServer) {
            const res = await fetch(`${this.serverUrl}/api/crops`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(crop)
            });
            return await res.json();
        } else {
            await this._dbTransaction('crops', 'readwrite', (store) => store.put(crop));
            return crop;
        }
    },

    /* ── ORDERS ──────────────────────────────────────── */
    getOrders: async function() {
        if (this.isServer) {
            const res = await fetch(`${this.serverUrl}/api/orders`);
            return await res.json();
        } else {
            return new Promise((resolve, reject) => {
                const tx = this.db.transaction('orders', 'readonly');
                const store = tx.objectStore('orders');
                const request = store.getAll();
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }
    },

    addOrder: async function(order) {
        if (this.isServer) {
            const res = await fetch(`${this.serverUrl}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });
            return await res.json();
        } else {
            // Store order
            await this._dbTransaction('orders', 'readwrite', (store) => store.put(order));
            
            // Deduct quantity from crop inventory
            const cropId = order.cropId;
            if (cropId) {
                const crop = await this._dbTransaction('crops', 'readonly', (store) => store.get(cropId));
                if (crop) {
                    crop.quantity = Math.max(0, crop.quantity - order.qty);
                    await this._dbTransaction('crops', 'readwrite', (store) => store.put(crop));
                }
            }
            return order;
        }
    },

    updateOrderStatus: async function(orderId, status) {
        if (this.isServer) {
            const res = await fetch(`${this.serverUrl}/api/orders/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status })
            });
            return await res.json();
        } else {
            const order = await this._dbTransaction('orders', 'readonly', (store) => store.get(orderId));
            if (order) {
                order.status = status;
                await this._dbTransaction('orders', 'readwrite', (store) => store.put(order));
            }
            return order;
        }
    },

    /* ── WALLET BALANCE ──────────────────────────────── */
    getWalletBalance: async function(username) {
        if (this.isServer) {
            const res = await fetch(`${this.serverUrl}/api/wallet?username=${encodeURIComponent(username)}`);
            const data = await res.json();
            return data.balance;
        } else {
            const wallet = await this._dbTransaction('wallet', 'readonly', (store) => store.get(username));
            return wallet ? wallet.balance : 0;
        }
    },

    updateWalletBalance: async function(username, amount) {
        if (this.isServer) {
            const res = await fetch(`${this.serverUrl}/api/wallet`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, amount })
            });
            const data = await res.json();
            return data.balance;
        } else {
            const wallet = await this._dbTransaction('wallet', 'readonly', (store) => store.get(username));
            const currentBalance = wallet ? wallet.balance : 0;
            const newBalance = Math.max(0, currentBalance + amount);
            await this._dbTransaction('wallet', 'readwrite', (store) => store.put({ username, balance: newBalance }));
            return newBalance;
        }
    },

    /* ── ADVANCED MODULES ────────────────────────────── */
    addLabourRequest: async function(req) {
        if (this.isServer) {
            const res = await fetch(`${this.serverUrl}/api/labour`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req)
            });
            return await res.json();
        } else {
            req.id = 'labour-' + Date.now();
            await this._dbTransaction('labour', 'readwrite', (store) => store.put(req));
            return req;
        }
    },

    addColdStorageBooking: async function(booking) {
        if (this.isServer) {
            const res = await fetch(`${this.serverUrl}/api/cold-storage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(booking)
            });
            return await res.json();
        } else {
            booking.id = 'store-' + Date.now();
            await this._dbTransaction('storage', 'readwrite', (store) => store.put(booking));
            return booking;
        }
    },

    addLoanApplication: async function(loan) {
        if (this.isServer) {
            const res = await fetch(`${this.serverUrl}/api/loans`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loan)
            });
            return await res.json();
        } else {
            loan.id = 'loan-' + Date.now();
            await this._dbTransaction('loans', 'readwrite', (store) => store.put(loan));
            return loan;
        }
    },

    addDispute: async function(dispute) {
        if (this.isServer) {
            const res = await fetch(`${this.serverUrl}/api/disputes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dispute)
            });
            return await res.json();
        } else {
            dispute.id = 'disp-' + Date.now();
            await this._dbTransaction('disputes', 'readwrite', (store) => store.put(dispute));
            return dispute;
        }
    }
};
