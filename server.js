/* ====================================================
   AGRI MARKET CONNECT — Express REST API & SQLite Server
   Serves frontend static files & provides DB API routes
   ==================================================== */

const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.sqlite');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files directly from root

// Database initialization
const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error('❌ Error opening SQLite database:', err.message);
    } else {
        console.log('🗄️ SQLite database connection established.');
        initializeDatabaseSchema();
    }
});

// Helper for running SQL statements as promises
function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

// Helper for SQL query all as promise
function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Helper for SQL query get as promise
function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

// Schema initialization
async function initializeDatabaseSchema() {
    try {
        // Users Table
        await dbRun(`
            CREATE TABLE IF NOT EXISTS users (
                username TEXT PRIMARY KEY,
                password TEXT NOT NULL,
                name TEXT NOT NULL,
                role TEXT NOT NULL,
                location TEXT
            )
        `);

        // Wallet Table
        await dbRun(`
            CREATE TABLE IF NOT EXISTS wallet (
                username TEXT PRIMARY KEY,
                balance REAL DEFAULT 0.0
            )
        `);

        // Crops Table
        await dbRun(`
            CREATE TABLE IF NOT EXISTS crops (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                price REAL NOT NULL,
                quantity REAL NOT NULL,
                harvestDate TEXT,
                organic INTEGER,
                farmer TEXT,
                location TEXT,
                distance TEXT,
                fresh INTEGER,
                img TEXT
            )
        `);

        // Orders Table
        await dbRun(`
            CREATE TABLE IF NOT EXISTS orders (
                id TEXT PRIMARY KEY,
                buyer TEXT NOT NULL,
                buyerUsername TEXT,
                crop TEXT NOT NULL,
                cropId TEXT,
                qty REAL NOT NULL,
                total REAL NOT NULL,
                status TEXT NOT NULL,
                farmerLoc TEXT,
                buyerLoc TEXT,
                date TEXT
            )
        `);

        // Labour Table
        await dbRun(`
            CREATE TABLE IF NOT EXISTS labour (
                id TEXT PRIMARY KEY,
                work_type TEXT,
                crop TEXT,
                workers_count INTEGER,
                wage REAL,
                urgency TEXT,
                start_date TEXT,
                duration TEXT,
                status TEXT
            )
        `);

        // Cold Storage Table
        await dbRun(`
            CREATE TABLE IF NOT EXISTS storage (
                id TEXT PRIMARY KEY,
                facility_name TEXT,
                location TEXT,
                capacity_booked REAL,
                start_date TEXT,
                duration TEXT,
                total_cost REAL,
                status TEXT
            )
        `);

        // Loans Table
        await dbRun(`
            CREATE TABLE IF NOT EXISTS loans (
                id TEXT PRIMARY KEY,
                amount REAL,
                interest_rate REAL,
                status TEXT,
                date TEXT
            )
        `);

        // Disputes Table
        await dbRun(`
            CREATE TABLE IF NOT EXISTS disputes (
                id TEXT PRIMARY KEY,
                order_id TEXT,
                reason TEXT,
                status TEXT,
                date TEXT
            )
        `);

        console.log('✅ SQLite Tables initialized successfully.');
        await seedDemoData();
    } catch (e) {
        console.error('❌ Error during schema setup:', e);
    }
}

