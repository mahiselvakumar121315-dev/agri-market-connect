/* Multi-lingual AI Chatbot Simulation */

window.AgriChatbot = {
    currentLang: 'en',

    // Simulated responses corpus
    responses: {
        en: {
            welcome: "Hello! I am your Agri AI Assistant. Ask me anything about crop cultivation, fertilizers, government schemes, or current marketplace prices!",
            default: "That is a great question. In general, sustainable organic farming increases long-term soil health. Could you clarify if you are asking about fertilizers, crop prices, or government subsidies?",
            price: "Today's market prices:\n- Sona Masuri Rice: ₹52.00 - ₹56.00/kg\n- Tomatoes: ₹40.00 - ₹45.00/kg\n- Onions: ₹30.00 - ₹34.00/kg.\nPrice trend is currently stable.",
            fertilizer: "For organic farming, we recommend vermicompost, neem cake, and biofertilizers like Azotobacter. For nitrogen deficiency, apply decomposed farmyard manure.",
            scheme: "Active government schemes:\n1. **PM-KISAN**: ₹6,000/year support.\n2. **Kisan Credit Card (KCC)**: Low-interest loans.\n3. **Soil Health Card Scheme**: Free soil testing and nutrition reports.",
            disease: "To prevent fungal wilt diseases in tomatoes, ensure proper drainage, use Trichoderma viride bio-pesticide, and practice crop rotation with grains.",
            prompts: [
                "What is the market price of Rice?",
                "Recommend organic fertilizers",
                "PM-KISAN Scheme details",
                "How to control Tomato disease?"
            ]
        },
        ta: {
            welcome: "வணக்கம்! நான் உங்கள் விவசாய அசிஸ்டண்ட். பயிர் சாகுபடி, உரங்கள், அரசு திட்டங்கள் அல்லது சந்தை விலைகள் பற்றி என்னிடம் கேளுங்கள்!",
            default: "நல்ல கேள்வி. பொதுவாக, இயற்கை விவசாயம் மண்ணின் வளத்தை அதிகரிக்கும். உரங்கள், பயிர் விலைகள் அல்லது அரசு மானியங்கள் பற்றி கேட்கிறீர்களா?",
            price: "இன்றைய சந்தை நிலவரம்:\n- சோனா மசூரி அரிசி: ₹52 - ₹56/கிலோ\n- தக்காளி: ₹40 - ₹45/கிலோ\n- வெங்காயம்: ₹30 - ₹34/கிலோ. சந்தை தற்போது சீராக உள்ளது.",
            fertilizer: "இயற்கை விவசாயத்திற்கு மண்புழு உரம், வேப்பம் புண்ணாக்கு மற்றும் அசோஸ்பைரில்லம் போன்ற உயிர் உரங்களைப் பயன்படுத்த பரிந்துரைக்கிறோம்.",
            scheme: "முக்கிய அரசு திட்டங்கள்:\n1. **PM-KISAN**: வருடத்திற்கு ₹6,000 உதவித்தொகை.\n2. **கிசான் கிரெடிட் கார்டு (KCC)**: குறைந்த வட்டி விவசாய கடன்.\n3. **மண்வள அட்டை திட்டம்**: இலவச மண் பரிசோதனை.",
            disease: "தக்காளியில் வாடல் நோயைத் தடுக்க, வடிகால் வசதியை சீரமைத்து, டிரைக்கோடெர்மா விரிடி உயிர் பூஞ்சாணக்கொல்லியைப் பயன்படுத்தவும்.",
            prompts: [
                "அரிசி சந்தை விலை என்ன?",
                "இயற்கை உரங்கள் பரிந்துரை",
                "PM-KISAN திட்ட விவரம்",
                "தக்காளி நோயை கட்டுப்படுத்துவது எப்படி?"
            ]
        },
        hi: {
            welcome: "नमस्ते! मैं आपका कृषि एआई सहायक हूँ। फसल की खेती, खाद, सरकारी योजनाओं या बाजार भाव के बारे में कुछ भी पूछें!",
            default: "यह एक अच्छा सवाल है। जैविक खेती से मिट्टी का स्वास्थ्य सुधरता है। क्या आप खाद, फसल की कीमतों या सरकारी सब्सिडी के बारे में जानना चाहते हैं?",
            price: "आज का मंडी भाव:\n- सोना मसूली चावल: ₹52 - ₹56/किलो\n- टमाटर: ₹40 - ₹45/किलो\n- प्याज: ₹30 - ₹34/किलो। बाजार स्थिर है।",
            fertilizer: "जैविक खेती के लिए हम वर्मीकंपोस्ट, नीम की खली और बायोफर्टिलाइजर जैसे एजोटोबैक्टर की सलाह देते हैं।",
            scheme: "सक्रिय सरकारी योजनाएं:\n1. **पीएम-किसान**: ₹6,000/वर्ष वित्तीय सहायता।\n2. **किसान क्रेडिट कार्ड (KCC)**: कम ब्याज दर ऋण।\n3. **मृदा स्वास्थ्य कार्ड**: मुफ्त मिट्टी परीक्षण विवरण।",
            disease: "टमाटर में झुलसा रोग (blight) को रोकने के लिए उचित जल निकासी रखें और ट्राइकोडर्मा विरिडी जैव-कीटनाशक का छिड़काव करें।",
            prompts: [
                "चावल का मंडी भाव क्या है?",
                "जैविक खाद की सिफारिश करें",
                "पीएम-किसान योजना की जानकारी",
                "टमाटर की बीमारी कैसे रोकें?"
            ]
        }
    },

    init: function() {
        const textInput = document.getElementById("chatbot-text-input");
        const sendBtn = document.getElementById("chatbot-send-btn");
        const langBtns = document.querySelectorAll(".lang-btn");
        
        if (!textInput) return;

        // Language toggler
        langBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                langBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                this.currentLang = btn.dataset.lang;
                
                // Clear and print new welcome
                this.resetChat();
            });
        });

        // Send action
        sendBtn.addEventListener("click", () => this.handleSend());
        textInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.handleSend();
        });

        // Set initial welcome
        this.resetChat();
    },

    resetChat: function() {
        const display = document.getElementById("chatbot-messages-display");
        const promptsContainer = document.getElementById("chatbot-quick-prompts");
        
        display.innerHTML = `
            <div class="bot-bubble">
                <p>${this.responses[this.currentLang].welcome}</p>
            </div>
        `;

        promptsContainer.innerHTML = "";
        this.responses[this.currentLang].prompts.forEach(p => {
            const pill = document.createElement("button");
            pill.className = "prompt-pill";
            pill.textContent = p;
            pill.addEventListener("click", () => {
                this.addMessage(p, 'user');
                this.generateBotResponse(p);
            });
            promptsContainer.appendChild(pill);
        });
    },

    addMessage: function(text, sender) {
        const display = document.getElementById("chatbot-messages-display");
        const bubble = document.createElement("div");
        bubble.className = sender === 'user' ? 'user-bubble' : 'bot-bubble';
        
        // Convert newlines to breaks
        const formattedText = text.replace(/\n/g, "<br>");
        bubble.innerHTML = `<p>${formattedText}</p>`;
        
        display.appendChild(bubble);
        display.scrollTop = display.scrollHeight;
    },

    handleSend: function() {
        const input = document.getElementById("chatbot-text-input");
        const query = input.value.trim();
        if (!query) return;

        this.addMessage(query, 'user');
        input.value = "";
        
        // Simulate typing delay
        setTimeout(() => {
            this.generateBotResponse(query);
        }, 600);
    },

    generateBotResponse: function(query) {
        const lowerQuery = query.toLowerCase();
        const corpus = this.responses[this.currentLang];
        let reply = corpus.default;

        if (this.currentLang === 'en') {
            if (lowerQuery.includes("price") || lowerQuery.includes("market") || lowerQuery.includes("rate") || lowerQuery.includes("cost")) {
                reply = corpus.price;
            } else if (lowerQuery.includes("fertilizer") || lowerQuery.includes("manure") || lowerQuery.includes("organic")) {
                reply = corpus.fertilizer;
            } else if (lowerQuery.includes("scheme") || lowerQuery.includes("subsidy") || lowerQuery.includes("kisan") || lowerQuery.includes("government")) {
                reply = corpus.scheme;
            } else if (lowerQuery.includes("disease") || lowerQuery.includes("blight") || lowerQuery.includes("pest") || lowerQuery.includes("fungus")) {
                reply = corpus.disease;
            }
        } else if (this.currentLang === 'ta') {
            if (lowerQuery.includes("விலை") || lowerQuery.includes("மதிப்பு") || lowerQuery.includes("சந்தை")) {
                reply = corpus.price;
            } else if (lowerQuery.includes("உரம்") || lowerQuery.includes("கழிவு") || lowerQuery.includes("இயற்கை")) {
                reply = corpus.fertilizer;
            } else if (lowerQuery.includes("திட்டம்") || lowerQuery.includes("மானிய") || lowerQuery.includes("அரசு")) {
                reply = corpus.scheme;
            } else if (lowerQuery.includes("நோய்") || lowerQuery.includes("பூச்சி") || lowerQuery.includes("தக்காளி")) {
                reply = corpus.disease;
            }
        } else if (this.currentLang === 'hi') {
            if (lowerQuery.includes("भाव") || lowerQuery.includes("दाम") || lowerQuery.includes("मूल्य") || lowerQuery.includes("रेट")) {
                reply = corpus.price;
            } else if (lowerQuery.includes("खाद") || lowerQuery.includes("उर्वरक") || lowerQuery.includes("गोबर")) {
                reply = corpus.fertilizer;
            } else if (lowerQuery.includes("योजना") || lowerQuery.includes("सब्सिडी") || lowerQuery.includes("सरकार") || lowerQuery.includes("किसान")) {
                reply = corpus.scheme;
            } else if (lowerQuery.includes("बीमारी") || lowerQuery.includes("रोग") || lowerQuery.includes("कीड़ा")) {
                reply = corpus.disease;
            }
        }

        this.addMessage(reply, 'bot');
    }
};
