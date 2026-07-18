package com.agri.market.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(nullable = false)
    private String name;

    @Column(name = "category_type", nullable = false)
    private String categoryType; // VEGETABLES, FRUITS, CROPS, ORGANIC, SEEDS, EQUIPMENT

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Double quantity;

    @Builder.Default
    private String unit = "KG";

    @Column(name = "harvest_date")
    private LocalDate harvestDate;

    @Column(name = "is_organic")
    @Builder.Default
    private Boolean isOrganic = false;

    @Column(name = "is_fresh")
    @Builder.Default
    private Boolean isFresh = true;

    @Column(name = "image_url")
    private String imageUrl;

    private String description;

    @Column(name = "location_name")
    private String locationName;

    private Double latitude;
    private Double longitude;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
