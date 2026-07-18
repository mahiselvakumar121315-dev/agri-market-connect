/* ====================================================
   AGRI MARKET CONNECT - Main Application Orchestrator
   Manages: Global State, Navigation Router, 
            Notifications, Marketplace Rendering,
            Modal Management, Module Initialization
   ==================================================== */

/* ─── 1. NOTIFICATION MANAGER ─────────────────────── */
window.NotificationManager = {
    notifications: [
        { id: 1, type: "success", title: "New Order Received", msg: "Hotel Fresh & Co ordered 50kg Tomatoes. Order #4821", time: "22:41 PM", unread: true },
        { id: 2, type: "warning", title: "Weather Alert", msg: "Rain expected tomorrow in Salem. Delay outdoor harvest.", time: "22:30 PM", unread: true },
        { id: 3, type: "success", title: "Payment Received", msg: "₹2,600 credited for Onion order from GreenMart.", time: "21:15 PM", unread: true }
    ],

    init: function() {
        const trigger = document.getElementById("notification-trigger");
        const dropdown = document.getElementById("notifications-dropdown");
        const clearBtn = document.getElementById("mark-all-read");

        if (trigger && dropdown) {
            trigger.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdown.classList.toggle("hidden");
                this.renderList();
            });

            if (clearBtn) {
                clearBtn.addEventListener("click", () => {
                    this.notifications = [];
                    this.renderList();
                    this.updateBadge();
                });
            }

            document.addEventListener("click", (e) => {
                if (!trigger.contains(e.target)) {
                    dropdown.classList.add("hidden");
                }
            });
        }

        this.renderList();
        this.updateBadge();
    },

    createNotification: function(title, msg, type) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newNotif = { id: Date.now(), type: type, title: title, msg: msg, time: timeStr, unread: true };

        this.notifications.unshift(newNotif);
        this.renderList();
        this.updateBadge();
        this.showToast(title, msg, type);
    },

    showToast: function(title, msg, type) {
        const colors = { success: "var(--primary)", warning: "var(--warning)", danger: "var(--danger)", info: "var(--info)" };
        const icons = { success: "fa-circle-check", warning: "fa-triangle-exclamation", danger: "fa-circle-xmark", info: "fa-circle-info" };

        const toast = document.createElement("div");
        toast.style.cssText = `
            position: fixed; bottom: 105px; right: 30px;
            background-color: var(--bg-surface); 
            border: 1px solid ${colors[type] || colors.info}55;
            border-left: 4px solid ${colors[type] || colors.info};
            color: var(--text-primary); padding: 14px 20px;
            border-radius: 12px; min-width: 300px; max-width: 380px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.35);
            z-index: 2000; animation: slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1);
            display: flex; gap: 12px; align-items: flex-start;
        `;

        toast.innerHTML = `
            <i class="fa-solid ${icons[type] || icons.info}" style="color:${colors[type]};margin-top:2px;font-size:1rem;"></i>
            <div>
                <strong style="font-size:0.85rem;display:block;margin-bottom:3px;">${title}</strong>
                <span style="font-size:0.75rem;color:var(--text-secondary);line-height:1.3;">${msg}</span>
            </div>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = "opacity 0.4s ease, transform 0.4s ease";
            toast.style.opacity = "0";
            toast.style.transform = "translateX(30px)";
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    },

    renderList: function() {
        const list = document.getElementById("notifications-list");
        if (!list) return;

        if (this.notifications.length === 0) {
            list.innerHTML = `<p style="padding:16px;text-align:center;color:var(--text-muted);font-size:0.8rem;">No new notifications</p>`;
            return;
        }

        const iconMap = { success: "fa-circle-check", warning: "fa-triangle-exclamation", danger: "fa-circle-xmark", info: "fa-circle-info" };
        const colorMap = { success: "var(--primary)", warning: "var(--warning)", danger: "var(--danger)", info: "var(--info)" };

        list.innerHTML = this.notifications.slice(0, 5).map(n => `
            <div class="notification-item ${n.unread ? 'unread' : ''}">
                <div style="display:flex;gap:8px;align-items:flex-start;">
                    <i class="fa-solid ${iconMap[n.type] || iconMap.info}" style="color:${colorMap[n.type]};margin-top:2px;"></i>
                    <div>
                        <strong style="font-size:0.8rem;">${n.title}</strong>
                        <p style="margin-top:2px;font-size:0.75rem;">${n.msg}</p>
                    </div>
                </div>
                <span class="time">${n.time}</span>
            </div>
        `).join("");
    },

    updateBadge: function() {
        const badge = document.getElementById("notification-count");
        if (!badge) return;
        const unreadCount = this.notifications.filter(n => n.unread).length;
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? "flex" : "none";
    }
};


/* ─── 2. GLOBAL STATE MANAGER ─────────────────────── */
window.GlobalState = {
    walletBalance: 42500,
    _crops: (window.MarketData && typeof window.MarketData.getAllCrops === 'function') ? window.MarketData.getAllCrops() : [],
    orders: [
        { id: "ord-4821", buyer: "Hotel Fresh & Co", buyerUsername: "buyer@fresh.com", crop: "🍅 Tomato", qty: 50, total: 2250, status: "pending", farmerLoc: "Salem, Tamil Nadu", buyerLoc: "Chennai, Tamil Nadu", date: new Date().toISOString() },
        { id: "ord-4790", buyer: "GreenMart Stores", buyerUsername: "buyer@fresh.com", crop: "🧅 Onion", qty: 100, total: 3200, status: "dispatched", farmerLoc: "Nashik, Maharashtra", buyerLoc: "Pune, Maharashtra", date: new Date().toISOString() }
    ],

    loadCropsFromDB: async function() {
        try {
            let dbCrops = [];
            if (window.AgriDB) {
                dbCrops = await window.AgriDB.getCrops();
            }
            const fallback = (window.MarketData && typeof window.MarketData.getAllCrops === 'function') ? window.MarketData.getAllCrops() : [];
            const combined = [...dbCrops];
            fallback.forEach(c => {
                if (!combined.some(existing => existing.id === c.id || existing.name === c.name)) {
                    combined.push(c);
                }
            });
            this._crops = combined.length > 0 ? combined : fallback;
        } catch(e) {
            this._crops = (window.MarketData && typeof window.MarketData.getAllCrops === 'function') ? window.MarketData.getAllCrops() : [];
        }
        this.renderMarketplace();
    },

    loadOrdersFromDB: async function() {
        try {
            if (window.AgriDB) {
                const dbOrders = await window.AgriDB.getOrders();
                if (dbOrders && dbOrders.length > 0) this.orders = dbOrders;
            }
        } catch(e) {}
        this.renderFarmerOrders();
    },

    loadWalletFromDB: async function() {
        this._updateWalletDisplay();
    },

    _updateWalletDisplay: function() {
        const display = document.getElementById("wallet-balance-display");
        if (display) {
            display.textContent = "₹" + this.walletBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 });
        }
        const payDisplay = document.getElementById("pay-wallet-balance");
        if (payDisplay) {
            payDisplay.textContent = this.walletBalance.toLocaleString("en-IN");
        }
    },

    get crops() {
        if (this._crops && this._crops.length > 0) return this._crops;
        return (window.MarketData && typeof window.MarketData.getAllCrops === 'function') ? window.MarketData.getAllCrops() : [];
    },

    updateWallet: async function(amount) {
        this.walletBalance += amount;
        this._updateWalletDisplay();
    },

    deductWallet: async function(amount) {
        this.walletBalance = Math.max(0, this.walletBalance - amount);
        this._updateWalletDisplay();
    },

    completeOrder: async function(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) order.status = 'delivered';
        this.renderFarmerOrders();
    },

    updateStats: function() {
        const username = sessionStorage.getItem('agri_user') || 'Rajesh Kumar';
        const myListings = this.crops.filter(c => c.farmer === username || c.farmer === 'Rajesh Kumar');
        const listingEl = document.getElementById("farmer-active-listings-count");
        if (listingEl) listingEl.textContent = `${myListings.length} Crops`;
    },

    renderMarketplace: function(filter = "all") {
        const grid = document.getElementById("crop-catalog");
        const searchInput = document.getElementById("marketplace-search");
        if (!grid) return;

        const searchQuery = searchInput ? searchInput.value.toLowerCase() : "";
        const allCrops = this.crops;

        let filtered = allCrops.filter(crop => {
            const matchSearch = !searchQuery ||
                crop.name.toLowerCase().includes(searchQuery) ||
                crop.farmer.toLowerCase().includes(searchQuery) ||
                crop.location.toLowerCase().includes(searchQuery) ||
                crop.category.toLowerCase().includes(searchQuery);

            const matchFilter =
                filter === "all" ||
                filter === crop.category ||
                (filter === "fresh" && crop.fresh) ||
                (filter === "organic-tag" && crop.organic);

            return matchSearch && matchFilter;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding: 60px 0; color: var(--text-muted);">
                    <i class="fa-solid fa-magnifying-glass" style="font-size:2.5rem;opacity:0.3;display:block;margin-bottom:16px;"></i>
                    <p>No crops found for your search.</p>
                </div>`;
            return;
        }

        grid.innerHTML = filtered.map(crop => {
            const daysAgo = Math.max(0, Math.floor((new Date() - new Date(crop.harvestDate)) / (1000 * 60 * 60 * 24)));

            return `
            <div class="crop-card" data-id="${crop.id}" data-category="${crop.category}">
                <div class="crop-image-wrapper">
                    <img src="${crop.img}" alt="${crop.name}" class="crop-card-img" onerror="this.src='https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=400'">
                    <div class="crop-badge-overlay">
                        ${crop.organic ? '<span class="crop-organic-tag"><i class="fa-solid fa-leaf"></i> Organic</span>' : ''}
                        ${crop.fresh ? '<span class="crop-organic-tag" style="background:#0ea5e9;"><i class="fa-solid fa-star"></i> Fresh</span>' : ''}
                    </div>
                    <div class="crop-price-tag">₹${crop.price.toFixed(2)}/kg</div>
                </div>
                <div class="crop-card-body">
                    <div>
                        <h4 class="crop-card-title">${crop.name}</h4>
                        <span class="crop-card-category">${crop.category.toUpperCase()}</span>
                    </div>
                    <div style="display:flex; gap:12px; font-size:0.75rem; color:var(--text-muted);">
                        <span><i class="fa-solid fa-weight-hanging" style="color:var(--primary)"></i> ${crop.quantity} kg available</span>
                        <span><i class="fa-solid fa-calendar" style="color:var(--secondary)"></i> Harvested ${daysAgo === 0 ? 'today' : daysAgo + 'd ago'}</span>
                    </div>
                    <div class="farmer-info-row">
                        <i class="fa-solid fa-user-tie"></i>
                        <div>
                            <p style="color:var(--text-primary);font-weight:500;">${crop.farmer}</p>
                            <p style="font-size:0.7rem;color:var(--text-muted);"><i class="fa-solid fa-location-dot"></i> ${crop.location} · ${crop.distance}</p>
                        </div>
                    </div>
                    <div class="crop-card-actions">
                        <button class="primary-btn add-cart-btn" data-id="${crop.id}">
                            <i class="fa-solid fa-cart-plus"></i> Add to Cart
                        </button>
                        <button class="secondary-btn trace-btn" data-id="${crop.id}" data-name="${crop.name}" data-farmer="${crop.farmer}" data-location="${crop.location}"
                            title="View Blockchain Traceability" style="padding:10px 12px;">
                            <i class="fa-solid fa-cubes"></i>
                        </button>
                    </div>
                </div>
            </div>
        `}).join("");

        // Bind Add to Cart buttons
        grid.querySelectorAll(".add-cart-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const cropId = btn.dataset.id;
                const crop = allCrops.find(c => c.id === cropId);
                if (crop) {
                    window.BuyerPortal.addToCart(crop.id, crop.name, crop.price, 10, crop.img);
                }
            });
        });

        // Bind Blockchain Trace buttons
        grid.querySelectorAll(".trace-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (window.BlockchainTracker) {
                    window.BlockchainTracker.renderTimeline(
                        btn.dataset.id,
                        btn.dataset.name,
                        btn.dataset.farmer,
                        btn.dataset.location
                    );
                }
            });
        });
    },

    renderFarmerOrders: function() {
        const tbody = document.getElementById("farmer-orders-list");
        if (!tbody) return;

        tbody.innerHTML = this.orders.map(o => {
            const statusBadge = {
                pending:    `<span class="badge badge-warning"><i class="fa-solid fa-clock"></i> Pending</span>`,
                dispatched: `<span class="badge badge-success" id="order-status-${o.id}"><i class="fa-solid fa-truck"></i> Dispatched</span>`,
                delivered:  `<span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> Delivered</span>`
            };

            const actionBtn = o.status === "pending"
                ? `<button class="primary-btn" style="padding:6px 12px;font-size:0.75rem;" onclick="LogisticsCoordinator.openForOrder('${o.id}', '${o.farmerLoc}', '${o.buyerLoc}')">
                        <i class="fa-solid fa-truck-fast"></i> Book Transport
                    </button>`
                : `<span id="order-status-${o.id}" style="font-size:0.75rem; color:var(--text-muted);">${o.status === 'delivered' ? 'Completed' : 'Tracking Active'}</span>`;

            return `
                <tr>
                    <td>#${o.id}</td>
                    <td>${o.buyer}</td>
                    <td>${o.crop}</td>
                    <td style="color:var(--primary);font-weight:600;">₹${o.total.toLocaleString()}</td>
                    <td>${statusBadge[o.status] || o.status}</td>
                    <td>${actionBtn}</td>
                </tr>
            `;
        }).join("");
    }
};


