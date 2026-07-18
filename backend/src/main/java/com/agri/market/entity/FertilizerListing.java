package com.agri.market.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fertilizer_listings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FertilizerListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "brand_name", nullable = false)
    private String brandName;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "suitable_crops")
    private String suitableCrops;

    @Column(nullable = false)
    private Double price;

    @Column(name = "stock_quantity")
    @Builder.Default
    private Integer stockQuantity = 100;

    @Column(name = "offers_discount")
    @Builder.Default
    private Integer offersDiscount = 0; // percentage

    @Column(name = "govt_subsidy_percentage")
    @Builder.Default
    private Double govtSubsidyPercentage = 0.0;

    @Column(name = "predicted_future_price")
    private Double predictedFuturePrice;

    @Column(name = "dealer_name")
    private String dealerName;

    @Column(name = "dealer_phone")
    private String dealerPhone;

    @Column(name = "shop_location")
    private String shopLocation;

    private Double latitude;
    private Double longitude;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
