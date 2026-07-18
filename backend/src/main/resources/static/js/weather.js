/* Weather Module Integration & Harvest Recommendations */

window.WeatherMonitor = {
    // Simulated weather conditions
    conditions: [
        { temp: "29°C", humidity: "78%", windSpeed: "14 km/h", desc: "Moderate Rain Forecasted", icon: "fa-cloud-showers-water", alert: true, suggestion: "Delay harvest of grains. Fungal risk is high. Cover harvested stacks." },
        { temp: "33°C", humidity: "42%", windSpeed: "10 km/h", desc: "Clear Sunny Day", icon: "fa-sun", alert: false, suggestion: "Ideal harvest weather for Rice and Cotton. Ensure immediate drying post-harvest." },
        { temp: "26°C", humidity: "90%", windSpeed: "22 km/h", desc: "Heavy Storm Warning", icon: "fa-cloud-bolt", alert: true, suggestion: "High winds expected. Harvest mature fruits immediately. Clear irrigation channels." },
        { temp: "30°C", humidity: "60%", windSpeed: "12 km/h", desc: "Partly Cloudy", icon: "fa-cloud-sun", alert: false, suggestion: "Optimal soil planting conditions. Soil humidity is stable." }
    ],

    currentIdx: 0,

    init: function() {
        // Change weather every 3 minutes for simulation dynamic feeling
        this.updateWidget();
        setInterval(() => {
            this.currentIdx = (this.currentIdx + 1) % this.conditions.length;
            this.updateWidget();
        }, 180000);
    },

    updateWidget: function() {
        const weatherWidget = document.getElementById("header-weather");
        if (!weatherWidget) return;

        const current = this.conditions[this.currentIdx];
        
        weatherWidget.innerHTML = `
            <i class="fa-solid ${current.icon} weather-icon" style="color: ${current.alert ? 'var(--warning)' : 'var(--info)'}"></i>
            <div class="weather-info">
                <span class="temp">${current.temp} (${current.humidity} RH)</span>
                <span class="desc">${current.desc}</span>
            </div>
        `;

        // Send a toast notification if it is an alert condition
        if (current.alert && window.NotificationManager) {
            window.NotificationManager.createNotification(
                "Weather Alert",
                `${current.desc}! ${current.suggestion}`,
                "warning"
            );
        }

        // Dynamically update irrigation suggestions on the Farmer dashboard
        const irrigationEl = document.getElementById("irrigation-suggestion");
        if (irrigationEl) {
            if (current.desc.includes("Rain") || current.desc.includes("Storm")) {
                irrigationEl.textContent = "Next Irrigation: Cancelled due to expected precipitation.";
                irrigationEl.style.color = "var(--primary)";
            } else {
                irrigationEl.textContent = "Next Watering: Scheduled in 12 hours (optimal)";
                irrigationEl.style.color = "";
            }
        }
    },

    getCurrentCondition: function() {
        return this.conditions[this.currentIdx];
    }
};
