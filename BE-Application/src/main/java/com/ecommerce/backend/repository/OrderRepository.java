package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT DATE_FORMAT(o.orderDate, '%Y-%m-%d'), SUM(o.totalAmount), COUNT(o.id) " +
            "FROM Order o WHERE o.status IN ('PAID', 'SHIPPING', 'DELIVERED') GROUP BY DATE_FORMAT(o.orderDate, '%Y-%m-%d') ORDER BY DATE_FORMAT(o.orderDate, '%Y-%m-%d') DESC")
    List<Object[]> getDailyStatisticsRaw();

    @org.springframework.data.jpa.repository.Query("SELECT DATE_FORMAT(o.orderDate, '%Y-W%v'), SUM(o.totalAmount), COUNT(o.id) " +
            "FROM Order o WHERE o.status IN ('PAID', 'SHIPPING', 'DELIVERED') GROUP BY DATE_FORMAT(o.orderDate, '%Y-W%v') ORDER BY DATE_FORMAT(o.orderDate, '%Y-W%v') DESC")
    List<Object[]> getWeeklyStatisticsRaw();

    @org.springframework.data.jpa.repository.Query("SELECT DATE_FORMAT(o.orderDate, '%Y-%m'), SUM(o.totalAmount), COUNT(o.id) " +
            "FROM Order o WHERE o.status IN ('PAID', 'SHIPPING', 'DELIVERED') GROUP BY DATE_FORMAT(o.orderDate, '%Y-%m') ORDER BY DATE_FORMAT(o.orderDate, '%Y-%m') DESC")
    List<Object[]> getMonthlyStatisticsRaw();

    @org.springframework.data.jpa.repository.Query("SELECT DATE_FORMAT(o.orderDate, '%Y'), SUM(o.totalAmount), COUNT(o.id) " +
            "FROM Order o WHERE o.status IN ('PAID', 'SHIPPING', 'DELIVERED') GROUP BY DATE_FORMAT(o.orderDate, '%Y') ORDER BY DATE_FORMAT(o.orderDate, '%Y') DESC")
    List<Object[]> getYearlyStatisticsRaw();
}
