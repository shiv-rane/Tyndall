package com.project.trading.journal.repository;

import com.project.trading.analytics.dto.AnalyticsStrategyDTO;
import com.project.trading.auth.model.User;
import com.project.trading.journal.model.Journal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JournalRepository extends JpaRepository<Journal,Integer> {

    List<Journal> findByUserOrderByCreatedAtDesc(User user);

    List<Journal> findAllByUserEmail(String email);

    @Query("""
    SELECT new com.project.trading.analytics.dto.AnalyticsStrategyDTO(
        j.strategy,
        COUNT(j),
        SUM(CASE WHEN j.pnl > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(j),
        SUM(j.pnl),
        AVG(j.pnl)
    )
    FROM Journal j
    WHERE j.user.email = :email
    GROUP BY j.strategy
""")
    List<AnalyticsStrategyDTO> getStrategyAnalytics(String email);

    List<Journal> findAllByUserEmailOrderByDateAsc(String email);
}
