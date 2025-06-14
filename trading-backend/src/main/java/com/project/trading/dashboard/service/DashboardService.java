package com.project.trading.dashboard.service;

import com.project.trading.auth.model.User;
import com.project.trading.auth.repository.UserRepository;
import com.project.trading.dashboard.dto.DashboardSummaryDTO;
import com.project.trading.dashboard.dto.RecentTradeDTO;
import com.project.trading.journal.model.Journal;
import com.project.trading.journal.repository.JournalRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private UserRepository userRepository;

    @Cacheable(value = "summary", key = "#email")
    public DashboardSummaryDTO sendDashSum(String email){
        List<Journal> trades = journalRepository.findAllByUserEmail(email);
        User user = userRepository.findByEmail(email).orElseThrow();
        long capital = user.getInitial_capital();

        if(trades.isEmpty()){
            throw new EntityNotFoundException("No trade was found");
        }

        double totalPnl = Math.round(
                trades.stream().mapToDouble(Journal::getPnl).sum() * 100.0
        ) / 100.0;

        int totalTrades = trades.size();
        long wins = trades.stream().filter(t -> t.getPnl() > 0).count();
        double winRate = totalTrades == 0 ? 0 : (wins * 100.0) / totalTrades;

        int avgRR = (int) trades.stream()
                .filter(t -> t.getEntryPrice() != 0)
                .mapToDouble(t -> Math.abs(t.getPnl() / (t.getEntryPrice() * t.getQuantity())))
                .average().orElse(0);

        // Build equity curve
        Map<LocalDate, Long> dailyPnL = new TreeMap<>();
        for (Journal trade : trades) {
            LocalDate date = trade.getDate();
            dailyPnL.put(date, dailyPnL.getOrDefault(date, 0L) + (long) trade.getPnl());
        }

        long peak = capital;
        long equity = capital;
        double maxDrawdown = 0;
        for (Map.Entry<LocalDate, Long> entry : dailyPnL.entrySet()) {
            equity += entry.getValue();
            if (equity > peak) {
                peak = equity;
            } else {
                double drawdown = ((double)(peak - equity) / peak) * 100.0;
                maxDrawdown = Math.max(maxDrawdown, drawdown);
            }
        }

        return new DashboardSummaryDTO(
                totalPnl,
                Math.round(winRate),
                avgRR,
                totalTrades,
                Math.round(maxDrawdown * 100.0) / 100.0
        );
    }

    @Cacheable(value = "recent-trade", key = "#email")
    public List<RecentTradeDTO> getRecentTrades(String email) {
        return journalRepository.findTop3ByUserEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(journal -> new RecentTradeDTO(
                        journal.getDate(),
                        journal.getSymbol(),
                        journal.getTradeType(),
                        journal.getEntryPrice(),
                        journal.getExitPrice(),
                        journal.getPnl(),
                        journal.getNote()
                ))
                .toList();
    }
}
