package com.agri.market.controller;

import com.agri.market.entity.Product;
import com.agri.market.entity.User;
import com.agri.market.repository.ProductRepository;
import com.agri.market.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty() && !"all".equalsIgnoreCase(category)) {
            return ResponseEntity.ok(productRepository.findByCategoryType(category.toUpperCase()));
        }
        return ResponseEntity.ok(productRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        Optional<Product> p = productRepository.findById(id);
        return p.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Map<String, Object> req) {
        try {
            Long farmerId = Long.parseLong(req.get("farmerId").toString());
            User farmer = userRepository.findById(farmerId).orElse(userRepository.findAll().get(0));

            Product p = Product.builder()
                    .farmer(farmer)
                    .name((String) req.get("name"))
                    .categoryType(req.get("categoryType") != null ? (String) req.get("categoryType") : "VEGETABLES")
                    .price(Double.parseDouble(req.get("price").toString()))
                    .quantity(Double.parseDouble(req.get("quantity").toString()))
                    .unit(req.get("unit") != null ? (String) req.get("unit") : "KG")
                    .isOrganic(req.get("isOrganic") != null && Boolean.parseBoolean(req.get("isOrganic").toString()))
                    .isFresh(true)
                    .imageUrl(req.get("imageUrl") != null ? (String) req.get("imageUrl") : "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=500")
                    .description((String) req.get("description"))
                    .locationName(req.get("locationName") != null ? (String) req.get("locationName") : "Salem, Tamil Nadu")
                    .latitude(11.6643)
                    .longitude(78.1460)
                    .build();

            Product saved = productRepository.save(p);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
