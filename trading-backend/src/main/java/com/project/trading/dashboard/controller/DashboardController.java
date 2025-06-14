package com.project.trading.dashboard.controller;

import com.project.trading.dashboard.dto.DashboardSummaryDTO;
import com.project.trading.dashboard.dto.RecentTradeDTO;
import com.project.trading.dashboard.service.DashboardService;
import com.project.trading.journal.model.Journal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/recent-trades")
    public ResponseEntity<List<RecentTradeDTO>> getRecentTrade(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(dashboardService.getRecentTrades(email));
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getDashSum(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(dashboardService.sendDashSum(email));
    }
}