/* ─── 3. NAVIGATION ROUTER ─────────────────────────── */
window.Router = {
    init: function() {
        const navItems = document.querySelectorAll(".nav-item");

        navItems.forEach(item => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                const tab = item.dataset.tab;
                this.navigate(tab);
            });
        });

        const roleSelect = document.getElementById("role-select");
        if (roleSelect) {
            roleSelect.addEventListener("change", (e) => {
                const role = e.target.value;
                this.navigate(role === "farmer" ? "farmer" : role === "buyer" ? "buyer" : "admin");
                this.updateUserBadge(role);
            });
        }

        const searchInput = document.getElementById("marketplace-search");
        if (searchInput) {
            searchInput.addEventListener("input", () => {
                window.GlobalState.renderMarketplace(window.Router.currentFilter || "all");
            });
        }

        const filterBtns = document.querySelectorAll(".filter-btn");
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                this.currentFilter = btn.dataset.filter;
                window.GlobalState.renderMarketplace(this.currentFilter);
            });
        });
    },

    currentFilter: "all",

    navigate: function(tab) {
        document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

        const targetTab = document.getElementById(tab);
        if (targetTab) targetTab.classList.add("active");

        const targetNav = document.querySelector(`.nav-item[data-tab="${tab}"]`);
        if (targetNav) targetNav.classList.add("active");

        if (tab === "marketplace" && window.GlobalState) {
            setTimeout(() => window.GlobalState.renderMarketplace(), 50);
        } else if (tab === "admin" && window.AdminPanel) {
            setTimeout(() => {
                window.AdminPanel.renderBarChart();
                window.AdminPanel.renderPieChart();
                window.AdminPanel.renderAreaChart();
            }, 100);
        } else if (tab === "advanced" && window.AdvancedFeatures) {
            setTimeout(() => window.AdvancedFeatures.init(), 100);
        } else if (tab === "livestock" && window.LivestockModule) {
            setTimeout(() => window.LivestockModule.loadAndRender(), 100);
        } else if (tab === "fertilizers" && window.FertilizerModule) {
            setTimeout(() => window.FertilizerModule.loadAndRender(), 100);
        } else if (tab === "workers" && window.WorkerModule) {
            setTimeout(() => window.WorkerModule.loadAndRender(), 100);
        }

        const mainContent = document.querySelector(".main-content");
        if (mainContent) mainContent.scrollTop = 0;
    },

    updateUserBadge: function(role, username) {
        const avatarEl = document.getElementById("current-user-avatar");
        const nameEl   = document.getElementById("current-user-name");
        const roleEl   = document.getElementById("current-user-role");

        const profiles = {
            farmer: { avatar: "F", name: "Farmer User",           role: "Farmer Dashboard" },
            buyer:  { avatar: "B", name: "Buyer User",            role: "Buyer Dashboard" },
            admin:  { avatar: "A", name: "Admin Portal",          role: "System Administrator" }
        };

        const p = profiles[role] || profiles.farmer;
        if (avatarEl) avatarEl.textContent = username ? username.charAt(0).toUpperCase() : p.avatar;
        if (nameEl)   nameEl.textContent   = username || p.name;
        if (roleEl)   roleEl.textContent   = p.role;
    }
};


