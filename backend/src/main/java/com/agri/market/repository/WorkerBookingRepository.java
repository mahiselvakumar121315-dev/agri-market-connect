package com.agri.market.repository;

import com.agri.market.entity.WorkerBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkerBookingRepository extends JpaRepository<WorkerBooking, Long> {
    List<WorkerBooking> findByFarmerId(Long farmerId);
    List<WorkerBooking> findByWorkerId(Long workerId);
    List<WorkerBooking> findByStatus(String status);
}
