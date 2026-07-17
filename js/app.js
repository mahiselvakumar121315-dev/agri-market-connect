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

        trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("hidden");
            this.renderList();
        });

        clearBtn.addEventListener("click", () => {
            this.notifications = [];
            this.renderList();
            this.updateBadge();
        });

        document.addEventListener("click", (e) => {
            if (!trigger.contains(e.target)) {
                dropdown.classList.add("hidden");
            }
        });

        this.renderList();
        this.updateBadge();
    },

    createNotification: function(title, msg, type) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newNotif = {
            id: Date.now(),
            type: type,
            title: title,
            msg: msg,
            time: timeStr,
            unread: true
        };

        this.notifications.unshift(newNotif);
        this.renderList();
        this.updateBadge();

        // Toast display
        this.showToast(title, msg, type);
    },

    showToast: function(title, msg, type) {
        const colors = {
            success: "var(--primary)",
            warning: "var(--warning)",
            danger:  "var(--danger)",
            info:    "var(--info)"
        };

        const icons = {
            success: "fa-circle-check",
            warning: "fa-triangle-exclamation",
            danger:  "fa-circle-xmark",
            info:    "fa-circle-info"
        };

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
        const unreadCount = this.notifications.filter(n => n.unread).length;
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? "flex" : "none";
    }
};


