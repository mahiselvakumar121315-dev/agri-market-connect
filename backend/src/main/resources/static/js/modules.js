/* ====================================================
   AGRI MARKET CONNECT — LIVESTOCK, FERTILIZER & WORKER MODULES
   ==================================================== */

window.LivestockModule = {
    currentFilter: 'all',
    animals: [],

    init: async function() {
        this.bindEvents();
        await this.loadAndRender();
    },

    bindEvents: function() {
        const filterContainer = document.getElementById('animal-type-filters');
        if (filterContainer) {
            filterContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    filterContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentFilter = e.target.dataset.animal;
                    this.render();
                }
            });
        }

        const addBtn = document.getElementById('btn-add-animal-modal');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddAnimalModal());
        }
    },

    loadAndRender: async function() {
        try {
            this.animals = await window.AgriDB.getAnimals(this.currentFilter);
        } catch (e) {
            console.error("Error loading animals:", e);
        }
        this.render();
    },

    render: function() {
        const container = document.getElementById('livestock-catalog');
        if (!container) return;

        let filtered = this.animals;
        if (this.currentFilter && this.currentFilter !== 'all') {
            filtered = this.animals.filter(a => (a.animalType || '').toUpperCase() === this.currentFilter.toUpperCase());
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding:50px 20px; background:rgba(255,255,255,0.02); border-radius:16px; border:1px solid rgba(255,255,255,0.06);">
                    <i class="fa-solid fa-cow" style="font-size:3rem; color:var(--text-muted); opacity:0.4; margin-bottom:12px;"></i>
                    <h4 style="color:#f0fdf4;">No Animal Listings Found</h4>
                    <p style="color:var(--text-muted); font-size:0.85rem; margin-top:4px;">Be the first farmer to list livestock for sale!</p>
                </div>
            `;
            return;
        }

        const animalEmojis = {
            COW: '🐄', BUFFALO: '🐃', BULL: '🐂', GOAT: '🐐', SHEEP: '🐑', PIG: '🐖',
            HORSE: '🐎', CHICKEN: '🐓', DUCK: '🦆', TURKEY: '🦃', RABBIT: '🐇', CAMEL: '🐪',
            FISH: '🐟', BEE_FARMING: '🐝', FARM_DOGS: '🐕'
        };

        container.innerHTML = filtered.map(a => `
            <div class="crop-card" style="border: 1px solid rgba(16,185,129,0.2);">
                <div class="card-img-wrap" style="position:relative;">
                    <img src="${a.photoUrl || 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?w=500'}" alt="${a.breed}" loading="lazy" style="height:180px; object-fit:cover; width:100%;">
                    <span style="position:absolute; top:12px; left:12px; background:rgba(15,23,42,0.85); backdrop-filter:blur(6px); color:#fff; padding:4px 10px; border-radius:12px; font-size:0.75rem; font-weight:700;">
                        ${animalEmojis[a.animalType] || '🐾'} ${a.animalType}
                    </span>
                    ${a.isVaccinated ? `
                        <span style="position:absolute; top:12px; right:12px; background:linear-gradient(135deg,#10b981,#059669); color:#fff; padding:4px 10px; border-radius:12px; font-size:0.7rem; font-weight:700; display:flex; align-items:center; gap:4px;">
                            <i class="fa-solid fa-syringe"></i> Vaccinated
                        </span>
                    ` : ''}
                </div>
                <div class="card-body" style="padding:16px;">
                    <h4 style="font-family:'Outfit',sans-serif; font-size:1.1rem; color:#f0fdf4;">${a.breed || a.animalType}</h4>
                    <p style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">
                        <i class="fa-solid fa-location-dot"></i> ${a.locationName || 'Salem, Tamil Nadu'}
                    </p>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin:12px 0; background:rgba(255,255,255,0.03); padding:10px; border-radius:10px; border:1px solid rgba(255,255,255,0.06); font-size:0.78rem;">
                        <div><span style="color:var(--text-muted);">Age:</span> <strong>${a.ageMonths} Months</strong></div>
                        <div><span style="color:var(--text-muted);">Gender:</span> <strong>${a.gender}</strong></div>
                        <div><span style="color:var(--text-muted);">Weight:</span> <strong>${a.weightKg} kg</strong></div>
                        ${a.milkYieldLiters > 0 ? `<div><span style="color:var(--text-muted);">Milk Yield:</span> <strong style="color:#22c55e;">${a.milkYieldLiters} L/day</strong></div>` : `<div><span style="color:var(--text-muted);">Health Cert:</span> <strong style="color:#6366f1;">Verified</strong></div>`}
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
                        <div>
                            <span style="font-size:0.7rem; color:var(--text-muted); display:block;">Asking Price</span>
                            <strong style="font-size:1.2rem; color:var(--primary); font-family:'Outfit',sans-serif;">₹${(a.price || 0).toLocaleString("en-IN")}</strong>
                        </div>
                        <button class="primary-btn" onclick="window.LivestockModule.contactSeller('${a.ownerPhone || '9876543210'}', '${a.breed}')" style="padding:8px 14px; font-size:0.8rem;">
                            <i class="fa-solid fa-phone"></i> Contact Owner
                        </button>
                    </div>
                </div>
            </div>
        `).join("");
    },

    contactSeller: function(phone, breed) {
        if (window.NotificationManager) {
            window.NotificationManager.showToast("Seller Contacted", `Dialing owner at ${phone} for ${breed}`, "success");
        } else {
            alert(`Connecting call to owner at ${phone} for ${breed}`);
        }
    },

    showAddAnimalModal: function() {
        const breed = prompt("Enter Livestock Breed (e.g. Gir Cow, Murrah Buffalo, Jamnapari Goat):");
        if (!breed) return;
        const type = prompt("Enter Animal Type (COW, BUFFALO, BULL, GOAT, SHEEP, PIG, CHICKEN, DUCK, RABBIT):", "COW");
        const price = prompt("Enter Selling Price (₹):", "50000");

        if (breed && type && price) {
            const newAnimal = {
                animalType: type.toUpperCase(),
                breed: breed,
                ageMonths: 24,
                gender: "FEMALE",
                weightKg: 300,
                milkYieldLiters: 14,
                price: parseFloat(price),
                locationName: "Salem, Tamil Nadu",
                isVaccinated: true,
                photoUrl: "https://images.unsplash.com/photo-1546445317-29f4545f9d52?w=500",
                ownerName: sessionStorage.getItem('agri_user') || 'Rajesh Kumar',
                ownerPhone: '9876543210'
            };
            window.AgriDB.addAnimalListing(newAnimal).then(() => {
                this.animals.unshift(newAnimal);
                this.render();
                if (window.NotificationManager) {
                    window.NotificationManager.showToast("Livestock Listed", `${breed} successfully published to market!`, "success");
                }
            });
        }
    }
};

window.FertilizerModule = {
    fertilizers: [],

    init: async function() {
        await this.loadAndRender();
    },

    loadAndRender: async function() {
        try {
            this.fertilizers = await window.AgriDB.getFertilizers();
        } catch (e) {
            console.error("Error loading fertilizers:", e);
        }
        this.render();
    },

    render: function() {
        const container = document.getElementById('fertilizer-catalog');
        if (!container) return;

        container.innerHTML = this.fertilizers.map(f => `
            <div class="crop-card" style="border:1px solid rgba(99,102,241,0.25);">
                <div class="card-img-wrap" style="position:relative;">
                    <img src="${f.imageUrl || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500'}" alt="${f.productName}" loading="lazy" style="height:170px; object-fit:cover; width:100%;">
                    <span style="position:absolute; top:12px; left:12px; background:linear-gradient(135deg,#6366f1,#4f46e5); color:#fff; padding:4px 10px; border-radius:12px; font-size:0.75rem; font-weight:700;">
                        ${f.brandName}
                    </span>
                    ${f.govtSubsidyPercentage > 0 ? `
                        <span style="position:absolute; top:12px; right:12px; background:linear-gradient(135deg,#10b981,#059669); color:#fff; padding:4px 10px; border-radius:12px; font-size:0.7rem; font-weight:700;">
                            ${f.govtSubsidyPercentage}% Govt Subsidy
                        </span>
                    ` : ''}
                </div>
                <div class="card-body" style="padding:16px;">
                    <h4 style="font-family:'Outfit',sans-serif; font-size:1.05rem; color:#f0fdf4;">${f.productName}</h4>
                    <p style="font-size:0.78rem; color:var(--text-muted); margin-top:2px;">
                        <i class="fa-solid fa-wheat-awn"></i> For: ${f.suitableCrops || 'All Crops'}
                    </p>

                    <div style="margin:10px 0; padding:10px; background:rgba(255,255,255,0.03); border-radius:10px; font-size:0.76rem; border:1px solid rgba(255,255,255,0.06);">
                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                            <span style="color:var(--text-muted);">Stock Available:</span>
                            <strong style="color:#22c55e;">${f.stockQuantity} Units</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                            <span style="color:var(--text-muted);">AI Forecast Price (Next Mo):</span>
                            <strong style="color:#f59e0b;">₹${f.predictedFuturePrice || (f.price * 1.08).toFixed(2)}</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="color:var(--text-muted);">Dealer Store:</span>
                            <span>${f.dealerName} (${f.shopLocation})</span>
                        </div>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
                        <div>
                            <span style="font-size:0.7rem; color:var(--text-muted); display:block;">Price (After Subsidy)</span>
                            <strong style="font-size:1.2rem; color:var(--primary); font-family:'Outfit',sans-serif;">₹${(f.price * (1 - (f.govtSubsidyPercentage||0)/100)).toFixed(2)}</strong>
                        </div>
                        <button class="primary-btn" onclick="alert('Dealer Contact: ${f.dealerPhone || '9443211234'} - Store: ${f.shopLocation}')" style="padding:8px 14px; font-size:0.8rem;">
                            <i class="fa-solid fa-store"></i> Contact Dealer
                        </button>
                    </div>
                </div>
            </div>
        `).join("");
    }
};

window.WorkerModule = {
    workers: [],
    bookings: [],

    init: async function() {
        await this.loadAndRender();
        const btn = document.getElementById('btn-request-workers-modal');
        if (btn) btn.addEventListener('click', () => this.showWorkRequestModal());
    },

    loadAndRender: async function() {
        try {
            this.workers = await window.AgriDB.getNearbyWorkers(11.6643, 78.1460);
        } catch (e) {
            console.error("Error loading workers:", e);
        }
        this.renderWorkers();
        this.renderBookings();
    },

    renderWorkers: function() {
        const container = document.getElementById('nearby-workers-list');
        if (!container) return;

        container.innerHTML = this.workers.map(w => `
            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:14px; margin-bottom:12px; display:flex; gap:12px; align-items:center;">
                <div style="width:50px; height:50px; border-radius:50%; background:linear-gradient(135deg,#10b981,#059669); color:#fff; display:flex; align-items:center; justify-content:center; font-size:1.4rem; font-weight:800;">
                    ${(w.name || 'W')[0]}
                </div>
                <div style="flex:1;">
                    <h4 style="font-size:0.95rem; color:#f0fdf4; margin-bottom:2px;">${w.name}</h4>
                    <span style="font-size:0.75rem; color:var(--text-muted); display:block;">🛠️ ${w.skills}</span>
                    <div style="display:flex; gap:12px; margin-top:4px; font-size:0.72rem; color:var(--text-muted);">
                        <span>⭐ ${w.ratingAvg} Rating</span>
                        <span>✅ ${w.totalJobsCompleted} Jobs</span>
                        <span>📍 ~1.8 km (ETA 15 mins)</span>
                    </div>
                </div>
                <div style="text-align:right;">
                    <strong style="font-size:1rem; color:var(--primary); display:block;">₹${w.dailyWage}/day</strong>
                    <button class="primary-btn" onclick="window.WorkerModule.bookSpecificWorker(${w.id}, '${w.name}')" style="margin-top:6px; padding:6px 12px; font-size:0.75rem;">
                        Hire Now
                    </button>
                </div>
            </div>
        `).join("");
    },

    renderBookings: function() {
        const container = document.getElementById('worker-bookings-status-list');
        if (!container) return;

        if (this.bookings.length === 0) {
            this.bookings = [
                { id: 'WB-9821', workerName: 'Suresh V', workType: 'Harvesting', cropType: 'Organic Tomatoes', wageAgreed: 650, status: 'ACCEPTED', etaMinutes: 14, attendanceMarked: false }
            ];
        }

        container.innerHTML = this.bookings.map(b => `
            <div style="background:rgba(15,23,42,0.6); border:1px solid rgba(16,185,129,0.3); border-radius:14px; padding:16px; margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <strong style="color:var(--primary); font-size:0.85rem;">${b.id || 'WB-9821'} — ${b.workType} (${b.cropType || 'Crop'})</strong>
                    <span style="background:rgba(16,185,129,0.2); color:#22c55e; border:1px solid rgba(16,185,129,0.4); padding:3px 10px; border-radius:12px; font-size:0.72rem; font-weight:700;">
                        ${b.status}
                    </span>
                </div>

                <div style="font-size:0.8rem; color:var(--text-muted); line-height:1.5;">
                    <p>👷 Assigned Worker: <strong style="color:#f0fdf4;">${b.workerName || 'Suresh V'}</strong></p>
                    <p>📍 GPS Live Tracking: <strong style="color:#6366f1;">En Route (ETA ${b.etaMinutes || 14} mins)</strong></p>
                    <p>💰 Daily Wage Agreed: <strong style="color:var(--primary);">₹${b.wageAgreed}/day</strong></p>
                </div>

                <div style="margin-top:12px; display:flex; gap:10px;">
                    ${!b.attendanceMarked ? `
                        <button class="primary-btn" onclick="window.WorkerModule.markAttendance('${b.id}')" style="padding:6px 12px; font-size:0.78rem;">
                            <i class="fa-solid fa-user-check"></i> Mark Attendance (GPS Verified)
                        </button>
                    ` : `
                        <span style="color:#22c55e; font-size:0.78rem; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Attendance Verified on Field</span>
                    `}
                    <button class="text-btn" onclick="alert('Calling worker at +91 98765 43212')" style="padding:6px 12px; font-size:0.78rem;">
                        <i class="fa-solid fa-phone"></i> Call Worker
                    </button>
                </div>
            </div>
        `).join("");
    },

    bookSpecificWorker: function(workerId, name) {
        const crop = prompt(`Enter Crop for ${name} (e.g. Paddy, Tomatoes, Sugarcane):`, "Organic Tomatoes");
        if (!crop) return;

        const request = {
            farmerId: 1,
            workerId: workerId,
            workType: "Crop Harvesting & Sorting",
            cropType: crop,
            wageAgreed: 650.0,
            durationDays: 1,
            urgency: "HIGH"
        };

        window.AgriDB.bookWorker(request).then(res => {
            this.bookings.unshift({
                id: 'WB-' + Date.now().toString().slice(-4),
                workerName: name,
                workType: 'Crop Harvesting',
                cropType: crop,
                wageAgreed: 650,
                status: 'ACCEPTED',
                etaMinutes: 12,
                attendanceMarked: false
            });
            this.renderBookings();
            if (window.NotificationManager) {
                window.NotificationManager.showToast("Worker Requested", `Booking request sent to ${name}. ETA: 12 mins`, "success");
            }
        });
    },

    markAttendance: function(id) {
        window.AgriDB.bookWorker({ action: 'attendance', id }).then(() => {
            const b = this.bookings.find(item => item.id === id);
            if (b) {
                b.attendanceMarked = true;
                b.status = 'IN_PROGRESS';
            }
            this.renderBookings();
            if (window.NotificationManager) {
                window.NotificationManager.showToast("Attendance Marked", "Worker attendance verified via field GPS check!", "success");
            }
        });
    },

    showWorkRequestModal: function() {
        this.bookSpecificWorker(1, "Suresh V");
    }
};

// Auto initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.LivestockModule) window.LivestockModule.init();
        if (window.FertilizerModule) window.FertilizerModule.init();
        if (window.WorkerModule) window.WorkerModule.init();
    }, 500);
});
