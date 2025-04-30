package com.project.trading.dashboard.service;

import com.project.trading.dashboard.dto.DashboardSummaryDTO;
import com.project.trading.journal.repository.JournalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private JournalRepository journalRepository;

    public DashboardSummaryDTO sendDashSum(DashboardSummaryDTO dashboardSummaryDTO){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
    }

}
