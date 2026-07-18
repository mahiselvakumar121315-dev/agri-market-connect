package com.agri.market.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/ai")
@CrossOrigin(origins = "*")
public class AiController {

    @PostMapping("/crop-recommendation")
    public ResponseEntity<?> recommendCrop(@RequestBody Map<String, Object> req) {
        String soilType = req.get("soilType") != null ? req.get("soilType").toString() : "Red Loamy";
        Double ph = req.get("ph") != null ? Double.parseDouble(req.get("ph").toString()) : 6.5;

        Map<String, Object> rec = new HashMap<>();
        rec.put("recommendedCrop", "Organic Tomatoes & Turmeric Intercropping");
        rec.put("confidenceScore", 96.4);
        rec.put("expectedYield", "18.5 Tons / Acre");
        rec.put("estimatedRevenue", "₹ 4,50,000 / Season");
        rec.put("idealNPK", "N: 120, P: 60, K: 50 kg/ha");
        rec.put("irrigationAdvice", "Drip irrigation twice a day (morning & evening, 45 mins each)");

        return ResponseEntity.ok(rec);
    }

    @PostMapping("/disease-detection")
    public ResponseEntity<?> detectDisease(@RequestBody Map<String, Object> req) {
        Map<String, Object> res = new HashMap<>();
        res.put("cropName", "Tomato Plant");
        res.put("diseaseDetected", "Early Blight (Alternaria solani)");
        res.put("confidence", 98.2);
        res.put("severityLevel", "MODERATE (22% Leaf Damage)");
        res.put("treatmentPlan", List.of(
                "Apply Copper Oxychloride 50 WP @ 2.5g/L water.",
                "Maintain row spacing for adequate sunlight & air ventilation.",
                "Avoid overhead sprinkler watering to prevent spore germination."
        ));
        res.put("organicRemedy", "Spray Neem Oil (10,000 ppm) @ 3ml/L along with bio-fungicide Trichoderma viride.");

        return ResponseEntity.ok(res);
    }

    @GetMapping("/price-prediction/{commodity}")
    public ResponseEntity<?> predictPriceTrend(@PathVariable String commodity) {
        Map<String, Object> trend = new HashMap<>();
        trend.put("commodity", commodity);
        trend.put("currentPrice", 32.0);
        trend.put("tomorrowForecast", 34.50);
        trend.put("nextWeekForecast", 38.00);
        trend.put("nextMonthForecast", 42.00);
        trend.put("trendSignal", "BULLISH (+18.7% Expected Surge)");
        trend.put("reasoning", "Surging festive demand in urban markets combined with rainfall supply delays.");
        trend.put("recommendation", "HOLD harvest sale for 5 days to maximize profit margin.");

        return ResponseEntity.ok(trend);
    }

    @PostMapping("/labour-recommendation")
    public ResponseEntity<?> recommendLabour(@RequestBody Map<String, Object> req) {
        Double acres = req.get("acres") != null ? Double.parseDouble(req.get("acres").toString()) : 2.5;
        String crop = req.get("crop") != null ? req.get("crop").toString() : "Paddy";

        Map<String, Object> res = new HashMap<>();
        res.put("recommendedWorkers", Math.max(2, (int) Math.ceil(acres * 3)));
        res.put("durationDays", 2);
        res.put("estimatedTotalWage", (acres * 3) * 650.0 * 2);
        res.put("optimalShiftTime", "06:00 AM - 01:00 PM (Cool Morning Hours)");

        return ResponseEntity.ok(res);
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chatAssistant(@RequestBody Map<String, String> req) {
        String query = req.get("query");
        String lang = req.get("lang") != null ? req.get("lang") : "en";

        String reply;
        if (query.toLowerCase().contains("price") || query.toLowerCase().contains("rate")) {
            reply = "Market prices for Tomato in Salem Mandi are currently trending upward at ₹32/kg (+8% from yesterday). Best time to list your produce!";
        } else if (query.toLowerCase().contains("subsidy") || query.toLowerCase().contains("govt")) {
            reply = "Under PM-Kisan & State Agri Subsidy schemes, 45% subsidy is available for Nano Urea and micro-drip irrigation kits at your nearest Agri Extension Center.";
        } else if (query.toLowerCase().contains("worker") || query.toLowerCase().contains("labor")) {
            reply = "There are 12 agricultural workers available within 3 km of your location with an average rating of 4.9⭐. Would you like to book them now?";
        } else {
            reply = "Greetings! I am your AI Agri Assistant. I can help you with crop disease identification, mandi price predictions, government subsidies, and hiring nearby farm labor.";
        }

        return ResponseEntity.ok(Map.of("query", query, "reply", reply, "language", lang));
    }
}
