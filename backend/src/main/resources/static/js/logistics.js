/* Smart Logistics Coordinator - Truck Booking, Route Optimization, Cost Calculator */

window.LogisticsCoordinator = {

    truckRates: {
        mini:   { rate: 15, name: "Tata Ace Mini", capacity: "800kg" },
        medium: { rate: 22, name: "Mahindra Bolero", capacity: "1.5 Tons" },
        heavy:  { rate: 38, name: "Eicher Pro Truck", capacity: "5 Tons" }
    },

    routeOptions: {
        fastest: { etaMin: 42, etaMul: 1.0, carbonMul: 1.0 },
        cheapest: { etaMin: 55, etaMul: 0.9, carbonMul: 0.72 }
    },

    // Simulated distance (km) between farm and buyer
    distanceKm: 24.5,

    init: function() {
        const form = document.getElementById("logistics-booking-form");
        if (!form) return;

        const truckSelect = document.getElementById("truck-type");
        const routeSelect = document.getElementById("route-option");

        truckSelect.addEventListener("change", () => this.recalculate());
        routeSelect.addEventListener("change", () => this.recalculate());

        this.recalculate();

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.confirmBooking();
        });
    },

    recalculate: function() {
        const truckKey = document.getElementById("truck-type").value;
        const routeKey = document.getElementById("route-option").value;

        const truck = this.truckRates[truckKey];
        const route = this.routeOptions[routeKey];

        const cost = (this.distanceKm * truck.rate * route.etaMul).toFixed(2);
        const baseCarbon = this.distanceKm * 0.196; // kg CO2 per km standard
        const carbon = (baseCarbon * route.carbonMul).toFixed(2);
        const carbonSaved = (baseCarbon - baseCarbon * route.carbonMul).toFixed(2);

        document.getElementById("logistics-calc-distance").textContent = `${this.distanceKm} km`;
        document.getElementById("logistics-calc-eta").textContent = `${route.etaMin} minutes`;
        document.getElementById("logistics-calc-cost").textContent = `₹${cost}`;
        document.getElementById("logistics-calc-carbon").textContent =
            `${carbon} kg CO₂ (Saved ${carbonSaved} kg via eco-matching)`;
    },

    openForOrder: function(orderId, fromLocation, toLocation) {
        document.getElementById("logistics-order-id").value = orderId;
        document.getElementById("logistics-from").value = fromLocation;
        document.getElementById("logistics-to").value = toLocation;

        this.distanceKm = (Math.random() * 25 + 10).toFixed(1);
        this.recalculate();

        document.getElementById("logistics-modal").classList.add("active");
    },

    confirmBooking: function() {
        const orderId = document.getElementById("logistics-order-id").value;
        const truckKey = document.getElementById("truck-type").value;
        const truck = this.truckRates[truckKey];

        // Close logistics modal
        document.getElementById("logistics-modal").classList.remove("active");

        // Update the order row status
        const statusEl = document.getElementById("order-status-" + orderId);
        if (statusEl) {
            statusEl.innerHTML = `<span class="badge badge-success"><i class="fa-solid fa-truck"></i> In Transit</span>`;
        }

        // Start truck movement on GPS map
        if (window.BuyerPortal) {
            window.BuyerPortal.triggerTruckMovement();
        }

        // Render delivery tracker
        this.renderTrackerCard(orderId);

        // Show notification
        if (window.NotificationManager) {
            window.NotificationManager.createNotification(
                "Logistics Booked!",
                `${truck.name} booked for Order #${orderId}. Driver will depart in 15 minutes.`,
                "success"
            );
        }
    },

    renderTrackerCard: function(orderId) {
        const container = document.getElementById("buyer-tracking-container");
        if (!container) return;

        container.innerHTML = `
            <div class="order-tracking-card">
                <div class="tracking-header">
                    <span><strong>Order #${orderId}</strong></span>
                    <span class="badge badge-success"><i class="fa-solid fa-truck"></i> In Transit</span>
                </div>

                <div class="tracking-steps">
                    <div class="step-node completed">
                        <div class="step-dot"></div>
                        <span>Harvested</span>
                    </div>
                    <div class="step-node completed">
                        <div class="step-dot"></div>
                        <span>Packed</span>
                    </div>
                    <div class="step-node active">
                        <div class="step-dot"></div>
                        <span>In Transit</span>
                    </div>
                    <div class="step-node">
                        <div class="step-dot"></div>
                        <span>Arrived</span>
                    </div>
                    <div class="step-node">
                        <div class="step-dot"></div>
                        <span>Delivered</span>
                    </div>
                </div>

                <div class="driver-info-box">
                    <div>
                        <span class="driver-lbl">Driver:</span>
                        <strong> Ramu Selvam </strong> · <span class="driver-lbl">Truck: TN33 AB 4401</span>
                    </div>
                    <span class="badge badge-success"><i class="fa-solid fa-location-dot"></i> Live</span>
                </div>
            </div>
        `;
    }
};