// Seed Initial Data
async function seedDemoData() {
    try {
        // Seed users if table is empty
        const userCount = await dbGet('SELECT COUNT(*) as count FROM users');
        if (userCount.count === 0) {
            console.log('🌱 Seeding demo accounts...');
            const demoUsers = [
                ['9876543210', '1234', 'Rajesh Kumar', 'farmer', 'Salem, Tamil Nadu'],
                ['buyer@fresh.com', '1234', 'Hotel Fresh & Co', 'buyer', 'Chennai, Tamil Nadu'],
                ['admin@agri.com', '1234', 'Admin Portal', 'admin', 'System Headquarters']
            ];
            for (const u of demoUsers) {
                await dbRun('INSERT INTO users VALUES (?, ?, ?, ?, ?)', u);
            }

            // Seed wallets
            await dbRun('INSERT INTO wallet VALUES (?, ?)', ['9876543210', 5000.00]);
            await dbRun('INSERT INTO wallet VALUES (?, ?)', ['buyer@fresh.com', 42500.00]);
            await dbRun('INSERT INTO wallet VALUES (?, ?)', ['admin@agri.com', 1000000.00]);
        }

        // Seed initial crops if empty
        const cropCount = await dbGet('SELECT COUNT(*) as count FROM crops');
        if (cropCount.count === 0) {
            console.log('🌾 Seeding crop database...');
            const cropsSeed = [
                // id, name, category, price, quantity, organic, fresh, photoId, emoji
                ['crop-1', '🍅 Tomato', 'vegetables', 28.0, 150, 1, 1, '1592417817098-8f3d6eb19675'],
                ['crop-2', '🧅 Onion', 'vegetables', 25.0, 300, 0, 1, '1508747703725-719777637510'],
                ['crop-3', '🥔 Potato', 'vegetables', 22.0, 500, 0, 1, '1518977676601-b53f82aba655'],
                ['crop-4', '🍆 Brinjal (Eggplant)', 'vegetables', 35.0, 100, 1, 1, '1659261200262-234e3d6a97e1'],
                ['crop-5', '🫘 Ladies Finger (Okra)', 'vegetables', 40.0, 80, 1, 1, '1574316315265-22d7de1f8dcb'],
                ['crop-6', '🌶️ Green Chilli', 'vegetables', 68.0, 60, 1, 1, '1571680322279-a226e6a4cc2a'],
                ['crop-7', '🫑 Capsicum', 'vegetables', 55.0, 90, 1, 1, '1563565431-72e7d5a43d64'],
                ['crop-32', '🧄 Garlic', 'vegetables', 120.0, 50, 0, 1, '1506368465-96b11474a4f3'],
                ['crop-33', '🫚 Ginger', 'vegetables', 85.0, 80, 1, 1, '1615486171434-60195e347895'],
                ['crop-37', '🥭 Mango', 'fruits', 80.0, 150, 1, 1, '1601493700631-2b16ec4b4716'],
                ['crop-38', '🍌 Banana', 'fruits', 45.0, 300, 1, 1, '1603833665858-e61d17a86224'],
                ['crop-39', '🍎 Apple', 'fruits', 150.0, 80, 1, 1, '1560806887-1e4cd0b6fd6c'],
                ['crop-40', '🍊 Orange', 'fruits', 60.0, 200, 1, 1, '1611080668850-2445cff492a5'],
                ['crop-67', '🌾 Paddy (Rice)', 'cereals', 22.0, 1000, 0, 0, '1586201375761-83865001e31c'],
                ['crop-68', '🌾 Wheat', 'cereals', 32.0, 800, 0, 0, '1574323347407-f5e1ad6d020b'],
                ['crop-99', '🟡 Turmeric', 'spices', 112.0, 100, 1, 0, '1615485500704-8e990f9900f7'],
                ['crop-100', '⚫ Black Pepper', 'spices', 450.0, 30, 1, 0, '1596700854448-6d2c4767223e'],
                ['crop-111', '🌸 Jasmine', 'flowers', 400.0, 10, 1, 1, '1490885578174-acda8905c2c1'],
                ['crop-112', '🌹 Rose', 'flowers', 300.0, 20, 1, 1, '1490885578174-acda8905c2c1']
            ];

            const farmers = [
                { name: "Rajesh Kumar", loc: "Salem, Tamil Nadu", dist: "3.2 km" },
                { name: "Sundar Raj", loc: "Nashik, Maharashtra", dist: "6.5 km" },
                { name: "Kavin Agro", loc: "Salem, Tamil Nadu", dist: "4.1 km" }
            ];

            for (const c of cropsSeed) {
                const f = farmers[Math.floor(Math.random() * farmers.length)];
                const days = Math.floor(Math.random() * 7);
                const d = new Date(); d.setDate(d.getDate() - days);
                const harvestDate = d.toISOString().split('T')[0];
                const imgUrl = `https://images.unsplash.com/photo-${c[7]}?auto=format&fit=crop&q=80&w=400`;

                await dbRun(`
                    INSERT INTO crops VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [c[0], c[1], c[2], c[3], c[4], harvestDate, c[5], f.name, f.loc, f.dist, c[6], imgUrl]);
            }
        }

        // Seed orders if empty
        const orderCount = await dbGet('SELECT COUNT(*) as count FROM orders');
        if (orderCount.count === 0) {
            await dbRun('INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                'ord-4821', 'Hotel Fresh & Co', 'buyer@fresh.com', '🍅 Tomato', 'crop-1', 50, 2250, 'pending', 'Salem, Tamil Nadu', 'Chennai, Tamil Nadu', new Date().toISOString()
            ]);
            await dbRun('INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                'ord-4790', 'GreenMart Stores', 'buyer@fresh.com', '🧅 Onion', 'crop-2', 100, 3200, 'dispatched', 'Nashik, Maharashtra', 'Pune, Maharashtra', new Date().toISOString()
            ]);
        }
    } catch (e) {
        console.error('❌ Seeding error:', e);
    }
}

/* ════════════════════════════════════════════════════
   API ENDPOINTS
   ════════════════════════════════════════════════════ */

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Agri Market Connect DB' });
});

// Authentication Routes
app.post('/api/auth/login', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const user = await dbGet('SELECT * FROM users WHERE username = ?', [username]);
        if (!user || user.password !== password || user.role !== role) {
            return res.status(401).json({ message: 'Invalid credentials or role mismatch' });
        }
        res.json(user);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.post('/api/auth/register', async (req, res) => {
    const { name, mobile, email, password, role } = req.body;
    const username = email || mobile;
    try {
        const existing = await dbGet('SELECT * FROM users WHERE username = ?', [username]);
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const location = role === 'farmer' ? 'Salem, Tamil Nadu' : 'Chennai, Tamil Nadu';
        await dbRun('INSERT INTO users VALUES (?, ?, ?, ?, ?)', [username, password, name, role, location]);
        
        // Give starting wallet
        const balance = role === 'buyer' ? 50000.0 : 5000.0;
        await dbRun('INSERT INTO wallet VALUES (?, ?)', [username, balance]);

        res.json({ username, name, role, location });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Crops Routes
app.get('/api/crops', async (req, res) => {
    try {
        const crops = await dbAll('SELECT * FROM crops');
        // convert numeric organic/fresh flags back to boolean
        const formatted = crops.map(c => ({
            ...c,
            organic: !!c.organic,
            fresh: !!c.fresh
        }));
        res.json(formatted);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.post('/api/crops', async (req, res) => {
    const c = req.body;
    try {
        await dbRun(`
            INSERT INTO crops (id, name, category, price, quantity, harvestDate, organic, farmer, location, distance, fresh, img)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [c.id, c.name, c.category, c.price, c.quantity, c.harvestDate, c.organic ? 1 : 0, c.farmer, c.location, c.distance, c.fresh ? 1 : 0, c.img]);
        res.status(201).json(c);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Orders Routes
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await dbAll('SELECT * FROM orders');
        res.json(orders);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.post('/api/orders', async (req, res) => {
    const o = req.body;
    try {
        await dbRun(`
            INSERT INTO orders (id, buyer, buyerUsername, crop, cropId, qty, total, status, farmerLoc, buyerLoc, date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [o.id, o.buyer, o.buyerUsername, o.crop, o.cropId, o.qty, o.total, o.status, o.farmerLoc, o.buyerLoc, o.date || new Date().toISOString()]);
        
        // Deduct crop stock
        if (o.cropId) {
            await dbRun('UPDATE crops SET quantity = MAX(0, quantity - ?) WHERE id = ?', [o.qty, o.cropId]);
        }
        res.status(201).json(o);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.post('/api/orders/status', async (req, res) => {
    const { orderId, status } = req.body;
    try {
        await dbRun('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
        res.json({ success: true, orderId, status });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Wallet Balance Routes
app.get('/api/wallet', async (req, res) => {
    const { username } = req.query;
    try {
        const wallet = await dbGet('SELECT balance FROM wallet WHERE username = ?', [username]);
        res.json({ username, balance: wallet ? wallet.balance : 0.0 });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.post('/api/wallet', async (req, res) => {
    const { username, amount } = req.body;
    try {
        const wallet = await dbGet('SELECT balance FROM wallet WHERE username = ?', [username]);
        const newBalance = Math.max(0, (wallet ? wallet.balance : 0.0) + amount);
        await dbRun('INSERT INTO wallet (username, balance) VALUES (?, ?) ON CONFLICT(username) DO UPDATE SET balance = ?', [username, newBalance, newBalance]);
        res.json({ username, balance: newBalance });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Advanced Features Routes
app.post('/api/labour', async (req, res) => {
    const r = req.body;
    try {
        const id = 'labour-' + Date.now();
        await dbRun(`
            INSERT INTO labour VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [id, r.work_type, r.crop, r.workers_count, r.wage, r.urgency, r.start_date, r.duration, 'pending']);
        res.status(201).json({ id, ...r, status: 'pending' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.post('/api/cold-storage', async (req, res) => {
    const b = req.body;
    try {
        const id = 'store-' + Date.now();
        await dbRun(`
            INSERT INTO storage VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [id, b.facility_name, b.location, b.capacity_booked, b.start_date, b.duration, b.total_cost, 'confirmed']);
        res.status(201).json({ id, ...b, status: 'confirmed' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.post('/api/loans', async (req, res) => {
    const l = req.body;
    try {
        const id = 'loan-' + Date.now();
        await dbRun(`
            INSERT INTO loans VALUES (?, ?, ?, ?, ?)
        `, [id, l.amount, l.interest_rate, 'approved', new Date().toISOString()]);
        res.status(201).json({ id, ...l, status: 'approved' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.post('/api/disputes', async (req, res) => {
    const d = req.body;
    try {
        const id = 'disp-' + Date.now();
        await dbRun(`
            INSERT INTO disputes VALUES (?, ?, ?, ?, ?)
        `, [id, d.order_id, d.reason, 'open', new Date().toISOString()]);
        res.status(201).json({ id, ...d, status: 'open' });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Catch-all route to serve login page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Run server
app.listen(PORT, () => {
    console.log(`🚀 [Agri Server] Server listening on http://localhost:${PORT}`);
});
