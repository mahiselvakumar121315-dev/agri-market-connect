/* Admin Control Panel - Analytics Charts, Verifications, Complaints */

window.AdminPanel = {
    // Admin analytics data
    analyticsData: {
        dailySales: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            values: [420, 580, 510, 720, 690, 830, 740],
            color: "#10b981"
        },
        categories: [
            { name: "Vegetables", value: 38, color: "#10b981" },
            { name: "Grains",     value: 28, color: "#6366f1" },
            { name: "Fruits",     value: 18, color: "#f59e0b" },
            { name: "Spices",     value: 16, color: "#0ea5e9" }
        ],
        revenue: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            values: [82000, 96000, 104000, 118000, 130000, 145000, 184200],
            color: "#6366f1"
        }
    },

    pendingVerifications: [
        {
            id: "vf-001",
            name: "Suresh Patel",
            type: "Farmer",
            location: "Nashik, Maharashtra",
            docs: "Aadhaar, Land Deed, Organic Certificate",
            status: "pending"
        },
        {
            id: "vf-002",
            name: "FreshMart Pvt Ltd",
            type: "Buyer (Bulk)",
            location: "Chennai, Tamil Nadu",
            docs: "GSTIN, Company PAN, Trade License",
            status: "pending"
        }
    ],

    complaints: [
        {
            id: "cmp-001",
            from: "Hotel Fresh & Co",
            against: "Driver - Ramu (Truck #TN33)",
            issue: "Late delivery by 3 hours. Tomatoes wilted due to no cold storage in vehicle.",
            severity: "warning",
            status: "open"
        },
        {
            id: "cmp-002",
            from: "Kavin Agro (Farmer)",
            against: "System / Payment Gateway",
            issue: "Escrow payment not released after delivery confirmation. ₹3,200 stuck.",
            severity: "danger",
            status: "escalated"
        }
    ],

    init: function() {
        this.renderBarChart();
        this.renderPieChart();
        this.renderAreaChart();
        this.renderVerifications();
        this.renderComplaints();
    },

    renderBarChart: function() {
        const canvas = document.getElementById("admin-bar-chart");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const data = this.analyticsData.dailySales;
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        const padding = { top: 20, right: 20, bottom: 30, left: 40 };
        const chartW = width - padding.left - padding.right;
        const chartH = height - padding.top - padding.bottom;

        const maxVal = Math.max(...data.values) * 1.15;
        const barW = (chartW / data.labels.length) * 0.55;
        const barGap = chartW / data.labels.length;

        // Grid lines
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + chartH - (i / 4) * chartH;
            ctx.strokeStyle = "rgba(255,255,255,0.03)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();

            ctx.fillStyle = "#64748b";
            ctx.font = "10px sans-serif";
            ctx.textAlign = "right";
            ctx.fillText(((i / 4) * maxVal).toFixed(0) + "kg", padding.left - 4, y + 4);
        }

        // Bars
        data.labels.forEach((label, i) => {
            const val = data.values[i];
            const barH = (val / maxVal) * chartH;
            const x = padding.left + i * barGap + (barGap - barW) / 2;
            const y = padding.top + chartH - barH;

            // Gradient bars
            const grad = ctx.createLinearGradient(0, y, 0, y + barH);
            grad.addColorStop(0, "#10b981");
            grad.addColorStop(1, "rgba(16,185,129,0.15)");

            ctx.fillStyle = grad;
            const radius = 6;
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + barW - radius, y);
            ctx.arcTo(x + barW, y, x + barW, y + radius, radius);
            ctx.lineTo(x + barW, y + barH);
            ctx.lineTo(x, y + barH);
            ctx.lineTo(x, y + radius);
            ctx.arcTo(x, y, x + radius, y, radius);
            ctx.closePath();
            ctx.fill();

            // Labels
            ctx.fillStyle = "#94a3b8";
            ctx.textAlign = "center";
            ctx.font = "10px sans-serif";
            ctx.fillText(label, x + barW / 2, height - 10);

            // Value on bar
            ctx.fillStyle = "#f8fafc";
            ctx.font = "bold 9px sans-serif";
            ctx.fillText(val + "kg", x + barW / 2, y - 5);
        });
    },

    renderPieChart: function() {
        const canvas = document.getElementById("admin-pie-chart");
        const legendBox = document.getElementById("pie-legend-box");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const data = this.analyticsData.categories;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = 85;
        const innerR = 45;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let total = data.reduce((acc, d) => acc + d.value, 0);
        let startAngle = -Math.PI / 2;

        data.forEach((segment) => {
            const sliceAngle = (segment.value / total) * (Math.PI * 2);

            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = segment.color;
            ctx.fill();

            // Donut hole
            ctx.beginPath();
            ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
            ctx.fillStyle = "#1e293b";
            ctx.fill();

            startAngle += sliceAngle;
        });

        // Center label
        ctx.fillStyle = "#f8fafc";
        ctx.textAlign = "center";
        ctx.font = "bold 16px Outfit, sans-serif";
        ctx.fillText("4", cx, cy - 4);
        ctx.fillStyle = "#64748b";
        ctx.font = "10px sans-serif";
        ctx.fillText("Categories", cx, cy + 12);

        // Pie Legend
        if (legendBox) {
            legendBox.innerHTML = data.map(d => `
                <div class="legend-item">
                    <span class="legend-color" style="background:${d.color}"></span>
                    <span>${d.name} (${d.value}%)</span>
                </div>
            `).join("");
        }
    },

    renderAreaChart: function() {
        const canvas = document.getElementById("admin-area-chart");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const data = this.analyticsData.revenue;
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        const padding = { top: 20, right: 20, bottom: 30, left: 50 };
        const chartW = width - padding.left - padding.right;
        const chartH = height - padding.top - padding.bottom;

        const maxVal = Math.max(...data.values) * 1.1;
        const stepX = chartW / (data.labels.length - 1);

        const getX = (i) => padding.left + i * stepX;
        const getY = (v) => padding.top + chartH - (v / maxVal) * chartH;

        // Grid
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (i / 4) * chartH;
            ctx.strokeStyle = "rgba(255,255,255,0.03)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(width - padding.right, y);
            ctx.stroke();

            const v = maxVal - (i / 4) * maxVal;
            ctx.fillStyle = "#64748b";
            ctx.font = "10px sans-serif";
            ctx.textAlign = "right";
            ctx.fillText("₹" + (v / 1000).toFixed(0) + "k", padding.left - 4, y + 4);
        }

        // Build line path
        let pathStr = [];
        data.labels.forEach((label, i) => {
            pathStr.push({ x: getX(i), y: getY(data.values[i]) });
        });

        // Gradient fill area
        const areaPath = new Path2D();
        areaPath.moveTo(pathStr[0].x, padding.top + chartH);
        pathStr.forEach(p => areaPath.lineTo(p.x, p.y));
        areaPath.lineTo(pathStr[pathStr.length - 1].x, padding.top + chartH);
        areaPath.closePath();

        const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
        grad.addColorStop(0, "rgba(99,102,241,0.4)");
        grad.addColorStop(1, "rgba(99,102,241,0.0)");
        ctx.fillStyle = grad;
        ctx.fill(areaPath);

        // Line
        ctx.strokeStyle = "#6366f1";
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.beginPath();
        pathStr.forEach((p, i) => {
            i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        // Points
        pathStr.forEach((p, i) => {
            ctx.fillStyle = "#1e293b";
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "#6366f1";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            ctx.stroke();

            // x-axis labels
            ctx.fillStyle = "#64748b";
            ctx.textAlign = "center";
            ctx.font = "10px sans-serif";
            ctx.fillText(data.labels[i], p.x, padding.top + chartH + 16);
        });
    },

    renderVerifications: function() {
        const list = document.getElementById("admin-verifications-list");
        if (!list) return;

        list.innerHTML = this.pendingVerifications.map(v => `
            <div class="verification-card">
                <div class="card-header-row">
                    <h4>${v.name} <span class="badge ${v.type.includes('Farmer') ? 'badge-success' : 'badge-warning'}">${v.type}</span></h4>
                    <span class="badge badge-warning">Pending</span>
                </div>
                <div class="card-body-details">
                    <p><i class="fa-solid fa-location-dot"></i> ${v.location}</p>
                    <p><i class="fa-solid fa-file-lines"></i> Documents: ${v.docs}</p>
                </div>
                <div class="card-actions-row">
                    <button class="primary-btn" onclick="AdminPanel.approveVerification('${v.id}', '${v.name}')">
                        <i class="fa-solid fa-circle-check"></i> Approve
                    </button>
                    <button class="secondary-btn" onclick="AdminPanel.rejectVerification('${v.id}')">
                        <i class="fa-solid fa-ban"></i> Reject
                    </button>
                </div>
            </div>
        `).join("");
    },

    approveVerification: function(id, name) {
        this.pendingVerifications = this.pendingVerifications.filter(v => v.id !== id);
        this.renderVerifications();
        const badge = document.getElementById("verification-count-badge");
        if (badge) badge.textContent = `${this.pendingVerifications.length} Pending`;

        if (window.NotificationManager) {
            window.NotificationManager.createNotification(
                "Profile Approved",
                `${name}'s account is now verified and active on the platform.`,
                "success"
            );
        }
    },

    rejectVerification: function(id) {
        this.pendingVerifications = this.pendingVerifications.filter(v => v.id !== id);
        this.renderVerifications();
        const badge = document.getElementById("verification-count-badge");
        if (badge) badge.textContent = `${this.pendingVerifications.length} Pending`;
    },

    renderComplaints: function() {
        const list = document.getElementById("admin-complaints-list");
        if (!list) return;

        list.innerHTML = this.complaints.map(c => `
            <div class="complaint-card">
                <div class="card-header-row">
                    <h4><i class="fa-solid fa-triangle-exclamation" style="color:var(--${c.severity === 'danger' ? 'danger' : 'warning'})"></i> ${c.from}</h4>
                    <span class="badge ${c.status === 'escalated' ? 'badge-danger' : 'badge-warning'}">${c.status.toUpperCase()}</span>
                </div>
                <div class="card-body-details">
                    <p style="margin-bottom:6px;"><strong>Against:</strong> ${c.against}</p>
                    <p>${c.issue}</p>
                </div>
                <div class="card-actions-row">
                    <button class="primary-btn" style="font-size:0.75rem;" onclick="AdminPanel.resolveComplaint('${c.id}')">
                        <i class="fa-solid fa-check-double"></i> Mark Resolved
                    </button>
                </div>
            </div>
        `).join("");
    },

    resolveComplaint: function(id) {
        this.complaints = this.complaints.filter(c => c.id !== id);
        this.renderComplaints();
        if (window.NotificationManager) {
            window.NotificationManager.createNotification(
                "Complaint Resolved",
                "Complaint has been marked as resolved and parties notified.",
                "success"
            );
        }
    }
};
