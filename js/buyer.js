/* Buyer Portal logic: catalog rendering, shopping cart, e-negotiation chat, GPS canvas map */

window.BuyerPortal = {
    cart: [],
    negotiationState: {
        activeCropId: 'rice',
        originalPrice: 52,
        currentPrice: 52,
        farmerCounter: 52,
        stage: 0
    },

    // Map drawing variables
    mapCanvas: null,
    mapCtx: null,
    mapMarkers: {
        buyer: { x: 300, y: 175, label: "Hotel Fresh & Co (You)" },
        farms: [
            { x: 120, y: 80, label: "Rajesh Kumar (Tomatoes) - 3.2km", active: true },
            { x: 480, y: 110, label: "Sundar Raj (Rice) - 6.5km", active: true },
            { x: 220, y: 270, label: "Kavin Agro (Onions) - 4.1km", active: true }
        ],
        trucks: [
            { x: 120, y: 80, targetX: 300, targetY: 175, progress: 0, speed: 0.005, color: 'var(--secondary)', label: "Tata Ace - Booked", active: false }
        ]
    },

    init: function() {
        this.setupNegotiationChat();
        this.setupCartCheckout();
        this.setupMap();
    },

    setupMap: function() {
        this.mapCanvas = document.getElementById("gps-map-canvas");
        if (!this.mapCanvas) return;

        this.mapCtx = this.mapCanvas.getContext("2d");

        // Set up marker buttons
        document.getElementById("btn-toggle-farms").addEventListener("click", (e) => {
            e.currentTarget.classList.toggle("active");
            this.drawMap();
        });
        document.getElementById("btn-toggle-trucks").addEventListener("click", (e) => {
            e.currentTarget.classList.toggle("active");
            this.drawMap();
        });
        document.getElementById("btn-recenter").addEventListener("click", () => {
            this.drawMap();
        });

        // Run map animation loop
        this.animateMap();
    },

    drawMap: function() {
        const ctx = this.mapCtx;
        const width = this.mapCanvas.width;
        const height = this.mapCanvas.height;

        // Clear canvas
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, width, height);

        // Draw Map Grid Lines
        ctx.strokeStyle = "rgba(255,255,255,0.02)";
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 30) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
        for (let i = 0; i < height; i += 30) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }

        // Draw Salem area coordinate circles
        ctx.strokeStyle = "rgba(16, 185, 129, 0.04)";
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(width/2, height/2, 80, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(width/2, height/2, 160, 0, Math.PI * 2); ctx.stroke();

        const showFarms = document.getElementById("btn-toggle-farms").classList.contains("active");
        const showTrucks = document.getElementById("btn-toggle-trucks").classList.contains("active");

        // 1. Draw connecting route lines
        if (showFarms) {
            ctx.strokeStyle = "rgba(16, 185, 129, 0.12)";
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 1.5;
            this.mapMarkers.farms.forEach(f => {
                ctx.beginPath();
                ctx.moveTo(f.x, f.y);
                ctx.lineTo(this.mapMarkers.buyer.x, this.mapMarkers.buyer.y);
                ctx.stroke();
            });
            ctx.setLineDash([]);
        }

        // 2. Draw Farms markers
        if (showFarms) {
            this.mapMarkers.farms.forEach(f => {
                // Glow effect
                ctx.fillStyle = "rgba(16, 185, 129, 0.15)";
                ctx.beginPath();
                ctx.arc(f.x, f.y, 14, 0, Math.PI * 2);
                ctx.fill();

                // Core dot
                ctx.fillStyle = "var(--primary)";
                ctx.beginPath();
                ctx.arc(f.x, f.y, 6, 0, Math.PI * 2);
                ctx.fill();

                // Text
                ctx.fillStyle = "var(--text-secondary)";
                ctx.font = "10px sans-serif";
                ctx.fillText(f.label, f.x - 40, f.y - 12);
            });
        }

        // 3. Draw active Trucks
        if (showTrucks) {
            this.mapMarkers.trucks.forEach(t => {
                if (!t.active) return;
                
                // Draw connecting active line (glowing)
                ctx.strokeStyle = "var(--secondary)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(t.x, t.y);
                ctx.lineTo(t.targetX, t.targetY);
                ctx.stroke();

                // Draw truck dot
                ctx.fillStyle = "var(--secondary)";
                ctx.beginPath();
                ctx.arc(t.x, t.y, 7, 0, Math.PI * 2);
                ctx.fill();

                // Label
                ctx.fillStyle = "var(--text-primary)";
                ctx.font = "9px sans-serif";
                ctx.fillText(t.label, t.x - 30, t.y - 14);
            });
        }

        // 4. Draw Buyer Portal center (You)
        ctx.fillStyle = "rgba(99, 102, 241, 0.2)";
        ctx.beginPath();
        ctx.arc(this.mapMarkers.buyer.x, this.mapMarkers.buyer.y, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "var(--secondary)";
        ctx.beginPath();
        ctx.arc(this.mapMarkers.buyer.x, this.mapMarkers.buyer.y, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "var(--text-primary)";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText(this.mapMarkers.buyer.label, this.mapMarkers.buyer.x - 55, this.mapMarkers.buyer.y + 26);
    },

    animateMap: function() {
        this.mapMarkers.trucks.forEach(t => {
            if (t.active) {
                t.progress += t.speed;
                if (t.progress >= 1.0) {
                    t.progress = 1.0;
                    t.active = false;
                    
                    if (window.NotificationManager) {
                        window.NotificationManager.createNotification(
                            "Delivery Arrived",
                            "Your booked truck driver Rajesh has arrived at Hotel Fresh & Co. Escrow payment released.",
                            "success"
                        );
                    }

                    // Update wallet balance for buyer/farmer
                    if (window.GlobalState) {
                        // Farmer receives the amount
                        window.GlobalState.updateWallet(2800); // add simulated amount
                        // Mark order completed
                        window.GlobalState.completeOrder("ord-tracking-77");
                    }
                }
                
                // Lerp location
                t.x = 120 + (t.targetX - 120) * t.progress;
                t.y = 80 + (t.targetY - 80) * t.progress;
            }
        });

        this.drawMap();
        requestAnimationFrame(() => this.animateMap());
    },

    triggerTruckMovement: function() {
        // Activate truck movement simulation
        const truck = this.mapMarkers.trucks[0];
        truck.x = 120;
        truck.y = 80;
        truck.progress = 0;
        truck.active = true;
    },

    setupNegotiationChat: function() {
        const cropSelect = document.getElementById("negotiation-crop-select");
        const sendBtn = document.getElementById("send-negotiation-btn");
        const acceptBtn = document.getElementById("btn-accept-deal");
        const resetBtn = document.getElementById("btn-reset-deal");
        const priceInput = document.getElementById("negotiate-price-input");
        const chatDisplay = document.getElementById("negotiation-chat-display");

        if (!cropSelect) return;

        // Change select action
        cropSelect.addEventListener("change", (e) => {
            const cropVal = e.target.value;
            this.negotiationState.activeCropId = cropVal;

            if (cropVal === 'rice') {
                this.negotiationState.originalPrice = 52;
                this.negotiationState.currentPrice = 52;
            } else if (cropVal === 'tomato') {
                this.negotiationState.originalPrice = 45;
                this.negotiationState.currentPrice = 45;
            } else if (cropVal === 'onion') {
                this.negotiationState.originalPrice = 32;
                this.negotiationState.currentPrice = 32;
            }

            this.negotiationState.stage = 0;
            acceptBtn.disabled = true;

            chatDisplay.innerHTML = `
                <div class="chat-bubble farmer-msg">
                    <p>Hello! Welcome to our negotiation desk. I am Rajesh Kumar's trading assistant. We offer our fresh listing for ₹${this.negotiationState.originalPrice.toFixed(2)}/kg. What price are you offering?</p>
                    <span class="chat-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
            `;
        });

        sendBtn.addEventListener("click", () => {
            const offer = parseFloat(priceInput.value);
            if (!offer || isNaN(offer)) return;

            // Display buyer msg
            this.appendChatMsg(`I propose ₹${offer.toFixed(2)}/kg.`, 'buyer');
            priceInput.value = "";

            setTimeout(() => {
                this.evaluateNegotiationOffer(offer);
            }, 800);
        });

        acceptBtn.addEventListener("click", () => {
            // Apply price reduction to the crop in global catalog or cart!
            if (window.GlobalState) {
                const targetCropId = this.negotiationState.activeCropId;
                
                // Find in catalog and apply discounted price
                const cropIdMap = {
                    rice: "crop-1",
                    tomato: "crop-2",
                    onion: "crop-3"
                };

                const crop = window.GlobalState.crops.find(c => c.id === cropIdMap[targetCropId]);
                if (crop) {
                    crop.price = this.negotiationState.currentPrice;
                    window.GlobalState.renderMarketplace();
                    
                    if (window.NotificationManager) {
                        window.NotificationManager.createNotification(
                            "Negotiation Success",
                            `Deal locked! ${crop.name} price reduced to ₹${crop.price.toFixed(2)}/kg.`,
                            "success"
                        );
                    }
                }
            }

            this.appendChatMsg("Deal officially accepted! Placing the crop in cart with the discounted price.", "farmer");
            acceptBtn.disabled = true;
        });

        resetBtn.addEventListener("click", () => {
            cropSelect.dispatchEvent(new Event('change'));
        });
    },

    appendChatMsg: function(text, sender) {
        const chatDisplay = document.getElementById("negotiation-chat-display");
        const bubble = document.createElement("div");
        bubble.className = sender === 'buyer' ? 'chat-bubble buyer-msg' : 'chat-bubble farmer-msg';
        bubble.innerHTML = `
            <p>${text}</p>
            <span class="chat-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        `;
        chatDisplay.appendChild(bubble);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    },

    evaluateNegotiationOffer: function(offer) {
        const original = this.negotiationState.originalPrice;
        const minAcceptable = original * 0.85; // 15% discount limit
        const acceptBtn = document.getElementById("btn-accept-deal");

        let response = "";

        if (offer < original * 0.75) {
            response = `No, ₹${offer.toFixed(2)} is too low. Organic crop maintenance costs are high. The lowest price I can accept is ₹${(original * 0.95).toFixed(2)}/kg.`;
            this.negotiationState.currentPrice = original * 0.95;
            this.negotiationState.stage++;
        } else if (offer < minAcceptable) {
            const counter = offer + (original - offer) * 0.4;
            response = `That is slightly low. How about we meet in the middle at ₹${counter.toFixed(2)}/kg?`;
            this.negotiationState.currentPrice = counter;
            acceptBtn.disabled = false;
        } else {
            response = `That is a fair offer. I accept ₹${offer.toFixed(2)}/kg! Lock this deal now to update your catalog.`;
            this.negotiationState.currentPrice = offer;
            acceptBtn.disabled = false;
        }

        this.appendChatMsg(response, 'farmer');
    },

    setupCartCheckout: function() {
        const checkoutBtn = document.getElementById("btn-checkout");
        if (!checkoutBtn) return;

        checkoutBtn.addEventListener("click", () => {
            if (this.cart.length === 0) {
                if (window.NotificationManager) {
                    window.NotificationManager.createNotification("Cart Empty", "Add items to cart before checkout.", "error");
                }
                return;
            }

            // Calculate cart total
            let total = 0;
            this.cart.forEach(item => {
                total += item.price * item.quantity;
            });

            // Open payment modal
            const payOrderId = document.getElementById("pay-order-id");
            const payAmountVal = document.getElementById("pay-amount-val");
            
            const orderId = "ORD-" + Math.floor(Math.random() * 90000 + 10000);
            payOrderId.textContent = orderId;
            payAmountVal.textContent = `₹${total.toFixed(2)}`;
            payAmountVal.dataset.total = total;
            payAmountVal.dataset.orderId = orderId;

            document.getElementById("payment-modal").classList.add("active");
        });

        // Hook pay confirm button
        const payConfirmBtn = document.getElementById("btn-pay-confirm");
        if (payConfirmBtn) {
            payConfirmBtn.addEventListener("click", async () => {
                const payAmountVal = document.getElementById("pay-amount-val");
                const total = parseFloat(payAmountVal.dataset.total || 0);
                const orderId = payAmountVal.dataset.orderId || ("ORD-" + Date.now());
                const buyer = sessionStorage.getItem('agri_user') || 'buyer@fresh.com';

                const orderData = {
                    id: orderId,
                    buyer: buyer,
                    items: this.cart.map(i => i.name).join(', '),
                    crop: this.cart[0]?.name || 'Mixed',
                    qty: this.cart.reduce((sum, i) => sum + i.quantity, 0),
                    total: total,
                    status: "pending",
                    farmerLoc: "Salem, Tamil Nadu",
                    buyerLoc: "Chennai, Tamil Nadu"
                };

                try {
                    if (window.AgriDB) {
                        await window.AgriDB.addOrder(orderData);
                        await window.GlobalState.deductWallet(total);
                        await window.GlobalState.loadOrdersFromDB();
                    } else {
                        window.GlobalState.orders.unshift(orderData);
                        await window.GlobalState.deductWallet(total);
                    }
                } catch(err) {
                    console.warn("[BuyerPortal] Order save failed:", err);
                    window.GlobalState.orders.unshift(orderData);
                    await window.GlobalState.deductWallet(total);
                }

                this.cart = [];
                this.renderCart();
                document.getElementById("payment-modal").classList.remove("active");

                if (window.NotificationManager) {
                    window.NotificationManager.createNotification(
                        "Order Confirmed! 🎉",
                        `Order ${orderId} placed for ₹${total.toFixed(2)}. Farmer notified!`,
                        "success"
                    );
                }

                // Trigger map truck animation
                this.triggerTruckMovement();
                window.GlobalState.renderFarmerOrders();
            });
        }
    },

    addToCart: function(id, name, price, qty, img) {
        const itemIndex = this.cart.findIndex(i => i.id === id);

        if (itemIndex > -1) {
            this.cart[itemIndex].quantity += qty;
        } else {
            this.cart.push({ id, name, price, quantity: qty, img });
        }

        this.renderCart();
        
        if (window.NotificationManager) {
            window.NotificationManager.createNotification(
                "Added to Cart",
                `Added ${qty}kg of ${name} to your cart.`,
                "success"
            );
        }
    },

    removeFromCart: function(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.renderCart();
    },

    renderCart: function() {
        const cartList = document.getElementById("cart-items-list");
        const totalSection = document.getElementById("cart-total-section");
        const subtotalVal = document.getElementById("cart-subtotal-val");

        if (!cartList) return;

        if (this.cart.length === 0) {
            cartList.innerHTML = `<p class="empty-msg">Your shopping cart is empty.</p>`;
            totalSection.classList.add("hidden");
            return;
        }

        cartList.innerHTML = "";
        let subtotal = 0;

        this.cart.forEach(item => {
            const itemCost = item.price * item.quantity;
            subtotal += itemCost;

            const row = document.createElement("div");
            row.className = "cart-item-row";
            row.innerHTML = `
                <div class="info">
                    <h5>${item.name}</h5>
                    <p>₹${item.price.toFixed(2)}/kg × ${item.quantity}kg</p>
                </div>
                <div class="qty-price">
                    <span class="price">₹${itemCost.toFixed(2)}</span>
                    <button class="remove-item-btn" onclick="BuyerPortal.removeFromCart('${item.id}')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
            cartList.appendChild(row);
        });

        subtotalVal.textContent = `₹${subtotal.toFixed(2)}`;
        totalSection.classList.remove("hidden");
    }
};
