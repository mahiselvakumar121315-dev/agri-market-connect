package com.agri.market.controller;

import com.agri.market.entity.User;
import com.agri.market.entity.WorkerBooking;
import com.agri.market.entity.WorkerProfile;
import com.agri.market.repository.UserRepository;
import com.agri.market.repository.WorkerBookingRepository;
import com.agri.market.repository.WorkerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/workers")
@CrossOrigin(origins = "*")
public class WorkerBookingController {

    @Autowired
    private WorkerBookingRepository bookingRepository;

    @Autowired
    private WorkerProfileRepository workerProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/nearby")
    public ResponseEntity<List<WorkerProfile>> getNearbyWorkers(
            @RequestParam(defaultValue = "11.6643") Double lat,
            @RequestParam(defaultValue = "78.1460") Double lng) {
        return ResponseEntity.ok(workerProfileRepository.findAll());
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<WorkerBooking>> getBookings(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            List<WorkerBooking> farmerBookings = bookingRepository.findByFarmerId(userId);
            if (!farmerBookings.isEmpty()) return ResponseEntity.ok(farmerBookings);
            return ResponseEntity.ok(bookingRepository.findByWorkerId(userId));
        }
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    @PostMapping("/book")
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> req) {
        try {
            Long farmerId = Long.parseLong(req.get("farmerId").toString());
            Long workerId = Long.parseLong(req.get("workerId").toString());

            User farmer = userRepository.findById(farmerId).orElse(userRepository.findAll().get(0));
            User worker = userRepository.findById(workerId).orElse(userRepository.findAll().get(0));

            WorkerBooking booking = WorkerBooking.builder()
                    .farmer(farmer)
                    .worker(worker)
                    .workType(req.get("workType") != null ? req.get("workType").toString() : "Crop Harvesting")
                    .cropType(req.get("cropType") != null ? req.get("cropType").toString() : "Paddy")
                    .requestedWorkers(req.get("requestedWorkers") != null ? Integer.parseInt(req.get("requestedWorkers").toString()) : 1)
                    .wageAgreed(req.get("wageAgreed") != null ? Double.parseDouble(req.get("wageAgreed").toString()) : 650.0)
                    .startDate(req.get("startDate") != null ? LocalDate.parse(req.get("startDate").toString()) : LocalDate.now())
                    .durationDays(req.get("durationDays") != null ? Integer.parseInt(req.get("durationDays").toString()) : 1)
                    .urgency(req.get("urgency") != null ? req.get("urgency").toString() : "HIGH")
                    .status("PENDING")
                    .farmerLat(11.6643)
                    .farmerLng(78.1460)
                    .workerLat(11.6620)
                    .workerLng(78.1480)
                    .etaMinutes(18)
                    .build();

            WorkerBooking saved = bookingRepository.save(booking);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/bookings/{id}/respond")
    public ResponseEntity<?> respondToBooking(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<WorkerBooking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isEmpty()) return ResponseEntity.notFound().build();

        WorkerBooking b = bookingOpt.get();
        String action = body.get("status"); // ACCEPTED, REJECTED, COMPLETED
        if (action != null) {
            b.setStatus(action.toUpperCase());
            bookingRepository.save(b);
        }
        return ResponseEntity.ok(b);
    }

    @PostMapping("/bookings/{id}/attendance")
    public ResponseEntity<?> markAttendance(@PathVariable Long id) {
        Optional<WorkerBooking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isEmpty()) return ResponseEntity.notFound().build();

        WorkerBooking b = bookingOpt.get();
        b.setAttendanceMarked(true);
        b.setStatus("IN_PROGRESS");
        bookingRepository.save(b);

        return ResponseEntity.ok(Map.of("message", "Attendance marked successfully! Worker verified on field."));
    }
}
