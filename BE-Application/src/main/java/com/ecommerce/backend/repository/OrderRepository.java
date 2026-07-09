package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    @Query(value = """
            SELECT DATE_FORMAT(o.order_date, '%Y-%m-%d'), SUM(o.total_amount), COUNT(o.id)
            FROM orders o
            WHERE o.status IN ('PAID', 'SHIPPING', 'DELIVERED')
            GROUP BY DATE_FORMAT(o.order_date, '%Y-%m-%d')
            ORDER BY DATE_FORMAT(o.order_date, '%Y-%m-%d') DESC
            """, nativeQuery = true)
    List<Object[]> getDailyStatisticsRaw();

    @Query(value = """
            SELECT DATE_FORMAT(o.order_date, '%Y-W%v'), SUM(o.total_amount), COUNT(o.id)
            FROM orders o
            WHERE o.status IN ('PAID', 'SHIPPING', 'DELIVERED')
            GROUP BY DATE_FORMAT(o.order_date, '%Y-W%v')
            ORDER BY DATE_FORMAT(o.order_date, '%Y-W%v') DESC
            """, nativeQuery = true)
    List<Object[]> getWeeklyStatisticsRaw();

    @Query(value = """
            SELECT DATE_FORMAT(o.order_date, '%Y-%m'), SUM(o.total_amount), COUNT(o.id)
            FROM orders o
            WHERE o.status IN ('PAID', 'SHIPPING', 'DELIVERED')
            GROUP BY DATE_FORMAT(o.order_date, '%Y-%m')
            ORDER BY DATE_FORMAT(o.order_date, '%Y-%m') DESC
            """, nativeQuery = true)
    List<Object[]> getMonthlyStatisticsRaw();

    @Query(value = """
            SELECT DATE_FORMAT(o.order_date, '%Y'), SUM(o.total_amount), COUNT(o.id)
            FROM orders o
            WHERE o.status IN ('PAID', 'SHIPPING', 'DELIVERED')
            GROUP BY DATE_FORMAT(o.order_date, '%Y')
            ORDER BY DATE_FORMAT(o.order_date, '%Y') DESC
            """, nativeQuery = true)
    List<Object[]> getYearlyStatisticsRaw();
}
