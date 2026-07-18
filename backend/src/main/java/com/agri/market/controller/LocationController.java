package com.agri.market.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/location")
@CrossOrigin(origins = "*")
public class LocationController {

    @GetMapping("/nearby")
    public ResponseEntity<?> getNearbyServices(
            @RequestParam(defaultValue = "11.6643") Double lat,
            @RequestParam(defaultValue = "78.1460") Double lng,
            @RequestParam(required = false) String type) {

        List<Map<String, Object>> places = new ArrayList<>();

        // Nearby Fertilizer Stores
        places.add(Map.of(
                "name", "Green Earth Agro & Fertilizer Store",
                "type", "FERTILIZER_SHOP",
                "distance", "1.2 km",
                "lat", 11.6670,
                "lng", 78.1420,
                "phone", "+91 94432 11234",
                "address", "Mettur Main Road, Salem"
        ));

        // Nearby Veterinary Hospital
        places.add(Map.of(
                "name", "Salem Government Veterinary Hospital & Cattle Clinic",
                "type", "VET_HOSPITAL",
                "distance", "2.5 km",
                "lat", 11.6580,
                "lng", 78.1510,
                "phone", "+91 94432 99887",
                "address", "District Vet Complex, Salem"
        ));

        // Nearby Warehouses / Cold Storage
        places.add(Map.of(
                "name", "Tamil Nadu Cold Storage & Grain Warehouse #4",
                "type", "WAREHOUSE",
                "distance", "3.1 km",
                "lat", 11.6710,
                "lng", 78.1390,
                "phone", "+91 94432 44332",
                "address", "SIDCO Industrial Estate, Salem"
        ));

        // Nearby Agriculture Office
        places.add(Map.of(
                "name", "Department of Agriculture & Farmers Welfare Office",
                "type", "GOVT_OFFICE",
                "distance", "1.8 km",
                "lat", 11.6610,
                "lng", 78.1490,
                "phone", "+91 0427 221004",
                "address", "Collectorate Campus, Salem"
        ));

        // Nearby Mandi Markets
        places.add(Map.of(
                "name", "Salem Uzhavar Sandhai (Farmers Market)",
                "type", "MARKET",
                "distance", "0.9 km",
                "lat", 11.6650,
                "lng", 78.1440,
                "phone", "+91 94432 55667",
                "address", "Suramangalam, Salem"
        ));

        return ResponseEntity.ok(places);
    }
}
