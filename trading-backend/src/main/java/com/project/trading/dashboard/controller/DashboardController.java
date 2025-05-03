package com.project.trading.dashboard.controller;

import com.project.trading.dashboard.dto.RecentTradeDTO;
import com.project.trading.dashboard.service.DashboardService;
import com.project.trading.journal.model.Journal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
        dashboardService.getRecentTrades();
        return ResponseEntity.ok(dashboardService.getRecentTrades());
    }

//    @GetMapping("/summary")
//    public ResponseEntity<>
}
