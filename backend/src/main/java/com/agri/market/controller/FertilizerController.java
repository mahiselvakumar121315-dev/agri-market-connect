package com.agri.market.controller;

import com.agri.market.entity.FertilizerListing;
import com.agri.market.repository.FertilizerListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/fertilizers")
@CrossOrigin(origins = "*")
public class FertilizerController {

    @Autowired
    private FertilizerListingRepository fertilizerRepository;

    @GetMapping
    public ResponseEntity<List<FertilizerListing>> getAllFertilizers() {
        return ResponseEntity.ok(fertilizerRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createFertilizerListing(@RequestBody Map<String, Object> req) {
        try {
            FertilizerListing listing = FertilizerListing.builder()
                    .brandName((String) req.get("brandName"))
                    .productName((String) req.get("productName"))
                    .suitableCrops((String) req.get("suitableCrops"))
                    .price(Double.parseDouble(req.get("price").toString()))
                    .stockQuantity(req.get("stockQuantity") != null ? Integer.parseInt(req.get("stockQuantity").toString()) : 100)
                    .offersDiscount(req.get("offersDiscount") != null ? Integer.parseInt(req.get("offersDiscount").toString()) : 0)
                    .govtSubsidyPercentage(req.get("govtSubsidyPercentage") != null ? Double.parseDouble(req.get("govtSubsidyPercentage").toString()) : 0.0)
                    .predictedFuturePrice(req.get("predictedFuturePrice") != null ? Double.parseDouble(req.get("predictedFuturePrice").toString()) : 0.0)
                    .dealerName((String) req.get("dealerName"))
                    .dealerPhone((String) req.get("dealerPhone"))
                    .shopLocation((String) req.get("shopLocation"))
                    .imageUrl(req.get("imageUrl") != null ? (String) req.get("imageUrl") : "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500")
                    .latitude(11.6643)
                    .longitude(78.1460)
                    .build();

            FertilizerListing saved = fertilizerRepository.save(listing);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
