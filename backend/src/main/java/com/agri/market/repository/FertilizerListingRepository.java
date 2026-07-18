package com.agri.market.repository;

import com.agri.market.entity.FertilizerListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FertilizerListingRepository extends JpaRepository<FertilizerListing, Long> {
}