/* ─── 2. GLOBAL STATE MANAGER ─────────────────────── */
window.GlobalState = {
    walletBalance: 0,
    _crops: [],    // in-memory cache loaded from DB
    orders: [],    // in-memory cache loaded from DB

    // Load crops from DB into memory cache
    loadCropsFromDB: async function() {
        try {
            if (window.AgriDB) {
                this._crops = await window.AgriDB.getCrops();
            } else {
                this._crops = window.MarketData ? window.MarketData.getAllCrops() : [];
            }
        } catch(e) {
            console.warn('[GlobalState] DB crop load failed, using MarketData fallback:', e);
            this._crops = window.MarketData ? window.MarketData.getAllCrops() : [];
        }
    },

    // Load orders from DB into memory cache
    loadOrdersFromDB: async function() {
        try {
            if (window.AgriDB) {
                this.orders = await window.AgriDB.getOrders();
            }
        } catch(e) {
            console.warn('[GlobalState] DB order load failed:', e);
        }
    },

    loadWalletFromDB: async function() {
        try {
            const username = sessionStorage.getItem('agri_user') || 'buyer@fresh.com';
            if (window.AgriDB) {
                this.walletBalance = (await window.AgriDB.getWalletBalance(username)) || 0;
            } else {
                this.walletBalance = 42500;
            }
            this._updateWalletDisplay();
        } catch(e) {
            this.walletBalance = 42500;
            this._updateWalletDisplay();
        }
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

    // Get crops (from memory cache)
    get crops() {
        return this._crops.length > 0 ? this._crops : (window.MarketData ? window.MarketData.getAllCrops() : []);
    },

    updateWallet: async function(amount) {
        try {
            const username = sessionStorage.getItem('agri_user') || 'buyer@fresh.com';
            if (window.AgriDB) {
                this.walletBalance = await window.AgriDB.updateWalletBalance(username, amount);
            } else {
                this.walletBalance += amount;
            }
        } catch(e) {
            this.walletBalance += amount;
        }
        this._updateWalletDisplay();
    },

    deductWallet: async function(amount) {
        try {
            const username = sessionStorage.getItem('agri_user') || 'buyer@fresh.com';
            if (window.AgriDB) {
                this.walletBalance = await window.AgriDB.updateWalletBalance(username, -amount);
            } else {
                this.walletBalance = Math.max(0, this.walletBalance - amount);
            }
        } catch(e) {
            this.walletBalance = Math.max(0, this.walletBalance - amount);
        }
        this._updateWalletDisplay();
    },

    completeOrder: async function(orderId) {
        try {
            if (window.AgriDB) {
                await window.AgriDB.updateOrderStatus(orderId, 'delivered');
                await this.loadOrdersFromDB();
            } else {
                const order = this.orders.find(o => o.id === orderId);
                if (order) order.status = 'delivered';
            }
        } catch(e) {
            const order = this.orders.find(o => o.id === orderId);
            if (order) order.status = 'delivered';
        }
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
                window.BlockchainTracker.renderTimeline(
                    btn.dataset.id,
                    btn.dataset.name,
                    btn.dataset.farmer,
                    btn.dataset.location
                );
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

        // Role switcher triggers navigation
        const roleSelect = document.getElementById("role-select");
        if (roleSelect) {
            roleSelect.addEventListener("change", (e) => {
                const role = e.target.value;
                this.navigate(role === "farmer" ? "farmer" : role === "buyer" ? "buyer" : "admin");
                this.updateUserBadge(role);
            });
        }

        // Search input dynamic filtering
        const searchInput = document.getElementById("marketplace-search");
        if (searchInput) {
            searchInput.addEventListener("input", () => {
                window.GlobalState.renderMarketplace(window.Router.currentFilter || "all");
            });
        }

        // Marketplace filter buttons
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
        // Hide all tabs
        document.querySelectorAll(".tab-content").forEach(t => {
            t.classList.remove("active");
        });

        // Deactivate all nav items
        document.querySelectorAll(".nav-item").forEach(n => {
            n.classList.remove("active");
        });

        // Activate target tab
        const targetTab = document.getElementById(tab);
        if (targetTab) {
            targetTab.classList.add("active");
        }

        const targetNav = document.querySelector(`.nav-item[data-tab="${tab}"]`);
        if (targetNav) targetNav.classList.add("active");

        // When switching to admin, re-render charts (in case canvas wasn't visible)
        if (tab === "admin") {
            setTimeout(() => {
                window.AdminPanel.renderBarChart();
                window.AdminPanel.renderPieChart();
                window.AdminPanel.renderAreaChart();
            }, 100);
        }

        // Scroll top
        document.querySelector(".main-content").scrollTop = 0;
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


/* ─── 4. MODAL MANAGER ─────────────────────────────── */
window.ModalManager = {
    init: function() {
        // Blockchain modal close
        document.getElementById("btn-close-blockchain-modal").addEventListener("click", () => {
            document.getElementById("blockchain-modal").classList.remove("active");
        });

        // Logistics modal close
        document.getElementById("btn-close-logistics-modal").addEventListener("click", () => {
            document.getElementById("logistics-modal").classList.remove("active");
        });

        // Payment modal close
        document.getElementById("btn-close-payment-modal").addEventListener("click", () => {
            document.getElementById("payment-modal").classList.remove("active");
        });

        // Close modals on overlay click
        document.querySelectorAll(".modal-overlay").forEach(overlay => {
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) overlay.classList.remove("active");
            });
        });

        // Payment confirmation handler
        document.getElementById("btn-confirm-payment").addEventListener("click", () => {
            const amount = document.getElementById("pay-amount-val").textContent;
            const numericAmount = parseFloat(amount.replace("₹", "").replace(/,/g, ""));

            // Deduct from wallet
            window.GlobalState.deductWallet(numericAmount);

            // Close modal
            document.getElementById("payment-modal").classList.remove("active");

            // Clear cart
            window.BuyerPortal.cart = [];
            window.BuyerPortal.renderCart();

            window.NotificationManager.createNotification(
                "Payment Successful",
                `${amount} transferred securely via smart escrow. Order confirmed!`,
                "success"
            );
        });

        // Payment method toggle
        document.getElementById("pay-method-wallet").addEventListener("click", (e) => {
            document.querySelectorAll(".method-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
        });

        document.getElementById("pay-method-upi").addEventListener("click", (e) => {
            document.querySelectorAll(".method-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
        });
    }
};


/* ─── 5. CHATBOT WIDGET TOGGLE ─────────────────────── */
window.ChatbotWidget = {
    init: function() {
        const triggerBtn = document.getElementById("chatbot-trigger-btn");
        const window_el  = document.getElementById("chatbot-window");
        const closeBtn   = document.getElementById("chatbot-close-btn");

        triggerBtn.addEventListener("click", () => {
            window_el.classList.toggle("hidden");
        });

        closeBtn.addEventListener("click", () => {
            window_el.classList.add("hidden");
        });
    }
};


/* ─── 6. KEYFRAME ANIMATION INJECTOR ────────────────── */
(function injectAnimations() {
    const style = document.createElement("style");
    style.textContent = `
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .payment-methods-picker {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin: 16px 0;
        }
        .method-btn {
            background-color: var(--bg-surface);
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
            padding: 12px 18px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 500;
            transition: all 0.2s ease;
            text-align: center;
        }
        .method-btn.active {
            border-color: var(--primary);
            color: var(--primary);
            background-color: rgba(16,185,129,0.08);
        }
        .upi-qr-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            margin: 18px 0 10px;
        }
        .upi-qr-box .svg-qr {
            width: 110px;
            height: 110px;
        }
        .qr-sub {
            font-size: 0.7rem;
            color: var(--text-muted);
        }
        .pay-amount-lbl {
            font-size: 2rem;
            color: var(--primary);
            margin: 8px 0;
        }
        .gps-badge {
            background: rgba(16,185,129,0.1);
            border: 1px solid var(--border-glow);
            color: var(--primary);
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .negotiation-badge {
            background: rgba(99,102,241,0.1);
            border: 1px solid rgba(99,102,241,0.25);
            color: var(--secondary);
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        .panel-header h3 {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .warning-color {
            color: var(--warning) !important;
        }
        .orders-table-wrapper {
            overflow-x: auto;
        }
        .checkbox-group {
            justify-content: flex-end;
        }
        .upload-crop-panel {
            margin-bottom: 0;
        }
    `;
    document.head.appendChild(style);
})();


/* ─── 7. APPLICATION BOOT ────────────────────────────── */
document.addEventListener("DOMContentLoaded", async function() {
    console.log("🌱 Agri Market Connect — Initializing...");

    // Step 1: Initialize database (IndexedDB or Server)
    if (window.AgriDB) {
        await window.AgriDB.init();
    }

    // Step 2: Load data from DB into state
    await window.GlobalState.loadCropsFromDB();
    await window.GlobalState.loadOrdersFromDB();
    await window.GlobalState.loadWalletFromDB();

    // Step 3: Render state into UI
    window.GlobalState.renderMarketplace();
    window.GlobalState.renderFarmerOrders();
    window.GlobalState.updateStats();

    // Step 4: Initialize all modules
    window.NotificationManager.init();
    window.Router.init();
    window.ModalManager.init();
    window.ChatbotWidget.init();
    window.FarmerHub.init();
    window.BuyerPortal.init();
    window.AdminPanel.init();
    window.LogisticsCoordinator.init();
    window.AgriChatbot.init();
    window.WeatherMonitor.init();
    window.VoiceSearch.init(function(query) {
        console.log("Voice captured: ", query);
    });

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

    // Set initial route based on logged in role
    const userRole = sessionStorage.getItem('agri_role') || 'farmer';
    const userName = sessionStorage.getItem('agri_user') || '';

    // Update profile display
    window.Router.updateUserBadge(userRole, userName);

    let initialTab = 'marketplace';
    if (userRole === 'farmer') initialTab = 'farmer';
    else if (userRole === 'buyer') initialTab = 'buyer';
    else if (userRole === 'admin') initialTab = 'admin';
    
    window.Router.navigate(initialTab);

    console.log("✅ Agri Market Connect is live and ready.");

    // Welcome toast
    setTimeout(() => {
        window.NotificationManager.createNotification(
            "Platform Ready",
            `Signed in as ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}${userName ? ' — ' + userName : ''}`,
            "success"
        );
    }, 1000);
});
