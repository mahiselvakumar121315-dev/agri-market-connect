package com.agri.market.repository;

import com.agri.market.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryType(String categoryType);
    List<Product> findByFarmerId(Long farmerId);
}
