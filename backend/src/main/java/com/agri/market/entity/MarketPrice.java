package com.agri.market.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "market_prices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "commodity_name", nullable = false)
    private String commodityName;

    @Column(name = "market_name", nullable = false)
    private String marketName;

    private String state;

    @Column(name = "min_price")
    private Double minPrice;

    @Column(name = "max_price")
    private Double maxPrice;

    @Column(name = "modal_price", nullable = false)
    private Double modalPrice;

    @Column(name = "date_updated")
    @Builder.Default
    private LocalDate dateUpdated = LocalDate.now();
}
