package com.agri.market.repository;

import com.agri.market.entity.AnimalListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnimalListingRepository extends JpaRepository<AnimalListing, Long> {
    List<AnimalListing> findByAnimalType(String animalType);
    List<AnimalListing> findByOwnerId(Long ownerId);
    List<AnimalListing> findByStatus(String status);
}
