package com.agri.market.repository;

import com.agri.market.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByBuyerId(Long buyerId);
    List<Order> findByFarmerId(Long farmerId);
}
