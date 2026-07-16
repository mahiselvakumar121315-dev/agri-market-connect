/* ====================================================
   AGRI MARKET CONNECT — Full Indian Crop Database
   130+ Crops | Auto Photo | Real Prices | Categories
   ==================================================== */

window.MarketData = {

    // Image keyword mapping for Unsplash searches
    _img: function(kw) {
        return `https://source.unsplash.com/400x300/?${encodeURIComponent(kw)},farm,india`;
    },

    farmers: [
        { name: "Rajesh Kumar",     loc: "Salem, Tamil Nadu",         dist: "3.2 km" },
        { name: "Sundar Raj",       loc: "Nashik, Maharashtra",       dist: "6.5 km" },
        { name: "Kavin Agro",       loc: "Salem, Tamil Nadu",         dist: "4.1 km" },
        { name: "Mango Farms Co.",  loc: "Ratnagiri, Maharashtra",    dist: "9.2 km" },
        { name: "Nilgiris Organics",loc: "Ooty, Tamil Nadu",          dist: "12.4 km" },
        { name: "Hassan Agro",      loc: "Hassan, Karnataka",         dist: "45.0 km" },
        { name: "Guntur Spice Farms",loc: "Guntur, Andhra Pradesh",   dist: "8.1 km" },
        { name: "Singh Farms",      loc: "Ludhiana, Punjab",          dist: "1200 km" },
        { name: "Malabar Spices",   loc: "Wayanad, Kerala",           dist: "210 km" },
        { name: "Valley Orchards",  loc: "Srinagar, J&K",             dist: "1500 km" },
        { name: "Coconut Grove",    loc: "Pollachi, Tamil Nadu",      dist: "40.5 km" },
        { name: "Green Leaf Farms", loc: "Hosur, Tamil Nadu",         dist: "65.2 km" },
        { name: "Citrus Valley",    loc: "Nagpur, Maharashtra",       dist: "850 km" },
        { name: "Andhra Spices",    loc: "Guntur, Andhra Pradesh",    dist: "450 km" },
        { name: "Coorg Plantations",loc: "Coorg, Karnataka",          dist: "230 km" },
        { name: "Kumari Farms",     loc: "Kanyakumari, Tamil Nadu",   dist: "350 km" },
        { name: "Malwa Farmers",    loc: "Indore, MP",                dist: "1100 km" },
        { name: "Erode Roots",      loc: "Erode, Tamil Nadu",         dist: "35.0 km" },
        { name: "Saurashtra Agro",  loc: "Rajkot, Gujarat",           dist: "1400 km" },
        { name: "Trichy Organics",  loc: "Trichy, Tamil Nadu",        dist: "80 km" },
        { name: "Madurai Agro",     loc: "Madurai, Tamil Nadu",       dist: "150 km" },
        { name: "Bengal Farmers",   loc: "Midnapore, West Bengal",    dist: "1600 km" },
        { name: "Nashik Grapes",    loc: "Nashik, Maharashtra",       dist: "700 km" },
        { name: "Vizag Agro",       loc: "Visakhapatnam, AP",         dist: "620 km" },
        { name: "Dharwad Farms",    loc: "Dharwad, Karnataka",        dist: "400 km" },
    ],

    _farmer: function() {
        return this.farmers[Math.floor(Math.random() * this.farmers.length)];
    },

    _crop: function(id, name, category, emoji, price, qty, organic, imgKw) {
        const f = this._farmer();
        const days = Math.floor(Math.random() * 7);
        const d = new Date(); d.setDate(d.getDate() - days);
        return {
            id: `crop-${id}`,
            name: `${emoji} ${name}`,
            category: category,
            price: price,
            quantity: qty,
            harvestDate: d.toISOString().split('T')[0],
            organic: organic,
            farmer: f.name,
            location: f.loc,
            distance: f.dist,
            fresh: days <= 2,
            img: `https://source.unsplash.com/400x300/?${encodeURIComponent(imgKw || name)},vegetable,india`
        };
    },

    getAllCrops: function() {
        const c = this._crop.bind(this);
        return [
            // ══════════════════════════════════════════
            // 🥬 VEGETABLES
            // ══════════════════════════════════════════
            c(1,   "Tomato",              "vegetables", "🍅", 28,  150, true,  "tomato"),
            c(2,   "Onion",               "vegetables", "🧅", 25,  300, false, "onion"),
            c(3,   "Potato",              "vegetables", "🥔", 22,  500, false, "potato"),
            c(4,   "Brinjal (Eggplant)",  "vegetables", "🍆", 35,  100, true,  "eggplant brinjal"),
            c(5,   "Ladies Finger (Okra)","vegetables", "🫘", 40,  80,  true,  "okra ladies finger"),
            c(6,   "Green Chilli",        "vegetables", "🌶️", 68,  60,  true,  "green chilli"),
            c(7,   "Capsicum",            "vegetables", "🫑", 55,  90,  true,  "capsicum bell pepper"),
            c(8,   "Cabbage",             "vegetables", "🥬", 18,  200, false, "cabbage"),
            c(9,   "Cauliflower",         "vegetables", "🥦", 30,  120, false, "cauliflower"),
            c(10,  "Carrot",              "vegetables", "🥕", 40,  150, true,  "carrot"),
            c(11,  "Beetroot",            "vegetables", "🫒", 35,  100, true,  "beetroot"),
            c(12,  "Radish",              "vegetables", "🌱", 20,  80,  false, "radish"),
            c(13,  "Turnip",              "vegetables", "🥔", 22,  60,  false, "turnip"),
            c(14,  "Drumstick",           "vegetables", "🌿", 45,  70,  true,  "drumstick moringa"),
            c(15,  "Bottle Gourd",        "vegetables", "🟢", 25,  120, false, "bottle gourd lauki"),
            c(16,  "Bitter Gourd",        "vegetables", "🟩", 38,  90,  true,  "bitter gourd karela"),
            c(17,  "Ridge Gourd",         "vegetables", "🟢", 30,  80,  false, "ridge gourd"),
            c(18,  "Snake Gourd",         "vegetables", "🐍", 32,  60,  false, "snake gourd"),
            c(19,  "Ash Gourd",           "vegetables", "⬜", 20,  100, false, "ash gourd"),
            c(20,  "Pumpkin",             "vegetables", "🎃", 18,  200, false, "pumpkin"),
            c(21,  "Cucumber",            "vegetables", "🥒", 22,  180, true,  "cucumber"),
            c(22,  "Beans",               "vegetables", "🫘", 45,  100, true,  "beans french"),
            c(23,  "Cluster Beans",       "vegetables", "🌿", 40,  70,  true,  "cluster beans guar"),
            c(24,  "Broad Beans",         "vegetables", "🫘", 50,  50,  true,  "broad beans"),
            c(25,  "Green Peas",          "vegetables", "🟢", 60,  80,  true,  "green peas"),
            c(26,  "Spinach",             "vegetables", "🥬", 30,  60,  true,  "spinach palak"),
            c(27,  "Coriander Leaves",    "vegetables", "🌿", 25,  40,  true,  "coriander leaves"),
            c(28,  "Mint Leaves",         "vegetables", "🌿", 30,  30,  true,  "mint leaves"),
            c(29,  "Curry Leaves",        "vegetables", "🍃", 20,  20,  true,  "curry leaves"),
            c(30,  "Fenugreek Leaves",    "vegetables", "🌿", 25,  40,  true,  "fenugreek methi"),
            c(31,  "Spring Onion",        "vegetables", "🌱", 35,  50,  true,  "spring onion"),
            c(32,  "Garlic",              "vegetables", "🧄", 120, 50,  false, "garlic"),
            c(33,  "Ginger",              "vegetables", "🫚", 85,  80,  true,  "ginger"),
            c(34,  "Sweet Potato",        "vegetables", "🍠", 42,  120, false, "sweet potato"),
            c(35,  "Mushroom",            "vegetables", "🍄", 150, 30,  true,  "mushroom"),
            c(36,  "Corn (Fresh)",        "vegetables", "🌽", 20,  200, false, "corn maize"),

            // ══════════════════════════════════════════
            // 🍎 FRUITS
            // ══════════════════════════════════════════
            c(37,  "Mango",               "fruits", "🥭", 80,  150, true,  "mango alphonso"),
            c(38,  "Banana",              "fruits", "🍌", 45,  300, true,  "banana nendran"),
            c(39,  "Apple",               "fruits", "🍎", 150, 80,  true,  "apple kashmiri"),
            c(40,  "Orange",              "fruits", "🍊", 60,  200, true,  "orange nagpur"),
            c(41,  "Sweet Lime (Mosambi)","fruits", "🍋", 55,  180, false, "sweet lime mosambi"),
            c(42,  "Lemon",               "fruits", "🍋", 80,  100, true,  "lemon"),
            c(43,  "Grapes",              "fruits", "🍇", 90,  120, true,  "grapes nashik"),
            c(44,  "Guava",               "fruits", "🍈", 50,  100, true,  "guava"),
            c(45,  "Papaya",              "fruits", "🍈", 35,  80,  false, "papaya"),
            c(46,  "Watermelon",          "fruits", "🍉", 15,  300, false, "watermelon"),
            c(47,  "Muskmelon",           "fruits", "🍈", 25,  150, false, "muskmelon"),
            c(48,  "Pineapple",           "fruits", "🍍", 40,  100, false, "pineapple"),
            c(49,  "Pomegranate",         "fruits", "🍎", 120, 80,  true,  "pomegranate"),
            c(50,  "Jackfruit",           "fruits", "🍈", 30,  50,  false, "jackfruit"),
            c(51,  "Coconut",             "fruits", "🥥", 25,  500, true,  "coconut"),
            c(52,  "Tender Coconut",      "fruits", "🥥", 35,  200, true,  "tender coconut"),
            c(53,  "Sapota (Chikoo)",     "fruits", "🟤", 60,  80,  true,  "sapota chikoo"),
            c(54,  "Custard Apple",       "fruits", "🍈", 80,  60,  true,  "custard apple"),
            c(55,  "Dragon Fruit",        "fruits", "🐉", 180, 40,  true,  "dragon fruit"),
            c(56,  "Strawberry",          "fruits", "🍓", 200, 30,  true,  "strawberry"),
            c(57,  "Pear",                "fruits", "🍐", 90,  60,  false, "pear"),
            c(58,  "Peach",               "fruits", "🍑", 120, 40,  false, "peach"),
            c(59,  "Plum",                "fruits", "🫐", 110, 40,  false, "plum"),
            c(60,  "Litchi",              "fruits", "🍒", 150, 30,  true,  "litchi lychee"),
            c(61,  "Avocado",             "fruits", "🥑", 250, 25,  true,  "avocado"),
            c(62,  "Fig",                 "fruits", "🟤", 200, 20,  true,  "fig anjeer"),
            c(63,  "Amla (Gooseberry)",   "fruits", "🟢", 60,  80,  true,  "amla gooseberry"),
            c(64,  "Dates",               "fruits", "🟤", 300, 30,  false, "dates khajoor"),
            c(65,  "Jamun",               "fruits", "🟣", 80,  50,  true,  "jamun java plum"),
            c(66,  "Star Fruit",          "fruits", "⭐", 120, 30,  true,  "star fruit carambola"),

            // ══════════════════════════════════════════
            // 🌾 CEREALS & GRAINS
            // ══════════════════════════════════════════
            c(67,  "Paddy (Rice)",         "cereals", "🌾", 22,  1000, false, "paddy rice"),
            c(68,  "Wheat",                "cereals", "🌾", 32,  800,  false, "wheat"),
            c(69,  "Maize (Corn)",         "cereals", "🌽", 20,  600,  false, "maize corn"),
            c(70,  "Pearl Millet (Bajra)", "cereals", "🌾", 25,  400,  false, "bajra pearl millet"),
            c(71,  "Finger Millet (Ragi)", "cereals", "🟤", 42,  300,  true,  "ragi finger millet"),
            c(72,  "Sorghum (Jowar)",      "cereals", "🌾", 22,  400,  false, "jowar sorghum"),
            c(73,  "Barley",               "cereals", "🌾", 35,  300,  false, "barley"),
            c(74,  "Oats",                 "cereals", "🌾", 55,  200,  true,  "oats grain"),
            c(75,  "Foxtail Millet",       "cereals", "🌾", 50,  200,  true,  "foxtail millet"),
            c(76,  "Coffee Beans",         "cereals", "☕", 320, 50,   true,  "coffee beans coorg"),

            // ══════════════════════════════════════════
            // 🌱 PULSES
            // ══════════════════════════════════════════
            c(77,  "Black Gram (Urad)",    "pulses", "⚫", 90,  200, false, "urad dal black gram"),
            c(78,  "Green Gram (Moong)",   "pulses", "🟢", 85,  200, true,  "moong green gram"),
            c(79,  "Bengal Gram (Chana)",  "pulses", "🟡", 75,  300, false, "chana bengal gram"),
            c(80,  "Red Gram (Toor Dal)",  "pulses", "🔴", 95,  250, false, "toor dal red gram"),
            c(81,  "Horse Gram",           "pulses", "🟤", 65,  150, true,  "horse gram"),
            c(82,  "Cowpea",               "pulses", "🫘", 70,  100, true,  "cowpea lobia"),
            c(83,  "Lentil",               "pulses", "🔴", 88,  200, false, "lentil masoor"),
            c(84,  "Chickpea",             "pulses", "🟡", 82,  250, false, "chickpea kabuli chana"),

            // ══════════════════════════════════════════
            // 🌻 OIL SEEDS
            // ══════════════════════════════════════════
            c(85,  "Groundnut (Peanuts)",  "oilseeds", "🥜", 65,  400, false, "groundnut peanut"),
            c(86,  "Sesame",               "oilseeds", "🌱", 130, 100, true,  "sesame til"),
            c(87,  "Sunflower Seeds",      "oilseeds", "🌻", 55,  250, false, "sunflower seeds"),
            c(88,  "Mustard Seeds",        "oilseeds", "🌼", 65,  200, false, "mustard seeds sarson"),
            c(89,  "Soybean",              "oilseeds", "🫘", 48,  500, false, "soybean"),
            c(90,  "Castor Seeds",         "oilseeds", "🌱", 70,  150, false, "castor seeds"),
            c(91,  "Linseed (Flaxseed)",   "oilseeds", "🌱", 90,  100, true,  "linseed flaxseed"),

            // ══════════════════════════════════════════
            // 🎋 COMMERCIAL CROPS
            // ══════════════════════════════════════════
            c(92,  "Sugarcane",            "commercial", "🎋", 5,   2000, false, "sugarcane"),
            c(93,  "Cotton (Seed)",        "commercial", "☁️", 60,  500,  false, "cotton"),
            c(94,  "Tea Leaves",           "commercial", "🍵", 280, 100,  true,  "tea leaves assam"),
            c(95,  "Rubber",               "commercial", "⚫", 180, 200,  false, "rubber tree"),
            c(96,  "Tobacco",              "commercial", "🌿", 120, 100,  false, "tobacco leaf"),
            c(97,  "Cocoa",                "commercial", "🍫", 220, 80,   true,  "cocoa beans"),
            c(98,  "Jute",                 "commercial", "🌿", 40,  300,  false, "jute"),

            // ══════════════════════════════════════════
            // 🌶️ SPICES
            // ══════════════════════════════════════════
            c(99,  "Turmeric",             "spices", "🟡", 112, 100, true,  "turmeric haldi"),
            c(100, "Black Pepper",         "spices", "⚫", 450, 30,  true,  "black pepper"),
            c(101, "Cardamom",             "spices", "💚", 1200,10,  true,  "cardamom elaichi"),
            c(102, "Cinnamon",             "spices", "🟤", 350, 20,  true,  "cinnamon dalchini"),
            c(103, "Clove",                "spices", "🟤", 600, 15,  true,  "clove lavang"),
            c(104, "Nutmeg",               "spices", "🟤", 550, 10,  true,  "nutmeg jaiphal"),
            c(105, "Coriander Seeds",      "spices", "🌿", 90,  80,  false, "coriander seeds dhania"),
            c(106, "Cumin (Jeera)",        "spices", "🟤", 220, 60,  false, "cumin jeera"),
            c(107, "Fennel (Saunf)",       "spices", "🟢", 180, 50,  true,  "fennel saunf"),
            c(108, "Dry Red Chilli",       "spices", "🌶️", 180, 100, false, "dry red chilli"),
            c(109, "Tamarind",             "spices", "🟤", 55,  150, false, "tamarind imli"),
            c(110, "Fenugreek Seeds",      "spices", "🟡", 95,  80,  true,  "fenugreek seeds methi"),

            // ══════════════════════════════════════════
            // 🌸 FLOWERS
            // ══════════════════════════════════════════
            c(111, "Jasmine",              "flowers", "🌸", 400, 10,  true,  "jasmine flower"),
            c(112, "Rose",                 "flowers", "🌹", 300, 20,  true,  "rose flower"),
            c(113, "Marigold",             "flowers", "🌼", 80,  50,  false, "marigold flower"),
            c(114, "Lotus",                "flowers", "🪷", 500, 5,   true,  "lotus flower"),
            c(115, "Chrysanthemum",        "flowers", "🌸", 250, 15,  true,  "chrysanthemum flower"),
            c(116, "Hibiscus",             "flowers", "🌺", 200, 20,  true,  "hibiscus flower"),
            c(117, "Tuberose",             "flowers", "🌸", 350, 10,  true,  "tuberose flower"),
            c(118, "Crossandra",           "flowers", "🧡", 450, 8,   true,  "crossandra kanakambaram"),

            // ══════════════════════════════════════════
            // 🥜 DRY FRUITS & NUTS
            // ══════════════════════════════════════════
            c(119, "Cashew (Raw)",         "dryfuits", "🥜", 750, 30,  true,  "cashew nut"),
            c(120, "Almond",               "dryfuits", "🟤", 900, 20,  false, "almond badam"),
            c(121, "Walnut",               "dryfuits", "🟤", 700, 15,  false, "walnut akhrot"),
            c(122, "Pistachio",            "dryfuits", "💚", 1100,10,  false, "pistachio pista"),
            c(123, "Arecanut (Betel Nut)", "dryfuits", "🟤", 280, 50,  false, "arecanut betel nut"),

            // ══════════════════════════════════════════
            // 🌿 ORGANIC PRODUCTS
            // ══════════════════════════════════════════
            c(124, "Organic Sona Masuri Rice","organic","🌾", 65,  200, true,  "organic rice sona masuri"),
            c(125, "Organic Mixed Vegetables","organic","🥬", 80,  100, true,  "organic vegetables"),
            c(126, "Organic Toor Dal",      "organic", "🫘", 130, 80,  true,  "organic toor dal"),
            c(127, "Organic Ragi Flour",    "organic", "🌾", 65,  150, true,  "organic ragi millet"),
            c(128, "Organic Turmeric Pwd",  "organic", "🟡", 160, 50,  true,  "organic turmeric powder"),
            c(129, "Wild Forest Honey",     "organic", "🍯", 450, 25,  true,  "honey forest natural"),
            c(130, "Moringa Powder",        "organic", "💚", 280, 30,  true,  "moringa drumstick powder"),
        ];
    }
};
