package com.agri.market.controller;

import com.agri.market.entity.User;
import com.agri.market.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AnimalListingRepository animalRepository;

    @Autowired
    private WorkerBookingRepository workerBookingRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("farmersCount", userRepository.findByRole("FARMER").size());
        stats.put("buyersCount", userRepository.findByRole("BUYER").size());
        stats.put("workersCount", userRepository.findByRole("WORKER").size());
        stats.put("activeProducts", productRepository.count());
        stats.put("animalListings", animalRepository.count());
        stats.put("totalWorkerBookings", workerBookingRepository.count());
        stats.put("totalOrders", orderRepository.count());
        stats.put("platformRevenue", 1254000.00);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<User> uOpt = userRepository.findById(id);
        if (uOpt.isEmpty()) return ResponseEntity.notFound().build();

        User u = uOpt.get();
        String newStatus = body.get("status"); // ACTIVE, BLOCKED, SUSPENDED
        if (newStatus != null) {
            u.setStatus(newStatus.toUpperCase());
            userRepository.save(u);
        }

        return ResponseEntity.ok(u);
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @GetMapping("/worker-requests")
    public ResponseEntity<?> getAllWorkerRequests() {
        return ResponseEntity.ok(workerBookingRepository.findAll());
    }
}