/* ─── 4. INITIALIZATION ENTRY POINT ─────────────────── */
document.addEventListener("DOMContentLoaded", function() {
    console.log("🌱 Agri Market Connect initializing...");

    // Immediate initial render of marketplace items so screen is NEVER blank
    window.GlobalState.renderMarketplace();

    // Async DB init & sync
    if (window.AgriDB) {
        window.AgriDB.init().then(() => {
            window.GlobalState.loadCropsFromDB();
            window.GlobalState.loadOrdersFromDB();
        }).catch(err => console.warn("DB init notice:", err));
    }

    // Initialize UI Components
    if (window.NotificationManager) window.NotificationManager.init();
    if (window.Router) window.Router.init();

    // Live Clock Logic
    function updateClock() {
        const now = new Date();
        const timeEl = document.getElementById("live-time");
        const dateEl = document.getElementById("live-date");
        if (timeEl && dateEl) {
            timeEl.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            dateEl.textContent = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
        }
    }
    updateClock();
    setInterval(updateClock, 1000);

    const userRole = sessionStorage.getItem('agri_role') || 'farmer';
    const userName = sessionStorage.getItem('agri_user') || '';

    if (window.Router) window.Router.updateUserBadge(userRole, userName);

    let initialTab = 'marketplace';
    const hash = window.location.hash ? window.location.hash.slice(1) : '';
    if (hash && document.getElementById(hash)) {
        initialTab = hash;
    } else {
        initialTab = 'marketplace';
    }

    if (window.Router) window.Router.navigate(initialTab);

    // Pre-render module views so switching tabs is instant and never blank
    if (window.LivestockModule) window.LivestockModule.loadAndRender();
    if (window.FertilizerModule) window.FertilizerModule.loadAndRender();
    if (window.WorkerModule) window.WorkerModule.loadAndRender();
    if (window.AdvancedFeatures) window.AdvancedFeatures.init();
    if (window.GlobalState) window.GlobalState.renderMarketplace();

    console.log("✅ Agri Market Connect is ready.");
});
