package com.project.trading.analytics.controller;

import com.project.trading.analytics.dto.*;
import com.project.trading.analytics.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryDTO> getSummary(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(analyticsService.getSummary(email));
    }

    @GetMapping("/strategy-table")
    public ResponseEntity<List<AnalyticsStrategyDTO>> getStrategyTable(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return  ResponseEntity.ok(analyticsService.getStrategyTable(email));
    }

    @GetMapping("/streaks")
    public ResponseEntity<AnalyticsStreaksDTO> getStreaks(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(analyticsService.getStreaks(email));
    }

    @GetMapping("/heatstreaks")
    public ResponseEntity<List<AnalyticsHeatChartStreak>> getHeatStreak(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(analyticsService.getHeatStreak(email));
    }

    @GetMapping("/weekly-performance")
    public ResponseEntity<List<WeeklyPerformanceDTO>> getWeeklyPerformance(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(analyticsService.getWeeklyPerformance(email));
    }

    @GetMapping("/monthly-performance")
    public ResponseEntity<List<MonthlyPerformanceDTO>> getMonthlyPerformance(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(analyticsService.getMonthlyPerformance(email));
    }

    @GetMapping("/equity-curve")
    public ResponseEntity<List<AnalyticsEquityCurveDTO>> getEquityCurve(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(analyticsService.getEquityCurve(email));
    }
}
