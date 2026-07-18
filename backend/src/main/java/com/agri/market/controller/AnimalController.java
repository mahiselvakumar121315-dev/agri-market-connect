package com.agri.market.controller;

import com.agri.market.entity.AnimalListing;
import com.agri.market.entity.User;
import com.agri.market.repository.AnimalListingRepository;
import com.agri.market.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/animals")
@CrossOrigin(origins = "*")
public class AnimalController {

    @Autowired
    private AnimalListingRepository animalRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<AnimalListing>> getAllAnimals(@RequestParam(required = false) String type) {
        if (type != null && !type.isEmpty() && !"all".equalsIgnoreCase(type)) {
            return ResponseEntity.ok(animalRepository.findByAnimalType(type.toUpperCase()));
        }
        return ResponseEntity.ok(animalRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAnimalById(@PathVariable Long id) {
        Optional<AnimalListing> a = animalRepository.findById(id);
        return a.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createAnimalListing(@RequestBody Map<String, Object> req) {
        try {
            Long ownerId = Long.parseLong(req.get("ownerId").toString());
            User owner = userRepository.findById(ownerId).orElse(userRepository.findAll().get(0));

            AnimalListing animal = AnimalListing.builder()
                    .owner(owner)
                    .animalType(req.get("animalType").toString().toUpperCase())
                    .breed(req.get("breed") != null ? req.get("breed").toString() : "Standard Breed")
                    .ageMonths(req.get("ageMonths") != null ? Integer.parseInt(req.get("ageMonths").toString()) : 12)
                    .gender(req.get("gender") != null ? req.get("gender").toString() : "FEMALE")
                    .weightKg(req.get("weightKg") != null ? Double.parseDouble(req.get("weightKg").toString()) : 100.0)
                    .healthCertUrl(req.get("healthCertUrl") != null ? req.get("healthCertUrl").toString() : "CERT-VET-VERIFIED.pdf")
                    .isVaccinated(req.get("isVaccinated") == null || Boolean.parseBoolean(req.get("isVaccinated").toString()))
                    .milkYieldLiters(req.get("milkYieldLiters") != null ? Double.parseDouble(req.get("milkYieldLiters").toString()) : 0.0)
                    .price(Double.parseDouble(req.get("price").toString()))
                    .isNegotiable(req.get("isNegotiable") == null || Boolean.parseBoolean(req.get("isNegotiable").toString()))
                    .locationName(req.get("locationName") != null ? req.get("locationName").toString() : "Salem, Tamil Nadu")
                    .latitude(11.6643)
                    .longitude(78.1460)
                    .photoUrl(req.get("photoUrl") != null ? req.get("photoUrl").toString() : "https://images.unsplash.com/photo-1546445317-29f4545f9d52?w=500")
                    .status("AVAILABLE")
                    .build();

            AnimalListing saved = animalRepository.save(animal);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAnimal(@PathVariable Long id) {
        if (animalRepository.existsById(id)) {
            animalRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Livestock listing deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
