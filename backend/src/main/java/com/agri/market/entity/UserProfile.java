package com.agri.market.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String address;
    private String city;
    private String state;
    private String pincode;
    private Double latitude;
    private Double longitude;

    @Column(name = "profile_photo")
    private String profilePhoto;

    @Column(name = "govt_id_number")
    private String govtIdNumber;

    @Builder.Default
    private Boolean verified = false;

    @Column(name = "wallet_balance")
    @Builder.Default
    private Double walletBalance = 0.0;
}
