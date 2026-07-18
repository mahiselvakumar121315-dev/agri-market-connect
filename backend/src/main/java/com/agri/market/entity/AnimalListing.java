package com.agri.market.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "animal_listings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnimalListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(name = "animal_type", nullable = false)
    private String animalType; // COW, BUFFALO, BULL, GOAT, SHEEP, PIG, HORSE, CHICKEN, DUCK, TURKEY, RABBIT, CAMEL, FISH, BEE_FARMING, FARM_DOGS

    private String breed;

    @Column(name = "age_months")
    private Integer ageMonths;

    private String gender;

    @Column(name = "weight_kg")
    private Double weightKg;

    @Column(name = "health_cert_url")
    private String healthCertUrl;

    @Column(name = "is_vaccinated")
    @Builder.Default
    private Boolean isVaccinated = true;

    @Column(name = "milk_yield_liters")
    @Builder.Default
    private Double milkYieldLiters = 0.0;

    @Column(nullable = false)
    private Double price;

    @Column(name = "is_negotiable")
    @Builder.Default
    private Boolean isNegotiable = true;

    @Column(name = "location_name")
    private String locationName;

    private Double latitude;
    private Double longitude;

    @Builder.Default
    private String status = "AVAILABLE"; // AVAILABLE, SOLD

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
