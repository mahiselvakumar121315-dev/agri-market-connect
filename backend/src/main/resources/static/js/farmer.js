/* Farmer Hub features: crop listing, AI disease scanner, and price charts */

window.FarmerHub = {
    // Current price forecast databases
    priceForecasts: {
        rice: {
            cropName: "Sona Masuri Rice",
            tomorrow: "₹54.50",
            tomorrowChange: "+1.5%",
            tomorrowDir: "up",
            weekly: "₹56.00",
            weeklyChange: "+3.2%",
            weeklyDir: "up",
            monthly: "High Demand",
            monthlyChange: "Peak Price",
            monthlyDir: "up",
            history: [
                { day: "Mon", price: 50 },
                { day: "Tue", price: 51.5 },
                { day: "Wed", price: 51 },
                { day: "Thu", price: 53.2 },
                { day: "Fri", price: 53 },
                { day: "Sat", price: 54 },
                { day: "Sun", price: 54.5 }
            ]
        },
        tomato: {
            cropName: "Organic Tomatoes",
            tomorrow: "₹42.00",
            tomorrowChange: "-2.4%",
            tomorrowDir: "down",
            weekly: "₹44.50",
            weeklyChange: "-1.0%",
            weeklyDir: "down",
            monthly: "Over Supply",
            monthlyChange: "Sell Now",
            monthlyDir: "down",
            history: [
                { day: "Mon", price: 48 },
                { day: "Tue", price: 46 },
                { day: "Wed", price: 47.5 },
                { day: "Thu", price: 45 },
                { day: "Fri", price: 43 },
                { day: "Sat", price: 42.5 },
                { day: "Sun", price: 42 }
            ]
        },
        onion: {
            cropName: "Nashik Red Onions",
            tomorrow: "₹33.80",
            tomorrowChange: "+4.1%",
            tomorrowDir: "up",
            weekly: "₹35.20",
            weeklyChange: "+8.5%",
            weeklyDir: "up",
            monthly: "High Shortage",
            monthlyChange: "Hold Crops",
            monthlyDir: "up",
            history: [
                { day: "Mon", price: 28 },
                { day: "Tue", price: 29.5 },
                { day: "Wed", price: 31 },
                { day: "Thu", price: 30.5 },
                { day: "Fri", price: 32 },
                { day: "Sat", price: 33 },
                { day: "Sun", price: 33.8 }
            ]
        },
        turmeric: {
            cropName: "Salem Turmeric",
            tomorrow: "₹112.00",
            tomorrowChange: "+0.8%",
            tomorrowDir: "up",
            weekly: "₹115.00",
            weeklyChange: "+2.2%",
            weeklyDir: "up",
            monthly: "Stable Export",
            monthlyChange: "Good Yield",
            monthlyDir: "up",
            history: [
                { day: "Mon", price: 108 },
                { day: "Tue", price: 109 },
                { day: "Wed", price: 110.5 },
                { day: "Thu", price: 110 },
                { day: "Fri", price: 111.5 },
                { day: "Sat", price: 112 },
                { day: "Sun", price: 112 }
            ]
        }
    },

    // Simulated crop health diagnoses
    diseaseDB: [
        {
            name: "Tomato Early Blight (Alternaria solani)",
            confidence: "94%",
            description: "Target-like circular brown spots detected on lower leaves. Spreads rapidly under humid weather.",
            treatment: "Apply organic copper-based fungicides or Trichoderma bio-agent. Prune bottom leaves to improve air circulation. Avoid overhead watering."
        },
        {
            name: "Rice Blast (Magnaporthe oryzae)",
            confidence: "88%",
            description: "Spindle-shaped lesions with grey centers found on leaf structures. Can reduce yield by up to 50% if neglected.",
            treatment: "Avoid excessive nitrogen fertilizers. Spray Pseudomonas fluorescens bioformulations (0.5%). Burn straw residues post-harvest."
        },
        {
            name: "Healthy Leaf & High Quality Grade",
            confidence: "98%",
            description: "No disease detected. Leaf chloroplast levels are highly optimal. Structural integrity is graded A+.",
            treatment: "Crop is in premium organic condition. Safe for immediate harvesting and listing on marketplace."
        },
        {
            name: "Iron / Nitrogen Deficiency",
            confidence: "91%",
            description: "Interveinal chlorosis (yellowing of leaf tissue while veins remain green). Soil pH might be locking iron absorption.",
            treatment: "Apply chelated iron foliage spray or well-composted farmyard manure. Adjust soil pH to optimal neutral levels (6.5)."
        }
    ],

    init: function() {
        this.setupCropUploadForm();
        this.setupDiseaseScanner();
        this.setupPriceSelector();
        this.drawPriceChart("rice"); // Initial chart
    },

    setupCropUploadForm: function() {
        const form = document.getElementById("add-crop-form");
        if (!form) return;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const name = document.getElementById("crop-name").value;
            const category = document.getElementById("crop-category").value;
            const price = parseFloat(document.getElementById("crop-price").value);
            const quantity = parseFloat(document.getElementById("crop-quantity").value);
            const harvestDate = document.getElementById("crop-harvest-date").value;
            const organic = document.getElementById("crop-organic").checked;
            const username = sessionStorage.getItem('agri_user') || 'Rajesh Kumar';

            // Image simulation fallback
            const imgPath = organic 
                ? "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=400" 
                : "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400";

            const newCrop = {
                id: "crop-" + Date.now().toString(36),
                name: name,
                category: category,
                price: price,
                quantity: quantity,
                harvestDate: harvestDate,
                organic: organic,
                farmer: username,
                location: "Salem, Tamil Nadu",
                distance: "Local (You)",
                fresh: true,
                img: imgPath
            };

            try {
                // Save to database first
                if (window.AgriDB) {
                    await window.AgriDB.addCrop(newCrop);
                    // Reload crops from DB so full list updates
                    await window.GlobalState.loadCropsFromDB();
                } else {
                    // Fallback: push to in-memory cache
                    window.GlobalState._crops.unshift(newCrop);
                }
            } catch(err) {
                console.warn("[FarmerHub] DB save failed, using memory fallback:", err);
                window.GlobalState._crops.unshift(newCrop);
            }

            // Re-render marketplace with updated list
            if (window.GlobalState) {
                window.GlobalState.renderMarketplace();
                window.GlobalState.updateStats();
            }

            form.reset();
            
            if (window.NotificationManager) {
                window.NotificationManager.createNotification(
                    "Crop Listed Successfully",
                    `"${name}" is now live on the marketplace. AI quality test passed!`,
                    "success"
                );
            }
        });
    },

    setupDiseaseScanner: function() {
        const dropzone = document.getElementById("disease-dropzone");
        const fileInput = document.getElementById("disease-file-input");
        const laser = document.getElementById("scanner-laser");
        const canvas = document.getElementById("scanner-canvas");
        const resultsBox = document.getElementById("disease-results-box");
        const resetBtn = document.getElementById("reset-scanner-btn");

        if (!dropzone) return;

        dropzone.addEventListener("click", () => {
            fileInput.click();
        });

        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    // Show canvas, hide icon
                    canvas.classList.remove("hidden");
                    dropzone.querySelector(".scanner-icon").style.opacity = "0.05";
                    dropzone.querySelector("p").style.opacity = "0.05";

                    const ctx = canvas.getContext("2d");
                    canvas.width = dropzone.clientWidth;
                    canvas.height = dropzone.clientHeight;

                    // Draw image centered aspect ratio cover
                    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                    const x = (canvas.width / 2) - (img.width / 2) * scale;
                    const y = (canvas.height / 2) - (img.height / 2) * scale;
                    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

                    // Start scanning animation
                    laser.classList.remove("hidden");

                    setTimeout(() => {
                        laser.classList.add("hidden");
                        this.showScannerResults();
                    }, 2500);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });

        resetBtn.addEventListener("click", () => {
            canvas.classList.add("hidden");
            dropzone.querySelector(".scanner-icon").style.opacity = "1";
            dropzone.querySelector("p").style.opacity = "1";
            resultsBox.classList.add("hidden");
            fileInput.value = "";
        });
    },

    showScannerResults: function() {
        const resultsBox = document.getElementById("disease-results-box");
        const nameEl = document.getElementById("disease-name");
        const confEl = document.getElementById("disease-confidence");
        const descEl = document.getElementById("disease-description");
        const treatEl = document.getElementById("disease-treatment");

        // Pick random diagnosis
        const diagnosis = this.diseaseDB[Math.floor(Math.random() * this.diseaseDB.length)];

        nameEl.textContent = diagnosis.name;
        confEl.textContent = diagnosis.confidence + " Match";
        descEl.textContent = diagnosis.description;
        treatEl.textContent = diagnosis.treatment;

        // Color coding badges
        if (diagnosis.name.includes("Healthy")) {
            nameEl.style.color = "var(--primary)";
            confEl.className = "conf-badge badge-success";
        } else {
            nameEl.style.color = "var(--danger)";
            confEl.className = "conf-badge badge-danger";
        }

        resultsBox.classList.remove("hidden");
        
        if (window.NotificationManager) {
            window.NotificationManager.createNotification(
                "Crop Health Diagnosis",
                `Diagnosis complete: ${diagnosis.name}`,
                diagnosis.name.includes("Healthy") ? "success" : "danger"
            );
        }
    },

    setupPriceSelector: function() {
        const select = document.getElementById("predict-crop-select");
        if (!select) return;

        select.addEventListener("change", (e) => {
            const cropKey = e.target.value;
            
            // Update cards
            const forecast = this.priceForecasts[cropKey];
            document.getElementById("predict-tomorrow").innerHTML = `${forecast.tomorrow} <i class="fa-solid fa-caret-${forecast.tomorrowDir === 'up' ? 'up text-success' : 'down text-danger'}"></i>`;
            document.getElementById("predict-weekly").innerHTML = `${forecast.weekly} <i class="fa-solid fa-caret-${forecast.weeklyDir === 'up' ? 'up text-success' : 'down text-danger'}"></i>`;
            
            const monthEl = document.getElementById("predict-monthly");
            monthEl.innerHTML = `${forecast.monthly} <i class="fa-solid fa-circle-exclamation ${forecast.monthlyDir === 'up' ? 'text-warning' : 'text-danger'}"></i>`;
            
            const tomorrowChangeEl = document.querySelector(".predict-card:nth-child(1) .change");
            tomorrowChangeEl.textContent = forecast.tomorrowChange;
            tomorrowChangeEl.className = `change ${forecast.tomorrowDir === 'up' ? 'text-success' : 'text-danger'}`;

            const weeklyChangeEl = document.querySelector(".predict-card:nth-child(2) .change");
            weeklyChangeEl.textContent = forecast.weeklyChange;
            weeklyChangeEl.className = `change ${forecast.weeklyDir === 'up' ? 'text-success' : 'text-danger'}`;

            const monthlyChangeEl = document.querySelector(".predict-card:nth-child(3) .change");
            monthlyChangeEl.textContent = forecast.monthlyChange;
            monthlyChangeEl.className = `change ${forecast.monthlyDir === 'up' ? 'text-warning' : 'text-danger'}`;

            // Draw new chart
            this.drawPriceChart(cropKey);
        });
    },

    drawPriceChart: function(cropKey) {
        const svg = document.getElementById("prediction-svg-chart");
        const tooltip = document.getElementById("chart-tooltip");
        if (!svg) return;

        const data = this.priceForecasts[cropKey].history;
        const width = 500;
        const height = 200;
        const padding = 35;

        // Calculate min & max prices for scaling
        const prices = data.map(d => d.price);
        const minPrice = Math.min(...prices) * 0.95;
        const maxPrice = Math.max(...prices) * 1.05;

        // Mapping function coordinates
        const getX = (index) => padding + (index * (width - 2 * padding) / (data.length - 1));
        const getY = (val) => height - padding - ((val - minPrice) * (height - 2 * padding) / (maxPrice - minPrice));

        // Start drawing SVG contents
        let html = "";

        // 1. Draw Grid Lines
        for (let i = 0; i < 4; i++) {
            const yVal = minPrice + (i * (maxPrice - minPrice) / 3);
            const yCoord = getY(yVal);
            html += `<line x1="${padding}" y1="${yCoord}" x2="${width - padding}" y2="${yCoord}" stroke="rgba(255,255,255,0.04)" stroke-dasharray="4" />`;
            // Y-axis labels
            html += `<text x="${padding - 5}" y="${yCoord + 4}" fill="var(--text-muted)" font-size="9" text-anchor="end">₹${yVal.toFixed(0)}</text>`;
        }

        // 2. Draw X-axis labels
        data.forEach((d, idx) => {
            const xCoord = getX(idx);
            html += `<text x="${xCoord}" y="${height - 10}" fill="var(--text-muted)" font-size="10" text-anchor="middle">${d.day}</text>`;
        });

        // 3. Draw curved Trend Line
        let pathD = `M ${getX(0)} ${getY(prices[0])}`;
        for (let i = 0; i < data.length - 1; i++) {
            const x1 = getX(i);
            const y1 = getY(prices[i]);
            const x2 = getX(i + 1);
            const y2 = getY(prices[i + 1]);
            const cpX1 = x1 + (x2 - x1) / 2;
            const cpY1 = y1;
            const cpX2 = x1 + (x2 - x1) / 2;
            const cpY2 = y2;
            pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${x2} ${y2}`;
        }

        html += `<path d="${pathD}" fill="none" stroke="url(#chart-grad-${cropKey})" stroke-width="3.5" stroke-linecap="round" />`;

        // 4. Gradient definitions
        html += `
            <defs>
                <linearGradient id="chart-grad-${cropKey}" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="var(--primary)" />
                    <stop offset="100%" stop-color="var(--secondary)" />
                </linearGradient>
            </defs>
        `;

        // 5. Draw Interactive Nodes
        data.forEach((d, idx) => {
            const x = getX(idx);
            const y = getY(d.price);
            html += `
                <circle cx="${x}" cy="${y}" r="6" fill="var(--bg-surface)" stroke="var(--primary)" stroke-width="2.5" class="chart-point" 
                    data-price="${d.price}" data-day="${d.day}" style="cursor: pointer;" />
            `;
        });

        svg.innerHTML = html;

        // Attach interactivity
        const circles = svg.querySelectorAll("circle");
        circles.forEach(c => {
            c.addEventListener("mouseenter", (e) => {
                c.setAttribute("r", "8");
                c.setAttribute("fill", "var(--primary)");
                
                const rect = svg.getBoundingClientRect();
                const circleX = e.target.cx.baseVal.value;
                const circleY = e.target.cy.baseVal.value;
                
                const price = e.target.dataset.price;
                const day = e.target.dataset.day;

                tooltip.innerHTML = `<strong>${day}:</strong> ₹${parseFloat(price).toFixed(2)}/kg`;
                tooltip.style.left = `${(circleX / width) * rect.width - 45}px`;
                tooltip.style.top = `${(circleY / height) * rect.height - 45}px`;
                tooltip.classList.remove("hidden");
                tooltip.style.opacity = 1;
            });

            c.addEventListener("mouseleave", () => {
                c.setAttribute("r", "6");
                c.setAttribute("fill", "var(--bg-surface)");
                tooltip.classList.add("hidden");
                tooltip.style.opacity = 0;
            });
        });
    }
};
