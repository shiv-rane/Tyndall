package com.project.trading.analytics.service;

import com.project.trading.analytics.dto.AnalyticsHeatChartStreak;
import com.project.trading.analytics.dto.AnalyticsStrategyDTO;
import com.project.trading.analytics.dto.AnalyticsStreaksDTO;
import com.project.trading.analytics.dto.AnalyticsSummaryDTO;
import com.project.trading.journal.model.Journal;
import com.project.trading.journal.repository.JournalRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private JournalRepository journalRepository;

    public AnalyticsSummaryDTO getSummary(String email){
        List<Journal> trades = journalRepository.findAllByUserEmail(email);

        if(trades.isEmpty()){
            throw new EntityNotFoundException("No trade was found");
        }

        double totalPnl = trades.stream().mapToDouble(Journal::getPnl).sum();
        int totalTrades = trades.size();

        long wins = trades.stream().filter(t -> t.getPnl() > 0).count();
        double winRate = totalTrades == 0 ? 0 : (wins * 100.0) / totalTrades;

        double avgRR = trades.stream()
                .filter(t -> t.getEntryPrice() != 0)
                .mapToDouble(t -> Math.abs(t.getPnl() / (t.getEntryPrice() * t.getQuantity())))
                .average().orElse(0);
        double maxDrawdown=0;

        return new AnalyticsSummaryDTO(totalPnl, winRate, avgRR, totalTrades,maxDrawdown);
    }

    public List<AnalyticsStrategyDTO> getStrategyTable(String email){
        return journalRepository.getStrategyAnalytics(email);
    }

    public AnalyticsStreaksDTO getStreaks(String email){
        List<Journal> trades = journalRepository.findAllByUserEmailOrderByDateAsc(email);

        int currentWinStreak = 0;
        int currentLossStreak = 0;
        int longestWinStreak = 0;
        int longestLossStreak = 0;

        for (Journal trade : trades) {
            double pnl = trade.getPnl();

            if (pnl > 0) {
                currentWinStreak++;
                currentLossStreak = 0;
            } else if (pnl < 0) {
                currentLossStreak++;
                currentWinStreak = 0;
            } else {
                currentWinStreak = 0;
                currentLossStreak = 0;
            }

            longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
            longestLossStreak = Math.max(longestLossStreak, currentLossStreak);
        }

        return new AnalyticsStreaksDTO(longestWinStreak, longestLossStreak);
    }

    public List<AnalyticsHeatChartStreak> getHeatStreak(){

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Journal> trades = journalRepository.findAllByUserEmail(email);

        List<AnalyticsHeatChartStreak> list = trades.stream()
                .map(j -> new AnalyticsHeatChartStreak(j.getDate(), j.getPnl()))
                .collect(Collectors.toList());


        return  list;
    }

}
