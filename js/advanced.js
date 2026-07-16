/* ====================================================
   ADVANCED FEATURES MODULE — js/advanced.js
   16 SIH Winner-Level Features:
   Digital Twin, Satellite, Harvest AI, Quality Grading,
   Live Auction, Export Marketplace, Carbon Credits,
   Equipment Sharing, Fraud Detection, Smart Contracts,
   Pest Prediction, AI Forecasting, Offline Sync,
   Tamil Voice Assistant, Route Optimization
   ==================================================== */

window.AdvancedFeatures = {

    auctionTimer: null,
    auctionCountdown: 847,
    auctionBids: [],
    fraudFeed: [],
    carbonAngle: 0,
    contractSigned: false,

    init: function() {
        this.injectStyles();
        this.renderAllFeatures();
        this.startAuctionSimulation();
        this.startFraudFeedSimulation();
        this.animateCarbonGauge();
    },

    injectStyles: function() {
        const s = document.createElement('style');
        s.textContent = `
        .adv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(440px, 1fr)); gap: 24px; }
        .adv-panel {
            background: rgba(15,28,46,0.7); border: 1px solid rgba(255,255,255,0.07);
            border-radius: 20px; padding: 22px; backdrop-filter: blur(12px);
            transition: border-color 0.3s, transform 0.3s; position: relative; overflow: hidden;
        }
        .adv-panel:hover { border-color: rgba(16,185,129,0.3); transform: translateY(-3px); }
        .adv-panel::before {
            content:''; position:absolute; top:0; left:0; right:0; height:2px;
            background: linear-gradient(90deg, var(--primary), var(--secondary));
        }
        .adv-panel-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
        .adv-panel-title { display:flex; align-items:center; gap:10px; }
        .adv-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center;
            justify-content:center; font-size:1.1rem; background:rgba(16,185,129,0.1);
            border:1px solid rgba(16,185,129,0.2); }
        .adv-icon.purple { background:rgba(99,102,241,0.1); border-color:rgba(99,102,241,0.2); }
        .adv-icon.amber  { background:rgba(245,158,11,0.1);  border-color:rgba(245,158,11,0.2);  }
        .adv-icon.rose   { background:rgba(239,68,68,0.1);   border-color:rgba(239,68,68,0.2);   }
        .adv-icon.sky    { background:rgba(14,165,233,0.1);  border-color:rgba(14,165,233,0.2);  }
        .adv-title { font-family:'Outfit',sans-serif; font-size:1rem; font-weight:700; color:#f0fdf4; }
        .adv-badge { font-size:0.65rem; padding:3px 8px; border-radius:8px; font-weight:600;
            background:linear-gradient(135deg,rgba(16,185,129,0.2),rgba(99,102,241,0.2));
            border:1px solid rgba(16,185,129,0.25); color:#f0fdf4; }
        .adv-canvas { width:100%; border-radius:12px; display:block; border:1px solid rgba(255,255,255,0.06); }
        .adv-input { background:rgba(5,11,20,0.6); border:1px solid rgba(255,255,255,0.07);
            color:#f0fdf4; padding:10px 14px; border-radius:10px; font-size:0.85rem; width:100%;
            margin-bottom:10px; font-family:'Inter',sans-serif; }
        .adv-input:focus { outline:none; border-color:var(--primary); box-shadow:0 0 0 2px rgba(16,185,129,0.2); }
        .adv-btn { background:linear-gradient(135deg,var(--primary),#0d9488); color:white; border:none;
            padding:10px 18px; border-radius:10px; font-weight:600; cursor:pointer; font-size:0.82rem;
            display:inline-flex; align-items:center; gap:6px; transition:all 0.3s; }
        .adv-btn:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(16,185,129,0.4); }
        .adv-btn.purple { background:linear-gradient(135deg,#6366f1,#4f46e5); box-shadow:none; }
        .adv-btn.amber  { background:linear-gradient(135deg,#f59e0b,#d97706); box-shadow:none; }
        .adv-btn.rose   { background:linear-gradient(135deg,#ef4444,#dc2626); box-shadow:none; }
        .score-bar-wrap { background:rgba(255,255,255,0.04); border-radius:20px; height:8px; margin:6px 0; overflow:hidden; }
        .score-bar { height:100%; border-radius:20px; transition:width 0.8s ease; }
        .bid-item { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);
            border-radius:8px; padding:8px 12px; margin-bottom:6px; display:flex;
            justify-content:space-between; align-items:center; font-size:0.78rem; animation:bidSlide 0.4s ease; }
        @keyframes bidSlide { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        .harvest-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);
            border-radius:12px; padding:14px; margin-bottom:10px; }
        .harvest-urgency { display:inline-block; padding:3px 8px; border-radius:6px; font-size:0.68rem; font-weight:700; }
        .urgency-now    { background:rgba(239,68,68,0.15);   color:#ef4444; border:1px solid rgba(239,68,68,0.3); }
        .urgency-opt    { background:rgba(16,185,129,0.15);  color:#10b981; border:1px solid rgba(16,185,129,0.3); }
        .urgency-wait   { background:rgba(245,158,11,0.15);  color:#f59e0b; border:1px solid rgba(245,158,11,0.3); }
        .export-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);
            border-radius:12px; padding:14px; margin-bottom:10px; display:flex; gap:12px; align-items:flex-start; }
        .export-flag { font-size:2rem; line-height:1; }
        .equip-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);
            border-radius:12px; padding:14px; display:flex; gap:12px; align-items:center; margin-bottom:10px; }
        .equip-icon { width:48px; height:48px; border-radius:12px; background:rgba(99,102,241,0.1);
            border:1px solid rgba(99,102,241,0.2); display:flex; align-items:center; justify-content:center; font-size:1.4rem; }
        .fraud-item { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06);
            border-radius:10px; padding:10px 14px; margin-bottom:8px; font-size:0.75rem; animation:bidSlide 0.4s ease; }
        .pest-card { background:rgba(239,68,68,0.06); border:1px solid rgba(239,68,68,0.15);
            border-radius:12px; padding:14px; margin-bottom:10px; }
        .pest-card.warn { background:rgba(245,158,11,0.06); border-color:rgba(245,158,11,0.2); }
        .contract-preview { background:rgba(5,11,20,0.6); border:1px solid rgba(255,255,255,0.06);
            border-radius:12px; padding:16px; font-size:0.78rem; line-height:1.7;
            font-family:monospace; margin:12px 0; max-height:200px; overflow-y:auto; color:#94a3b8; }
        .contract-preview strong { color:#f0fdf4; }
        .sig-canvas { border:1px dashed rgba(16,185,129,0.3); border-radius:10px; cursor:crosshair; background:rgba(5,11,20,0.4); }
        .forecast-legend { display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
        .legend-pill { display:flex; align-items:center; gap:5px; font-size:0.72rem; cursor:pointer;
            padding:4px 10px; border-radius:8px; border:1px solid rgba(255,255,255,0.07); transition:all 0.3s; }
        .legend-dot { width:10px; height:10px; border-radius:50%; }
        .satellite-controls { display:flex; align-items:center; gap:10px; margin-top:10px; font-size:0.8rem; }
        .slider-input { flex:1; accent-color:var(--primary); }
        .carbon-flex { display:flex; align-items:center; gap:20px; }
        .carbon-stats { display:flex; flex-direction:column; gap:8px; }
        .carbon-stat { display:flex; flex-direction:column; }
        .carbon-stat .val { font-size:1.2rem; font-weight:700; color:#10b981; font-family:'Outfit',sans-serif; }
        .carbon-stat .lbl { font-size:0.7rem; color:#64748b; }
        .offline-status { display:flex; align-items:center; gap:10px; padding:12px 16px;
            background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.2); border-radius:12px; }
        .online-dot { width:10px; height:10px; border-radius:50%; background:#10b981; animation:onlinePulse 2s infinite; }
        @keyframes onlinePulse { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.4)} 50%{box-shadow:0 0 0 8px rgba(16,185,129,0)} }
        .route-step { display:flex; align-items:center; gap:10px; padding:10px;
            background:rgba(255,255,255,0.02); border-radius:8px; margin-bottom:6px; font-size:0.78rem; }
        .route-num { width:24px; height:24px; border-radius:50%; background:var(--primary);
            color:white; display:flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:700; flex-shrink:0; }
        `;
        document.head.appendChild(s);
    },

    renderAllFeatures: function() {
        const c = document.getElementById('advanced-content');
        if (!c) return;
        c.innerHTML = '<div class="adv-grid" id="adv-main-grid"></div>';
        const grid = document.getElementById('adv-main-grid');

        const panels = [
            this.renderDigitalTwin.bind(this),
            this.renderSatelliteMonitoring.bind(this),
            this.renderHarvestAdvisor.bind(this),
            this.renderQualityGrading.bind(this),
            this.renderLiveAuction.bind(this),
            this.renderExportMarketplace.bind(this),
            this.renderCarbonCredit.bind(this),
            this.renderEquipmentSharing.bind(this),
            this.renderFraudDetection.bind(this),
            this.renderSmartContracts.bind(this),
            this.renderPestPrediction.bind(this),
            this.renderAIForecasting.bind(this),
            this.renderOfflineSync.bind(this),
            this.renderTamilVoice.bind(this),
            this.renderRouteOptimization.bind(this),
            this.renderMandiBenchmark.bind(this),
            this.renderMicroLoans.bind(this),
            this.renderColdStorage.bind(this),
            this.renderAutoGST.bind(this),
            this.renderDisputeEscrow.bind(this),
        ];

        panels.forEach(fn => {
            const div = document.createElement('div');
            div.innerHTML = fn();
            if (div.firstElementChild) grid.appendChild(div.firstElementChild);
        });

        // Post-render initializations
        this.initDigitalTwin();
        this.initSatelliteCanvas();
        this.initQualityScanner();
        this.initPestMap();
        this.initForecastChart();
        this.initSignaturePad();
    },

    /* ── 1. Digital Twin Farm ─── */
    renderDigitalTwin: function() {
        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon">🌐</div>
                    <div><div class="adv-title">Digital Twin Farm</div><div style="font-size:0.72rem;color:#64748b;">Real-time 3D farm simulation</div></div>
                </div>
                <span class="adv-badge">Live Sim</span>
            </div>
            <canvas id="twin-canvas" class="adv-canvas" height="200"></canvas>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px;">
                <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.15);border-radius:8px;padding:8px;text-align:center;font-size:0.72rem;">
                    <div style="font-size:1.1rem;font-weight:700;color:#10b981;">87%</div><div style="color:#64748b;">Growth Rate</div>
                </div>
                <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.15);border-radius:8px;padding:8px;text-align:center;font-size:0.72rem;">
                    <div style="font-size:1.1rem;font-weight:700;color:#6366f1;" id="twin-soil">42%</div><div style="color:#64748b;">Soil Moisture</div>
                </div>
                <div style="background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.15);border-radius:8px;padding:8px;text-align:center;font-size:0.72rem;">
                    <div style="font-size:1.1rem;font-weight:700;color:#f59e0b;">Day 42</div><div style="color:#64748b;">Growth Day</div>
                </div>
            </div>
        </div>`;
    },

    initDigitalTwin: function() {
        const canvas = document.getElementById('twin-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.clientWidth - 44;
        canvas.height = 200;

        const W = canvas.width, H = canvas.height;
        const rows = 6, cols = 10;
        let tick = 0;

        const growthColors = ['#1e3a2f','#2d5a3d','#3b7a52','#4a9a67','#10b981','#34d399'];

        function draw() {
            ctx.fillStyle = '#050d14';
            ctx.fillRect(0, 0, W, H);

            // Isometric grid
            const cellW = W / cols;
            const cellH = H / rows / 1.5;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const phase = ((r * cols + c + tick * 0.02) % growthColors.length);
                    const colorIdx = Math.min(Math.floor(phase), growthColors.length - 1);
                    const x = c * cellW;
                    const y = r * cellH + Math.sin(tick * 0.05 + r + c) * 3;

                    // Draw plot
                    ctx.fillStyle = growthColors[colorIdx];
                    ctx.globalAlpha = 0.7 + Math.sin(tick * 0.03 + r * c) * 0.15;
                    ctx.beginPath();
                    ctx.roundRect(x + 2, y + 2, cellW - 4, cellH - 4, 4);
                    ctx.fill();

                    // Plant stem
                    if (colorIdx >= 3) {
                        ctx.globalAlpha = 0.9;
                        ctx.fillStyle = '#10b981';
                        const stemH = (colorIdx - 2) * 8;
                        ctx.fillRect(x + cellW / 2 - 1, y + cellH - stemH - 4, 2, stemH);
                        ctx.fillStyle = '#34d399';
                        ctx.beginPath();
                        ctx.arc(x + cellW / 2, y + cellH - stemH - 4, 4, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }

            ctx.globalAlpha = 1;

            // IoT sensor nodes
            [[W*0.2, H*0.5],[W*0.5, H*0.3],[W*0.8, H*0.7]].forEach(([sx,sy], i) => {
                ctx.fillStyle = `rgba(99,102,241,${0.5 + Math.sin(tick*0.1+i)*0.3})`;
                ctx.beginPath();
                ctx.arc(sx, sy, 5 + Math.sin(tick*0.08+i)*2, 0, Math.PI*2);
                ctx.fill();
                ctx.strokeStyle = 'rgba(99,102,241,0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(sx, sy, 12 + Math.sin(tick*0.08+i)*3, 0, Math.PI*2);
                ctx.stroke();
            });

            tick++;
            if (document.getElementById('twin-canvas')) requestAnimationFrame(draw);
        }
        draw();
    },

    /* ── 2. Satellite Crop Monitoring ─── */
    renderSatelliteMonitoring: function() {
        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon sky">🛰️</div>
                    <div><div class="adv-title">Satellite Crop Monitoring</div><div style="font-size:0.72rem;color:#64748b;">NDVI health index via Sentinel-2</div></div>
                </div>
                <span class="adv-badge">Live Feed</span>
            </div>
            <canvas id="sat-canvas" class="adv-canvas" height="180"></canvas>
            <div class="satellite-controls">
                <span style="font-size:0.72rem;color:#64748b;">Week:</span>
                <input type="range" min="1" max="12" value="8" class="slider-input" id="sat-slider">
                <span id="sat-week-label" style="color:#10b981;font-weight:600;font-size:0.78rem;">Week 8</span>
                <span style="margin-left:auto;font-size:0.7rem;padding:3px 8px;border-radius:6px;background:rgba(16,185,129,0.1);color:#10b981;">NDVI: 0.72</span>
            </div>
        </div>`;
    },

    initSatelliteCanvas: function() {
        const canvas = document.getElementById('sat-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.clientWidth - 44;
        canvas.height = 180;

        const slider = document.getElementById('sat-slider');
        const label = document.getElementById('sat-week-label');

        function drawSatView(week) {
            const W = canvas.width, H = canvas.height;
            ctx.fillStyle = '#030a10';
            ctx.fillRect(0, 0, W, H);

            // Draw grid patches with NDVI colors based on week
            const patchW = W / 8, patchH = H / 5;
            for (let r = 0; r < 5; r++) {
                for (let c = 0; c < 8; c++) {
                    const base = Math.sin(r * 3 + c * 2) * 0.5 + 0.5;
                    const health = Math.min(1, base * week / 12 + 0.2);
                    const r2 = Math.floor((1 - health) * 180);
                    const g2 = Math.floor(health * 200 + 40);
                    ctx.fillStyle = `rgb(${r2},${g2},30)`;
                    ctx.globalAlpha = 0.75;
                    ctx.fillRect(c * patchW + 1, r * patchH + 1, patchW - 2, patchH - 2);
                }
            }
            ctx.globalAlpha = 1;

            // Water body
            ctx.fillStyle = 'rgba(14,165,233,0.4)';
            ctx.beginPath();
            ctx.roundRect(W*0.7, H*0.3, W*0.12, H*0.25, 4);
            ctx.fill();

            // Overlay scan line
            ctx.strokeStyle = 'rgba(16,185,129,0.3)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4,4]);
            const scanY = (Date.now() / 20) % H;
            ctx.beginPath();
            ctx.moveTo(0, scanY);
            ctx.lineTo(W, scanY);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        drawSatView(8);
        slider.addEventListener('input', () => {
            const w = parseInt(slider.value);
            label.textContent = `Week ${w}`;
            drawSatView(w);
        });

        // Animate scan line
        (function animateScan() {
            const w = parseInt(slider.value);
            drawSatView(w);
            if (document.getElementById('sat-canvas')) requestAnimationFrame(animateScan);
        })();
    },

    /* ── 3. AI Harvest Advisor ─── */
    renderHarvestAdvisor: function() {
        const crops = [
            { name: 'Sona Masuri Rice', score: 92, urgency: 'now', icon: '🌾' },
            { name: 'Organic Tomatoes', score: 74, urgency: 'opt', icon: '🍅' },
            { name: 'Nashik Onions', score: 45, urgency: 'wait', icon: '🧅' },
            { name: 'Salem Turmeric', score: 60, urgency: 'opt', icon: '🌿' },
        ];

        const labels = { now: 'HARVEST NOW', opt: 'OPTIMAL', wait: 'WAIT' };
        const colors = { now: '#ef4444', opt: '#10b981', wait: '#f59e0b' };

        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon">🤖</div>
                    <div><div class="adv-title">AI Harvest Advisor</div><div style="font-size:0.72rem;color:#64748b;">Smart readiness scoring engine</div></div>
                </div>
                <span class="adv-badge">ML Model</span>
            </div>
            ${crops.map(crop => `
            <div class="harvest-card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <div style="display:flex;align-items:center;gap:8px;">
                        <span style="font-size:1.3rem;">${crop.icon}</span>
                        <span style="color:#f0fdf4;font-weight:500;font-size:0.88rem;">${crop.name}</span>
                    </div>
                    <span class="harvest-urgency urgency-${crop.urgency}">${labels[crop.urgency]}</span>
                </div>
                <div style="display:flex;align-items:center;gap:10px;">
                    <div class="score-bar-wrap" style="flex:1;">
                        <div class="score-bar" style="width:${crop.score}%;background:${colors[crop.urgency]};"></div>
                    </div>
                    <span style="font-size:0.8rem;font-weight:700;color:${colors[crop.urgency]};min-width:36px;">${crop.score}%</span>
                </div>
            </div>`).join('')}
        </div>`;
    },

    /* ── 4. AI Crop Quality Grading ─── */
    renderQualityGrading: function() {
        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon purple">📸</div>
                    <div><div class="adv-title">AI Crop Quality Grading</div><div style="font-size:0.72rem;color:#64748b;">Visual AI grader — A+/A/B/C scoring</div></div>
                </div>
                <span class="adv-badge">CV Model</span>
            </div>
            <div id="qg-drop" style="border:2px dashed rgba(99,102,241,0.3);border-radius:12px;padding:24px;text-align:center;cursor:pointer;transition:all 0.3s;" onclick="document.getElementById('qg-file').click()">
                <i class="fa-solid fa-camera-retro" style="font-size:2rem;color:#6366f1;display:block;margin-bottom:8px;"></i>
                <p style="font-size:0.82rem;color:#64748b;">Upload crop image for AI quality grade</p>
                <input type="file" id="qg-file" accept="image/*" style="display:none;">
            </div>
            <div id="qg-results" style="display:none;margin-top:14px;">
                <canvas id="qg-canvas" class="adv-canvas" height="120"></canvas>
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px;">
                    <div style="text-align:center;padding:10px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:10px;">
                        <div style="font-size:1.4rem;font-weight:800;color:#10b981;font-family:'Outfit',sans-serif;" id="qg-grade">A+</div>
                        <div style="font-size:0.65rem;color:#64748b;">Grade</div>
                    </div>
                    <div style="text-align:center;padding:10px;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.2);border-radius:10px;">
                        <div style="font-size:1rem;font-weight:700;color:#0ea5e9;" id="qg-moisture">12%</div>
                        <div style="font-size:0.65rem;color:#64748b;">Moisture</div>
                    </div>
                    <div style="text-align:center;padding:10px;background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);border-radius:10px;">
                        <div style="font-size:1rem;font-weight:700;color:#6366f1;" id="qg-freshness">96%</div>
                        <div style="font-size:0.65rem;color:#64748b;">Freshness</div>
                    </div>
                    <div style="text-align:center;padding:10px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);border-radius:10px;">
                        <div style="font-size:0.9rem;font-weight:700;color:#f59e0b;" id="qg-value">₹58</div>
                        <div style="font-size:0.65rem;color:#64748b;">Est. Price</div>
                    </div>
                </div>
            </div>
        </div>`;
    },

    initQualityScanner: function() {
        const fileInput = document.getElementById('qg-file');
        if (!fileInput) return;
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.getElementById('qg-canvas');
                    canvas.style.display = 'block';
                    canvas.width = canvas.parentElement.clientWidth - 44;
                    canvas.height = 120;
                    const ctx = canvas.getContext('2d');
                    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                    const x = (canvas.width - img.width * scale) / 2;
                    const y = (canvas.height - img.height * scale) / 2;
                    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

                    // Scan overlay
                    document.getElementById('qg-results').style.display = 'block';
                    let sy = 0;
                    const scan = setInterval(() => {
                        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                        ctx.fillStyle = 'rgba(16,185,129,0.15)';
                        ctx.fillRect(0, sy, canvas.width, 4);
                        ctx.fillStyle = 'rgba(16,185,129,0.05)';
                        ctx.fillRect(0, 0, canvas.width, sy);
                        sy += 3;
                        if (sy >= canvas.height) {
                            clearInterval(scan);
                            const grades = ['A+','A','A','B'];
                            const grade = grades[Math.floor(Math.random() * grades.length)];
                            document.getElementById('qg-grade').textContent = grade;
                            document.getElementById('qg-moisture').textContent = (Math.random() * 10 + 8).toFixed(0) + '%';
                            document.getElementById('qg-freshness').textContent = (Math.random() * 15 + 80).toFixed(0) + '%';
                            const prices = {'A+':'₹58','A':'₹52','B':'₹44'};
                            document.getElementById('qg-value').textContent = prices[grade] || '₹48';
                        }
                    }, 20);
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        });
    },

    /* ── 5. Live Auction System ─── */
    renderLiveAuction: function() {
        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon amber">🔨</div>
                    <div><div class="adv-title">Live Crop Auction</div><div style="font-size:0.72rem;color:#64748b;">Real-time competitive bidding</div></div>
                </div>
                <span class="adv-badge">LIVE</span>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:12px;padding:14px;margin-bottom:14px;">
                <div>
                    <div style="font-size:0.72rem;color:#64748b;">Current Item</div>
                    <div style="font-size:1rem;font-weight:700;color:#f0fdf4;">Alphonso Mangoes — 50kg Lot</div>
                    <div style="font-size:0.72rem;color:#64748b;margin-top:2px;">Start price: ₹180/kg</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:0.68rem;color:#f59e0b;font-weight:600;">ENDS IN</div>
                    <div style="font-size:1.5rem;font-weight:800;color:#f59e0b;font-family:'Outfit',sans-serif;" id="auction-timer">14:07</div>
                </div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <div>
                    <div style="font-size:0.72rem;color:#64748b;">Highest Bid</div>
                    <div style="font-size:1.6rem;font-weight:800;color:#10b981;font-family:'Outfit',sans-serif;" id="auction-highest">₹195.00/kg</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:0.72rem;color:#64748b;">By</div>
                    <div style="font-size:0.9rem;color:#f0fdf4;font-weight:600;" id="auction-leader">Hotel Fresh &amp; Co</div>
                </div>
            </div>
            <div style="max-height:120px;overflow-y:auto;margin-bottom:12px;" id="auction-bids"></div>
            <div style="display:flex;gap:10px;">
                <input type="number" class="adv-input" id="auction-bid-input" placeholder="Your bid (₹/kg)" style="margin-bottom:0;flex:1;">
                <button class="adv-btn amber" onclick="AdvancedFeatures.placeBid()"><i class="fa-solid fa-gavel"></i> Bid</button>
            </div>
        </div>`;
    },

    startAuctionSimulation: function() {
        const botBidders = ['GreenMart Stores','VegFresh Mumbai','AgroTrade Delhi','SpiceLane Kochi','FarmDirect Pune'];
        let currentBid = 195;

        // Countdown
        setInterval(() => {
            if (!document.getElementById('auction-timer')) return;
            this.auctionCountdown = Math.max(0, this.auctionCountdown - 1);
            const m = String(Math.floor(this.auctionCountdown / 60)).padStart(2, '0');
            const s = String(this.auctionCountdown % 60).padStart(2, '0');
            document.getElementById('auction-timer').textContent = `${m}:${s}`;
        }, 1000);

        // Bot bids
        setInterval(() => {
            if (!document.getElementById('auction-bids')) return;
            currentBid += Math.floor(Math.random() * 5) + 1;
            const bidder = botBidders[Math.floor(Math.random() * botBidders.length)];
            document.getElementById('auction-highest').textContent = `₹${currentBid}.00/kg`;
            document.getElementById('auction-leader').textContent = bidder;
            this.addBidEntry(bidder, currentBid, false);
        }, 4000);
    },

    placeBid: function() {
        const input = document.getElementById('auction-bid-input');
        const val = parseFloat(input.value);
        if (!val || val <= 0) return;
        document.getElementById('auction-highest').textContent = `₹${val.toFixed(2)}/kg`;
        document.getElementById('auction-leader').textContent = 'You (Hotel Fresh & Co)';
        this.addBidEntry('You', val, true);
        input.value = '';
    },

    addBidEntry: function(bidder, amount, isYou) {
        const container = document.getElementById('auction-bids');
        if (!container) return;
        const item = document.createElement('div');
        item.className = 'bid-item';
        item.style.borderColor = isYou ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)';
        item.innerHTML = `
            <span style="color:${isYou ? '#10b981' : '#94a3b8'};">${isYou ? '🏆 ' : ''}${bidder}</span>
            <span style="font-weight:700;color:${isYou ? '#10b981' : '#f0fdf4'};">₹${amount.toFixed(2)}/kg</span>
        `;
        container.insertBefore(item, container.firstChild);
        if (container.children.length > 6) container.removeChild(container.lastChild);
    },

    /* ── 6. Export Marketplace ─── */
    renderExportMarketplace: function() {
        const buyers = [
            { flag: '🇦🇪', country: 'UAE', company: 'Al Madinah Trading LLC', crop: 'Basmati Rice, Spices', vol: '50 Tons/month', price: '$0.85/kg' },
            { flag: '🇸🇬', country: 'Singapore', company: 'Pacific Fresh Imports', crop: 'Organic Vegetables', vol: '20 Tons/month', price: '$1.20/kg' },
            { flag: '🇬🇧', country: 'UK', company: 'Indo Agri Ltd', crop: 'Turmeric, Chilli', vol: '15 Tons/month', price: '$2.40/kg' },
        ];
        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon sky">🌍</div>
                    <div><div class="adv-title">Export Marketplace</div><div style="font-size:0.72rem;color:#64748b;">International bulk buyer network</div></div>
                </div>
                <span class="adv-badge">Global</span>
            </div>
            ${buyers.map(b => `
            <div class="export-card">
                <div class="export-flag">${b.flag}</div>
                <div style="flex:1;">
                    <div style="font-weight:600;color:#f0fdf4;font-size:0.88rem;">${b.company}</div>
                    <div style="font-size:0.72rem;color:#64748b;margin:2px 0;">${b.country} · ${b.crop}</div>
                    <div style="font-size:0.72rem;"><span style="color:#10b981;">${b.vol}</span> · <span style="color:#6366f1;font-weight:600;">${b.price}</span></div>
                </div>
                <button class="adv-btn" style="padding:7px 12px;font-size:0.72rem;" onclick="AdvancedFeatures.sendProposal('${b.company}')">
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>`).join('')}
        </div>`;
    },

    sendProposal: function(company) {
        if (window.NotificationManager) {
            window.NotificationManager.createNotification('Proposal Sent', `Export proposal submitted to ${company}. Expected response: 2-3 business days.`, 'success');
        }
    },

    /* ── 7. Carbon Credit Dashboard ─── */
    renderCarbonCredit: function() {
        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon">🌱</div>
                    <div><div class="adv-title">Carbon Credit Dashboard</div><div style="font-size:0.72rem;color:#64748b;">Organic farming carbon offset tracker</div></div>
                </div>
                <span class="adv-badge">Green Score</span>
            </div>
            <div class="carbon-flex">
                <canvas id="carbon-canvas" width="140" height="140"></canvas>
                <div class="carbon-stats">
                    <div class="carbon-stat"><div class="val" id="carbon-credits">847</div><div class="lbl">Carbon Credits Earned</div></div>
                    <div class="carbon-stat"><div class="val" style="color:#6366f1;">12.4T</div><div class="lbl">CO₂ Saved This Year</div></div>
                    <div class="carbon-stat"><div class="val" style="color:#f59e0b;">₹42,350</div><div class="lbl">Credit Market Value</div></div>
                    <button class="adv-btn" style="margin-top:8px;font-size:0.78rem;" onclick="AdvancedFeatures.tradeCarbonCredits()">
                        <i class="fa-solid fa-arrows-rotate"></i> Trade Credits
                    </button>
                </div>
            </div>
        </div>`;
    },

    animateCarbonGauge: function() {
        const canvas = document.getElementById('carbon-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let angle = -Math.PI / 2;
        const target = -Math.PI / 2 + (Math.PI * 2 * 0.73);

        const draw = () => {
            ctx.clearRect(0, 0, 140, 140);
            const cx = 70, cy = 70, r = 55;

            // Background ring
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255,255,255,0.06)';
            ctx.lineWidth = 12;
            ctx.stroke();

            // Progress arc
            ctx.beginPath();
            ctx.arc(cx, cy, r, -Math.PI / 2, angle);
            const grad = ctx.createLinearGradient(0, 0, 140, 140);
            grad.addColorStop(0, '#10b981');
            grad.addColorStop(1, '#6366f1');
            ctx.strokeStyle = grad;
            ctx.lineWidth = 12;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Center text
            ctx.fillStyle = '#f0fdf4';
            ctx.font = 'bold 16px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('73%', cx, cy + 2);
            ctx.fillStyle = '#64748b';
            ctx.font = '10px Inter, sans-serif';
            ctx.fillText('Green Score', cx, cy + 16);

            if (angle < target) {
                angle += 0.025;
                if (document.getElementById('carbon-canvas')) requestAnimationFrame(draw);
            }
        };
        setTimeout(draw, 600);
    },

    tradeCarbonCredits: function() {
        if (window.NotificationManager) {
            window.NotificationManager.createNotification('Carbon Credits', '847 credits listed on Carbon Exchange. Potential earning: ₹42,350.', 'success');
        }
    },

    /* ── 8. Equipment Sharing ─── */
    renderEquipmentSharing: function() {
        const equip = [
            { icon: '🚜', name: 'John Deere 5310 Tractor', owner: 'Murugan Farms', rate: '₹1,800/day', avail: true },
            { icon: '🌾', name: 'Combine Harvester CH-480', owner: 'AgriRent Salem', rate: '₹4,200/day', avail: true },
            { icon: '💧', name: 'Boom Sprayer 800L', owner: 'Karthik Agro', rate: '₹650/day', avail: false },
        ];
        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon purple">🤝</div>
                    <div><div class="adv-title">Equipment Sharing</div><div style="font-size:0.72rem;color:#64748b;">Rent farm machinery from neighbours</div></div>
                </div>
                <span class="adv-badge">Peer-to-Peer</span>
            </div>
            ${equip.map(e => `
            <div class="equip-card">
                <div class="equip-icon">${e.icon}</div>
                <div style="flex:1;">
                    <div style="font-weight:600;color:#f0fdf4;font-size:0.85rem;">${e.name}</div>
                    <div style="font-size:0.7rem;color:#64748b;">${e.owner} · ${e.rate}</div>
                </div>
                ${e.avail 
                    ? `<button class="adv-btn" style="padding:7px 12px;font-size:0.72rem;" onclick="AdvancedFeatures.bookEquipment('${e.name}')"><i class="fa-solid fa-calendar-check"></i> Book</button>`
                    : `<span style="font-size:0.72rem;padding:5px 10px;border-radius:8px;background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.2);">Booked</span>`
                }
            </div>`).join('')}
        </div>`;
    },

    bookEquipment: function(name) {
        if (window.NotificationManager) {
            window.NotificationManager.createNotification('Equipment Booked', `${name} booking request sent! Owner will confirm within 2 hours.`, 'success');
        }
    },

    /* ── 9. AI Fraud Detection ─── */
    renderFraudDetection: function() {
        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon rose">🧠</div>
                    <div><div class="adv-title">AI Fraud Detection</div><div style="font-size:0.72rem;color:#64748b;">Real-time transaction trust scoring</div></div>
                </div>
                <span class="adv-badge" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);color:#ef4444;">Monitoring</span>
            </div>
            <div id="fraud-feed" style="max-height:220px;overflow-y:auto;"></div>
        </div>`;
    },

    startFraudFeedSimulation: function() {
        const transactions = [
            { id: 'TX-8812', user: 'Hotel Fresh & Co', amount: '₹2,600', risk: 12, flag: null },
            { id: 'TX-8813', user: 'Unknown Buyer #442', amount: '₹18,000', risk: 87, flag: 'Large unusual transaction' },
            { id: 'TX-8814', user: 'GreenMart Stores', amount: '₹3,200', risk: 8, flag: null },
            { id: 'TX-8815', user: 'New Account #991', amount: '₹9,500', risk: 64, flag: 'New account high value' },
            { id: 'TX-8816', user: 'FreshDirect Chennai', amount: '₹1,800', risk: 5, flag: null },
        ];

        let idx = 0;
        const addFraudItem = () => {
            const container = document.getElementById('fraud-feed');
            if (!container) return;
            const tx = transactions[idx % transactions.length];
            idx++;
            const color = tx.risk > 70 ? '#ef4444' : tx.risk > 40 ? '#f59e0b' : '#10b981';
            const item = document.createElement('div');
            item.className = 'fraud-item';
            item.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <span style="color:#f0fdf4;font-weight:500;">${tx.id} — ${tx.user}</span>
                    <span style="color:${color};font-weight:700;">${tx.risk}% risk</span>
                </div>
                <div class="score-bar-wrap"><div class="score-bar" style="width:${tx.risk}%;background:${color};"></div></div>
                ${tx.flag ? `<div style="margin-top:5px;font-size:0.68rem;color:${color};"><i class="fa-solid fa-triangle-exclamation"></i> ${tx.flag}</div>` : ''}
                <div style="margin-top:6px;display:flex;gap:6px;">
                    <span style="font-size:0.68rem;color:#64748b;">${tx.amount}</span>
                    ${tx.risk > 60 ? `<span style="font-size:0.68rem;padding:1px 6px;border-radius:4px;background:rgba(239,68,68,0.1);color:#ef4444;margin-left:auto;">⚠ Auto-flagged</span>` : ''}
                </div>
            `;
            container.insertBefore(item, container.firstChild);
            if (container.children.length > 5) container.removeChild(container.lastChild);
        };

        addFraudItem(); addFraudItem(); addFraudItem();
        setInterval(addFraudItem, 5000);
    },

    /* ── 10. Smart Digital Contracts ─── */
    renderSmartContracts: function() {
        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon">🧾</div>
                    <div><div class="adv-title">Smart Digital Contracts</div><div style="font-size:0.72rem;color:#64748b;">Auto-generated escrow contracts</div></div>
                </div>
                <span class="adv-badge">Blockchain</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                <input class="adv-input" id="sc-crop" placeholder="Crop name" style="margin-bottom:0;">
                <input class="adv-input" id="sc-qty" placeholder="Quantity (kg)" style="margin-bottom:0;" type="number">
                <input class="adv-input" id="sc-price" placeholder="Price/kg (₹)" style="margin-bottom:0;" type="number">
                <input class="adv-input" id="sc-date" placeholder="Delivery date" style="margin-bottom:0;" type="date">
            </div>
            <button class="adv-btn purple" style="width:100%;justify-content:center;margin-top:10px;" onclick="AdvancedFeatures.generateContract()">
                <i class="fa-solid fa-file-contract"></i> Generate Contract
            </button>
            <div id="sc-preview" style="display:none;">
                <div class="contract-preview" id="sc-content"></div>
                <div style="margin-bottom:8px;font-size:0.78rem;color:#94a3b8;">Digital Signature:</div>
                <canvas id="sig-canvas" class="sig-canvas adv-canvas" height="70"></canvas>
                <div style="display:flex;gap:8px;margin-top:8px;">
                    <button class="adv-btn" onclick="AdvancedFeatures.submitContract()" style="flex:1;justify-content:center;">
                        <i class="fa-solid fa-check-double"></i> Sign & Submit
                    </button>
                    <button class="adv-btn" style="background:rgba(255,255,255,0.05);box-shadow:none;border:1px solid rgba(255,255,255,0.1);color:#94a3b8;" onclick="AdvancedFeatures.clearSignature()">
                        <i class="fa-solid fa-eraser"></i>
                    </button>
                </div>
            </div>
        </div>`;
    },

    generateContract: function() {
        const crop = document.getElementById('sc-crop').value || 'Organic Tomatoes';
        const qty = document.getElementById('sc-qty').value || '100';
        const price = document.getElementById('sc-price').value || '45';
        const date = document.getElementById('sc-date').value || '2026-07-30';
        const total = (parseFloat(qty) * parseFloat(price)).toFixed(2);
        const txid = 'AGRI-CTR-' + Math.random().toString(36).substring(2,8).toUpperCase();

        document.getElementById('sc-content').innerHTML = `
            <strong>SMART AGRICULTURAL CONTRACT</strong><br>
            Contract ID: ${txid}<br>
            Date Issued: ${new Date().toLocaleDateString('en-IN')}<br>
            ─────────────────────────────<br>
            <strong>SELLER (Farmer):</strong> Rajesh Kumar<br>
            Aadhaar: XXXX-XXXX-8421 | Farm: Salem, TN<br><br>
            <strong>BUYER:</strong> Hotel Fresh & Co, Chennai<br>
            GSTIN: 33AABCF1234Z1Z5<br><br>
            <strong>CROP:</strong> ${crop}<br>
            <strong>QUANTITY:</strong> ${qty} kg<br>
            <strong>PRICE:</strong> ₹${price}/kg<br>
            <strong>TOTAL VALUE:</strong> ₹${total}<br>
            <strong>DELIVERY DATE:</strong> ${date}<br><br>
            Payment via Smart Escrow. Released upon delivery confirmation.<br>
            ─────────────────────────────<br>
            This contract is recorded on Agri Market Blockchain.
        `;
        document.getElementById('sc-preview').style.display = 'block';
        this.initSignaturePad();
    },

    initSignaturePad: function() {
        const canvas = document.getElementById('sig-canvas');
        if (!canvas) return;
        canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth - 44 : 360;
        canvas.height = 70;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(5,11,20,0.4)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = '#475569';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Draw your signature here', canvas.width/2, canvas.height/2 + 4);

        let drawing = false;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
        };

        canvas.addEventListener('mousedown', (e) => { drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); });
        canvas.addEventListener('mousemove', (e) => { if (!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); });
        canvas.addEventListener('mouseup', () => { drawing = false; });
        canvas.addEventListener('mouseleave', () => { drawing = false; });
    },

    clearSignature: function() {
        const canvas = document.getElementById('sig-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(5,11,20,0.4)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
    },

    submitContract: function() {
        if (window.NotificationManager) {
            window.NotificationManager.createNotification('Contract Signed', 'Smart contract signed and recorded on Agri Blockchain. Escrow activated!', 'success');
        }
    },

    /* ── 11. Pest Outbreak Prediction ─── */
    renderPestPrediction: function() {
        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon rose">🦟</div>
                    <div><div class="adv-title">Pest Outbreak Prediction</div><div style="font-size:0.72rem;color:#64748b;">AI early warning system</div></div>
                </div>
                <span class="adv-badge" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);color:#ef4444;">2 Alerts</span>
            </div>
            <canvas id="pest-map" class="adv-canvas" height="140"></canvas>
            <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
                <span style="display:flex;align-items:center;gap:4px;font-size:0.68rem;"><span style="width:10px;height:10px;border-radius:2px;background:rgba(239,68,68,0.6);display:inline-block;"></span>Outbreak</span>
                <span style="display:flex;align-items:center;gap:4px;font-size:0.68rem;"><span style="width:10px;height:10px;border-radius:2px;background:rgba(245,158,11,0.6);display:inline-block;"></span>Caution</span>
                <span style="display:flex;align-items:center;gap:4px;font-size:0.68rem;"><span style="width:10px;height:10px;border-radius:2px;background:rgba(16,185,129,0.5);display:inline-block;"></span>Safe</span>
            </div>
            <div class="pest-card">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                    <strong style="color:#ef4444;font-size:0.82rem;">🔴 Fall Armyworm (Salem District)</strong>
                    <span style="font-size:0.7rem;color:#ef4444;">HIGH RISK</span>
                </div>
                <p style="font-size:0.72rem;color:#94a3b8;">Detected in maize fields. Spreading NE. <strong style="color:#f0fdf4;">Apply Emamectin Benzoate 5 SG</strong> immediately.</p>
            </div>
            <div class="pest-card warn">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                    <strong style="color:#f59e0b;font-size:0.82rem;">🟡 Whitefly Infestation (Namakkal)</strong>
                    <span style="font-size:0.7rem;color:#f59e0b;">MONITOR</span>
                </div>
                <p style="font-size:0.72rem;color:#94a3b8;">Cotton & tomato risk. Use <strong style="color:#f0fdf4;">yellow sticky traps + Imidacloprid spray</strong>.</p>
            </div>
        </div>`;
    },

    initPestMap: function() {
        const canvas = document.getElementById('pest-map');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.parentElement.clientWidth - 44;
        canvas.height = 140;
        const W = canvas.width, H = canvas.height;

        ctx.fillStyle = '#070f1a';
        ctx.fillRect(0, 0, W, H);

        const zones = [
            { x: W*0.2, y: H*0.35, r: 30, color: 'rgba(239,68,68,0.6)', label: 'Salem' },
            { x: W*0.5, y: H*0.5, r: 22, color: 'rgba(245,158,11,0.6)', label: 'Namakkal' },
            { x: W*0.75, y: H*0.3, r: 18, color: 'rgba(16,185,129,0.5)', label: 'Erode' },
            { x: W*0.35, y: H*0.7, r: 15, color: 'rgba(16,185,129,0.5)', label: 'Dharmapuri' },
            { x: W*0.85, y: H*0.7, r: 14, color: 'rgba(16,185,129,0.5)', label: 'Coimbatore' },
        ];

        zones.forEach(z => {
            const grad = ctx.createRadialGradient(z.x, z.y, 0, z.x, z.y, z.r);
            grad.addColorStop(0, z.color);
            grad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(z.x, z.y, z.r, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            ctx.fillStyle = '#94a3b8';
            ctx.font = '9px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(z.label, z.x, z.y + z.r + 10);
        });
    },

    /* ── 12. AI Demand & Price Forecasting ─── */
    renderAIForecasting: function() {
        return `<div class="adv-panel" style="grid-column: span 2;">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon">📈</div>
                    <div><div class="adv-title">AI Demand & Price Forecasting</div><div style="font-size:0.72rem;color:#64748b;">Multi-crop demand curves with 30-day forecast</div></div>
                </div>
                <span class="adv-badge">LSTM Model</span>
            </div>
            <svg id="forecast-svg" viewBox="0 0 700 200" style="width:100%;height:200px;"></svg>
            <div class="forecast-legend" id="forecast-legend"></div>
        </div>`;
    },

    initForecastChart: function() {
        const svg = document.getElementById('forecast-svg');
        if (!svg) return;

        const crops = [
            { name: 'Rice', color: '#10b981', data: [50,51,52,51,53,54,53,55,56,55,57,58,56,57,59,60,58,59,61,62,60,61,63,64,62,63,65,66,64,65] },
            { name: 'Tomato', color: '#ef4444', data: [48,46,47,45,43,42,44,43,41,42,40,39,41,40,38,39,37,38,36,35,37,36,34,35,33,34,32,31,33,32] },
            { name: 'Onion', color: '#f59e0b', data: [28,29,31,30,32,33,34,33,35,36,35,37,38,37,39,40,39,41,42,41,43,44,43,45,46,45,47,48,47,49] },
            { name: 'Turmeric', color: '#6366f1', data: [108,109,110,110,111,112,112,113,114,113,115,116,115,117,118,117,119,120,119,121,122,121,123,124,123,125,126,125,127,128] },
            { name: 'Chilli', color: '#0ea5e9', data: [65,66,68,67,69,70,69,71,72,71,73,74,73,75,76,75,77,78,77,79,80,79,81,82,81,83,84,83,85,86] },
        ];

        const W = 700, H = 200, padL = 40, padR = 20, padT = 10, padB = 30;
        const chartW = W - padL - padR, chartH = H - padT - padB;
        const days = 30, forecastStart = 20;

        const allVals = crops.flatMap(c => c.data);
        const minV = Math.min(...allVals) * 0.95;
        const maxV = Math.max(...allVals) * 1.05;

        const getX = i => padL + (i / (days - 1)) * chartW;
        const getY = v => padT + chartH - ((v - minV) / (maxV - minV)) * chartH;

        let html = '';

        // Forecast zone
        html += `<rect x="${getX(forecastStart)}" y="${padT}" width="${getX(days-1)-getX(forecastStart)}" height="${chartH}" fill="rgba(255,255,255,0.02)" rx="0"/>`;
        html += `<text x="${getX(forecastStart)+4}" y="${padT+12}" fill="#475569" font-size="9">── AI Forecast</text>`;

        // Grid lines
        for (let i = 0; i <= 4; i++) {
            const v = minV + (i/4)*(maxV-minV);
            const y = getY(v);
            html += `<line x1="${padL}" y1="${y}" x2="${W-padR}" y2="${y}" stroke="rgba(255,255,255,0.04)" stroke-dasharray="3"/>`;
            html += `<text x="${padL-4}" y="${y+3}" fill="#475569" font-size="9" text-anchor="end">₹${v.toFixed(0)}</text>`;
        }

        // X-axis
        [0,5,10,15,20,25,29].forEach(i => {
            html += `<text x="${getX(i)}" y="${H-8}" fill="#475569" font-size="9" text-anchor="middle">D${i+1}</text>`;
        });

        // Crop lines
        crops.forEach(crop => {
            let d = `M ${getX(0)} ${getY(crop.data[0])}`;
            for (let i = 1; i < days; i++) {
                const x1 = getX(i-1), y1 = getY(crop.data[i-1]);
                const x2 = getX(i),   y2 = getY(crop.data[i]);
                d += ` C ${x1+(x2-x1)/2} ${y1}, ${x1+(x2-x1)/2} ${y2}, ${x2} ${y2}`;
            }
            html += `<path d="${d}" fill="none" stroke="${crop.color}" stroke-width="2" stroke-opacity="0.9" class="forecast-line" data-crop="${crop.name}"/>`;
        });

        svg.innerHTML = html;

        // Legend
        const legend = document.getElementById('forecast-legend');
        if (legend) {
            legend.innerHTML = crops.map(c => `
                <div class="legend-pill" onclick="AdvancedFeatures.toggleForecastLine('${c.name}')">
                    <span class="legend-dot" style="background:${c.color};"></span>
                    <span>${c.name}</span>
                </div>
            `).join('');
        }
    },

    toggleForecastLine: function(cropName) {
        const line = document.querySelector(`.forecast-line[data-crop="${cropName}"]`);
        if (!line) return;
        const hidden = line.style.opacity === '0.1';
        line.style.opacity = hidden ? '0.9' : '0.1';
        line.style.transition = 'opacity 0.3s';
    },

    /* ── 13. Offline Sync ─── */
    renderOfflineSync: function() {
        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon sky">📶</div>
                    <div><div class="adv-title">Offline Sync Mode</div><div style="font-size:0.72rem;color:#64748b;">Works without internet connection</div></div>
                </div>
                <span class="adv-badge">PWA Ready</span>
            </div>
            <div class="offline-status">
                <div class="online-dot"></div>
                <div>
                    <div style="font-weight:600;color:#10b981;font-size:0.88rem;">Online — All systems synced</div>
                    <div style="font-size:0.72rem;color:#64748b;">Last sync: Just now · 3 pending uploads</div>
                </div>
            </div>
            <div style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <div style="background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.15);border-radius:10px;padding:12px;">
                    <div style="font-weight:700;color:#10b981;font-size:1rem;">12</div>
                    <div style="font-size:0.68rem;color:#64748b;">Listings cached offline</div>
                </div>
                <div style="background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.15);border-radius:10px;padding:12px;">
                    <div style="font-weight:700;color:#6366f1;font-size:1rem;">3</div>
                    <div style="font-size:0.68rem;color:#64748b;">Orders queued to sync</div>
                </div>
            </div>
            <button class="adv-btn" style="width:100%;justify-content:center;margin-top:12px;" onclick="AdvancedFeatures.forceSync()">
                <i class="fa-solid fa-arrows-rotate"></i> Force Sync Now
            </button>
        </div>`;
    },

    forceSync: function() {
        if (window.NotificationManager) {
            window.NotificationManager.createNotification('Sync Complete', '3 pending orders synced. 12 listings updated from server.', 'success');
        }
    },

    /* ── 14. Tamil Voice Assistant ─── */
    renderTamilVoice: function() {
        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon amber">🎤</div>
                    <div><div class="adv-title">Tamil Voice Assistant</div><div style="font-size:0.72rem;color:#64748b;">Speak in Tamil — AI understands</div></div>
                </div>
                <span class="adv-badge">NLP Powered</span>
            </div>
            <div style="text-align:center;padding:20px 0;">
                <button id="tamil-voice-btn" style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));border:none;color:white;font-size:2rem;cursor:pointer;box-shadow:0 0 30px var(--primary-glow);transition:all 0.3s;" onclick="AdvancedFeatures.toggleTamilVoice()">
                    <i class="fa-solid fa-microphone"></i>
                </button>
                <p id="tamil-voice-status" style="margin-top:12px;font-size:0.8rem;color:#64748b;">Click mic to speak in Tamil</p>
            </div>
            <div id="tamil-voice-output" style="background:rgba(5,11,20,0.4);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px;min-height:60px;font-size:0.8rem;color:#94a3b8;font-style:italic;">
                Say: "தக்காளி விலை என்ன?" or "உரம் பரிந்துரை கொடு"
            </div>
            <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px;">
                ${['தக்காளி விலை?','அரிசி சந்தை?','PM-KISAN திட்டம்','வானிலை அறிக்கை'].map(p => 
                    `<button class="adv-btn" style="font-size:0.7rem;padding:5px 10px;" onclick="AdvancedFeatures.tamilQuery('${p}')">${p}</button>`
                ).join('')}
            </div>
        </div>`;
    },

    tamilVoiceActive: false,
    toggleTamilVoice: function() {
        const btn = document.getElementById('tamil-voice-btn');
        const status = document.getElementById('tamil-voice-status');

        if (this.tamilVoiceActive) {
            this.tamilVoiceActive = false;
            btn.style.background = 'linear-gradient(135deg,var(--primary),var(--secondary))';
            status.textContent = 'Click mic to speak in Tamil';
            return;
        }

        this.tamilVoiceActive = true;
        btn.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
        btn.style.boxShadow = '0 0 30px rgba(239,68,68,0.5)';
        status.textContent = 'கேட்கிறேன்... (Listening...)';

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const rec = new SpeechRecognition();
            rec.lang = 'ta-IN';
            rec.onresult = (e) => {
                const text = e.results[0][0].transcript;
                this.tamilQuery(text);
                this.tamilVoiceActive = false;
                btn.style.background = 'linear-gradient(135deg,var(--primary),var(--secondary))';
                btn.style.boxShadow = '';
                status.textContent = 'Click mic to speak in Tamil';
            };
            rec.onerror = () => { this.tamilVoiceActive = false; status.textContent = 'Mic not available. Use quick prompts below.'; };
            rec.start();
        } else {
            setTimeout(() => {
                this.tamilQuery('தக்காளி விலை என்ன?');
                this.tamilVoiceActive = false;
                btn.style.background = 'linear-gradient(135deg,var(--primary),var(--secondary))';
                btn.style.boxShadow = '';
                status.textContent = 'Click mic to speak in Tamil';
            }, 2000);
        }
    },

    tamilQuery: function(text) {
        const output = document.getElementById('tamil-voice-output');
        if (!output) return;
        const responses = {
            'தக்காளி விலை': 'தக்காளி இன்றைய விலை: ₹42 - ₹45 / கிலோ. சந்தை தற்போது சீராக உள்ளது.',
            'அரிசி சந்தை': 'சோனா மசூரி அரிசி: ₹52 - ₹56 / கிலோ. விலை அதிகரிக்கும் வாய்ப்பு உள்ளது.',
            'PM-KISAN': 'PM-KISAN திட்டத்தில் ஆண்டுக்கு ₹6,000 நேரடியாக உங்கள் வங்கி கணக்கில் வரவு வைக்கப்படும்.',
            'வானிலை': 'நாளை மழை எதிர்பார்க்கப்படுகிறது. அறுவடையை ஒத்திவையுங்கள்.',
        };
        const key = Object.keys(responses).find(k => text.includes(k));
        const reply = key ? responses[key] : `"${text}" — AI பதில்: இந்த கேள்வி குறித்த விவரங்கள் சேகரிக்கப்படுகின்றன...`;
        output.textContent = reply;
        output.style.color = '#f0fdf4';
        output.style.fontStyle = 'normal';
    },

    /* ── 15. AI Route Optimization ─── */
    renderRouteOptimization: function() {
        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon purple">🚛</div>
                    <div><div class="adv-title">AI Route Optimization</div><div style="font-size:0.72rem;color:#64748b;">Multi-drop delivery path optimizer</div></div>
                </div>
                <span class="adv-badge">Google Maps AI</span>
            </div>
            <div style="background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.15);border-radius:12px;padding:12px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <div style="font-size:0.72rem;color:#64748b;">Optimized Route Saved</div>
                    <div style="font-weight:700;color:#6366f1;font-size:1.1rem;">42 min · 24.5 km</div>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:0.72rem;color:#64748b;">CO₂ Saved</div>
                    <div style="font-weight:700;color:#10b981;">1.8 kg</div>
                </div>
            </div>
            <div id="route-steps">
                ${[
                    { num:1, label:'Salem Farm (Rajesh Kumar)', dist:'Start', time:'06:00 AM' },
                    { num:2, label:'Omalur Collection Point', dist:'8.2 km', time:'06:22 AM' },
                    { num:3, label:'Attur Warehouse', dist:'14.6 km', time:'06:48 AM' },
                    { num:4, label:'Chennai — Hotel Fresh & Co', dist:'24.5 km', time:'07:18 AM' },
                ].map(s => `
                <div class="route-step">
                    <div class="route-num">${s.num}</div>
                    <div style="flex:1;">
                        <div style="color:#f0fdf4;font-weight:500;font-size:0.82rem;">${s.label}</div>
                        <div style="font-size:0.68rem;color:#64748b;">${s.dist} · ETA ${s.time}</div>
                    </div>
                    ${s.num < 4 ? '<i class="fa-solid fa-arrow-down" style="color:#475569;font-size:0.7rem;"></i>' : '<i class="fa-solid fa-flag-checkered" style="color:#10b981;"></i>'}
                </div>`).join('')}
            </div>
            <button class="adv-btn purple" style="width:100%;justify-content:center;margin-top:12px;" onclick="AdvancedFeatures.shareRoute()">
                <i class="fa-solid fa-share-nodes"></i> Share Route with Driver
            </button>
        </div>`;
    },

    shareRoute: function() {
        if (window.NotificationManager) {
            window.NotificationManager.createNotification('Route Shared', 'Optimized delivery route sent to driver Ramu via SMS & WhatsApp.', 'success');
        }
    },

    /* ── 16. Mandi Benchmark Pricing ─── */
    renderMandiBenchmark: function() {
        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon amber">⚖️</div>
                    <div><div class="adv-title">Mandi Benchmark Check</div><div style="font-size:0.72rem;color:#64748b;">Live APMC price vs Your Price</div></div>
                </div>
                <span class="adv-badge">Real-Time</span>
            </div>
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:12px;margin-bottom:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <span style="font-size:0.85rem;color:#f0fdf4;">Organic Tomatoes</span>
                    <span style="font-size:0.75rem;color:#10b981;">Salem Mandi</span>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <div style="font-size:0.65rem;color:#64748b;">Your Listed Price</div>
                        <div style="font-size:1.2rem;font-weight:700;color:#ef4444;">₹40/kg</div>
                    </div>
                    <div>
                        <div style="font-size:0.65rem;color:#64748b;">Mandi Average</div>
                        <div style="font-size:1.2rem;font-weight:700;color:#10b981;">₹18/kg</div>
                    </div>
                </div>
                <div style="margin-top:10px;padding:8px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.2);border-radius:8px;font-size:0.72rem;color:#ef4444;display:flex;gap:6px;">
                    <i class="fa-solid fa-triangle-exclamation" style="margin-top:2px;"></i>
                    <span>Warning: Your price is 122% above the mandi average. Buyers are likely to reject. Consider lowering to ₹22/kg.</span>
                </div>
            </div>
            <button class="adv-btn amber" style="width:100%;justify-content:center;" onclick="AdvancedFeatures.adjustPrice()">
                <i class="fa-solid fa-arrow-down-up-across-line"></i> Auto-Adjust to ₹22/kg
            </button>
        </div>`;
    },
    
    adjustPrice: function() {
        if (window.NotificationManager) window.NotificationManager.createNotification('Price Adjusted', 'Tomato listing updated to competitive price of ₹22/kg.', 'success');
    },

    /* ── 17. Micro-Loans & Credit ─── */
    renderMicroLoans: function() {
        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon sky">💸</div>
                    <div><div class="adv-title">Micro-Loans & Credit</div><div style="font-size:0.72rem;color:#64748b;">Pre-harvest input financing</div></div>
                </div>
                <span class="adv-badge">FinTech</span>
            </div>
            <div style="display:flex;gap:10px;margin-bottom:12px;">
                <div style="flex:1;background:rgba(14,165,233,0.1);border:1px solid rgba(14,165,233,0.2);border-radius:10px;padding:12px;text-align:center;">
                    <div style="font-size:0.65rem;color:#64748b;margin-bottom:4px;">Eligible Credit</div>
                    <div style="font-size:1.2rem;font-weight:700;color:#0ea5e9;">₹25,000</div>
                </div>
                <div style="flex:1;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:12px;text-align:center;">
                    <div style="font-size:0.65rem;color:#64748b;margin-bottom:4px;">Interest Rate</div>
                    <div style="font-size:1.2rem;font-weight:700;color:#f0fdf4;">4.5% <span style="font-size:0.7rem;">p.a.</span></div>
                </div>
            </div>
            <p style="font-size:0.72rem;color:#94a3b8;margin-bottom:12px;line-height:1.4;">Based on your <strong>Digital Twin crop health</strong> and past successful deliveries, you are pre-approved for an input loan. No collateral required.</p>
            <button class="adv-btn" style="width:100%;justify-content:center;" onclick="AdvancedFeatures.applyLoan()">
                <i class="fa-solid fa-hand-holding-dollar"></i> Request ₹25,000 Loan
            </button>
        </div>`;
    },

    applyLoan: function() {
        if (window.NotificationManager) window.NotificationManager.createNotification('Loan Requested', '₹25,000 Micro-loan requested. NBFC partner will disburse in 2 hours.', 'success');
    },

    /* ── 18. Cold Storage Booking ─── */
    renderColdStorage: function() {
        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon sky">❄️</div>
                    <div><div class="adv-title">Cold Storage Booking</div><div style="font-size:0.72rem;color:#64748b;">Prevent post-harvest wastage</div></div>
                </div>
                <span class="adv-badge">Logistics</span>
            </div>
            <div class="equip-card">
                <div class="equip-icon" style="background:rgba(14,165,233,0.1);border-color:rgba(14,165,233,0.2);color:#0ea5e9;">❄️</div>
                <div style="flex:1;">
                    <div style="font-weight:600;color:#f0fdf4;font-size:0.85rem;">Salem Cold Chain Co.</div>
                    <div style="font-size:0.7rem;color:#64748b;">4.2 km away · Temp: 2°C to 8°C</div>
                    <div style="font-size:0.7rem;color:#10b981;margin-top:2px;">12 Pallets Available</div>
                </div>
            </div>
            <div style="display:flex;gap:10px;">
                <input type="number" class="adv-input" placeholder="Pallets (e.g. 2)" style="margin-bottom:0;width:40%;">
                <button class="adv-btn" style="flex:1;justify-content:center;" onclick="AdvancedFeatures.bookStorage()">
                    <i class="fa-solid fa-snowflake"></i> Book Slot
                </button>
            </div>
        </div>`;
    },

    bookStorage: function() {
        if (window.NotificationManager) window.NotificationManager.createNotification('Storage Booked', '2 Pallets booked at Salem Cold Chain. Drop off before 6 PM.', 'success');
    },

    /* ── 19. Auto GST & E-Invoice ─── */
    renderAutoGST: function() {
        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon purple">📑</div>
                    <div><div class="adv-title">Auto GST & E-Invoice</div><div style="font-size:0.72rem;color:#64748b;">Compliance & inter-state e-way bills</div></div>
                </div>
                <span class="adv-badge">Regulatory</span>
            </div>
            <div class="contract-preview" style="background:rgba(99,102,241,0.05);border-color:rgba(99,102,241,0.2);margin:0 0 12px 0;">
                <strong style="color:#6366f1;">PENDING INVOICE: ORDER #4821</strong><br>
                Buyer: Hotel Fresh & Co (TN)<br>
                Value: ₹12,500.00 (Excl. Tax)<br>
                CGST (2.5%): ₹312.50<br>
                SGST (2.5%): ₹312.50<br>
                <strong>Total: ₹13,125.00</strong>
            </div>
            <div style="display:flex;gap:10px;">
                <button class="adv-btn purple" style="flex:1;justify-content:center;" onclick="AdvancedFeatures.generateInvoice()">
                    <i class="fa-solid fa-file-invoice"></i> Gen GST Bill
                </button>
                <button class="adv-btn" style="flex:1;justify-content:center;background:rgba(255,255,255,0.05);color:#f0fdf4;box-shadow:none;" onclick="AdvancedFeatures.generateInvoice()">
                    <i class="fa-solid fa-truck-fast"></i> E-Way Bill
                </button>
            </div>
        </div>`;
    },

    generateInvoice: function() {
        if (window.NotificationManager) window.NotificationManager.createNotification('Invoice Generated', 'GST Invoice & E-Way bill generated successfully. Sent to buyer.', 'success');
    },

    /* ── 20. Dispute Escrow Resolution ─── */
    renderDisputeEscrow: function() {
        return `<div class="adv-panel">
            <div class="adv-panel-header">
                <div class="adv-panel-title">
                    <div class="adv-icon rose">⚖️</div>
                    <div><div class="adv-title">Smart Escrow & Disputes</div><div style="font-size:0.72rem;color:#64748b;">Neutral QC verification hold</div></div>
                </div>
                <span class="adv-badge" style="background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);color:#ef4444;">1 Action Req</span>
            </div>
            <div class="pest-card" style="margin-bottom:12px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                    <strong style="color:#ef4444;font-size:0.82rem;">Dispute: Order #3319</strong>
                    <span style="font-size:0.7rem;color:#ef4444;">₹18,000 HELD</span>
                </div>
                <p style="font-size:0.72rem;color:#94a3b8;margin-bottom:8px;">Buyer claimed moisture >14% in wheat load. Funds locked in smart contract.</p>
                <div style="display:flex;gap:8px;">
                    <button class="adv-btn" style="padding:4px 8px;font-size:0.65rem;" onclick="AdvancedFeatures.resolveDispute('AI')">Request AI Re-Scan</button>
                    <button class="adv-btn rose" style="padding:4px 8px;font-size:0.65rem;" onclick="AdvancedFeatures.resolveDispute('Agent')">Call Neutral Agent</button>
                </div>
            </div>
        </div>`;
    },

    resolveDispute: function(type) {
        if (window.NotificationManager) window.NotificationManager.createNotification('Dispute Action', `${type} intervention requested. Escrow remains locked until resolved.`, 'warning');
    }
};

/* ── Auto-initialize when Advanced tab is clicked ─── */
document.addEventListener('DOMContentLoaded', function() {
    let initialized = false;
    document.addEventListener('click', function(e) {
        const navItem = e.target.closest('.nav-item[data-tab="advanced"]');
        if (navItem && !initialized) {
            initialized = true;
            setTimeout(() => window.AdvancedFeatures.init(), 100);
        }
    });
});
