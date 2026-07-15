/* Speech Recognition wrapper for English and Tamil Voice Search */

window.VoiceSearch = {
    recognition: null,
    isListening: false,

    init: function(onResultCallback) {
        const triggerBtn = document.getElementById("voice-search-trigger");
        const statusPill = document.getElementById("voice-status");
        const statusText = document.getElementById("voice-status-text");

        if (!triggerBtn) return;

        // Check browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            triggerBtn.style.display = "none";
            console.log("Speech recognition not supported in this browser.");
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        
        // Listen to English & Tamil dialects
        this.recognition.lang = 'en-IN'; // defaults to English (Indian). Can fallback or capture Tamil phrases.

        triggerBtn.addEventListener("click", () => {
            if (this.isListening) {
                this.stopListening();
            } else {
                this.startListening();
            }
        });

        this.recognition.onstart = () => {
            this.isListening = true;
            statusPill.classList.remove("hidden");
            statusText.textContent = "Listening... Speak crop name";
            triggerBtn.style.color = "var(--danger)";
        };

        this.recognition.onerror = (e) => {
            console.error("Speech recognition error", e);
            this.stopListening();
        };

        this.recognition.onend = () => {
            this.stopListening();
        };

        this.recognition.onresult = (event) => {
            const resultText = event.results[0][0].transcript;
            console.log("Captured speech transcript: ", resultText);
            
            // Clean up text
            let query = resultText.replace(/\./g, "").trim();
            
            // Map common Tamil phonetic pronunciations to English if searching Catalog
            const lowerQuery = query.toLowerCase();
            if (lowerQuery.includes("thakkali") || lowerQuery.includes("தக்காளி")) {
                query = "Tomato";
            } else if (lowerQuery.includes("arisi") || lowerQuery.includes("அரிசி") || lowerQuery.includes("chawal")) {
                query = "Rice";
            } else if (lowerQuery.includes("vengayam") || lowerQuery.includes("வெங்காயம்") || lowerQuery.includes("pyaaz")) {
                query = "Onion";
            } else if (lowerQuery.includes("manjal") || lowerQuery.includes("மஞ்சள்") || lowerQuery.includes("haldi")) {
                query = "Turmeric";
            }

            // Fill search input and execute search callback
            const searchInput = document.getElementById("marketplace-search");
            if (searchInput) {
                searchInput.value = query;
                // Dispatch input event to trigger marketplace listing filter
                searchInput.dispatchEvent(new Event('input'));
            }

            if (window.NotificationManager) {
                window.NotificationManager.createNotification(
                    "Voice Search Capture",
                    `Searching for: "${query}"`,
                    "success"
                );
            }

            if (onResultCallback) onResultCallback(query);
        };
    },

    startListening: function() {
        if (this.recognition && !this.isListening) {
            try {
                this.recognition.start();
            } catch(e) {
                console.error("Failed to start speech recognition", e);
            }
        }
    },

    stopListening: function() {
        this.isListening = false;
        const triggerBtn = document.getElementById("voice-search-trigger");
        const statusPill = document.getElementById("voice-status");
        if (statusPill) statusPill.classList.add("hidden");
        if (triggerBtn) {
            triggerBtn.style.color = "";
        }
        if (this.recognition) {
            try {
                this.recognition.stop();
            } catch(e) {}
        }
    }
};
