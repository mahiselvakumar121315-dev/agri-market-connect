/* Blockchain Product Traceability Simulation */

window.BlockchainTracker = {
    // Generate simulated block transaction hashes
    generateHash: function(input) {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return "0x" + Math.abs(hash).toString(16).padStart(8, '0') + Math.random().toString(36).substring(2, 10).toUpperCase();
    },

    // Get trace history timeline for a crop listing
    getTraceabilityTimeline: function(cropId, cropName, farmerName, location) {
        const seedTx = this.generateHash(cropId + "soil_planting");
        const iotTx = this.generateHash(cropId + "iot_monitoring");
        const harvestTx = this.generateHash(cropId + "harvest");
        const qcTx = this.generateHash(cropId + "qc_organic");
        const listingTx = this.generateHash(cropId + "marketplace_publish");

        return [
            {
                step: "Seed Sowing & Soil Verification",
                time: "April 10, 2026 - 08:30 AM",
                desc: `Soil organic carbon testing verified (0.82% level). Organic seeds of ${cropName} sown at ${location}.`,
                hash: seedTx,
                blockHeight: 14208
            },
            {
                step: "IoT Environmental Monitoring Logs",
                time: "April to June, 2026 (Continuous)",
                desc: "IoT soil moisture sensor node #S-841 recorded optimal hydration (40-45% average). Air temp and humidity tracked via cloud ledger.",
                hash: iotTx,
                blockHeight: 14942
            },
            {
                step: "Quality Control & Organic Certification",
                time: "July 12, 2026 - 11:15 AM",
                desc: "Crop quality assessed. Organic Certificate #ORG-IND-9284 uploaded. Zero chemical pesticide residues detected.",
                hash: qcTx,
                blockHeight: 15310
            },
            {
                step: "Harvest Event Logged",
                time: "July 14, 2026 - 06:00 AM",
                desc: `Harvest successfully completed by ${farmerName}. Yield weighed, packaged, and tagged with dynamic QR code.`,
                hash: harvestTx,
                blockHeight: 15388
            },
            {
                step: "Marketplace Listing Published",
                time: "July 15, 2026 - 10:20 AM",
                desc: `Crop published on Agri Market Connect. Initial smart-escrow pricing contract initialized.`,
                hash: listingTx,
                blockHeight: 15412
            }
        ];
    },

    // Renders the timeline into the modal
    renderTimeline: function(cropId, cropName, farmerName, location) {
        const timelineList = document.getElementById("blockchain-timeline-list");
        const nameDisplay = document.getElementById("bc-crop-name");
        const codeDisplay = document.getElementById("bc-trace-code");

        if (!timelineList) return;

        nameDisplay.textContent = cropName;
        const txCode = "AGRI-TX-" + cropId.toUpperCase() + "9B";
        codeDisplay.textContent = txCode;

        timelineList.innerHTML = "";
        const steps = this.getTraceabilityTimeline(cropId, cropName, farmerName, location);

        steps.forEach((step, idx) => {
            const stepNode = document.createElement("div");
            stepNode.className = "bc-step";
            stepNode.innerHTML = `
                <div class="bc-step-icon"></div>
                <div class="bc-step-card">
                    <div class="card-header-row">
                        <h5>${step.step}</h5>
                        <span class="badge badge-success" style="font-size: 0.65rem;">Block #${step.blockHeight}</span>
                    </div>
                    <span class="time">${step.time}</span>
                    <p style="margin-bottom: 8px; font-size: 0.75rem;">${step.desc}</p>
                    <span class="hash">TX: ${step.hash}</span>
                </div>
            `;
            timelineList.appendChild(stepNode);
        });

        // Show the modal
        document.getElementById("blockchain-modal").classList.add("active");
    }
};
