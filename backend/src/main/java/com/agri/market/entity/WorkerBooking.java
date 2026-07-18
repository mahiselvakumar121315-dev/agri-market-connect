package com.agri.market.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "worker_bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkerBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "worker_id", nullable = false)
    private User worker;

    @Column(name = "work_type", nullable = false)
    private String workType;

    @Column(name = "crop_type")
    private String cropType;

    @Column(name = "requested_workers")
    @Builder.Default
    private Integer requestedWorkers = 1;

    @Column(name = "wage_agreed", nullable = false)
    private Double wageAgreed;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "duration_days")
    @Builder.Default
    private Integer durationDays = 1;

    @Builder.Default
    private String urgency = "MEDIUM";

    @Builder.Default
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED, IN_PROGRESS, COMPLETED, CANCELLED

    @Column(name = "attendance_marked")
    @Builder.Default
    private Boolean attendanceMarked = false;

    @Column(name = "farmer_lat")
    private Double farmerLat;

    @Column(name = "farmer_lng")
    private Double farmerLng;

    @Column(name = "worker_lat")
    private Double workerLat;

    @Column(name = "worker_lng")
    private Double workerLng;

    @Column(name = "eta_minutes")
    private Integer etaMinutes;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
