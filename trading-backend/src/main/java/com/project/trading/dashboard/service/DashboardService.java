package com.project.trading.dashboard.service;

import com.project.trading.auth.model.User;
import com.project.trading.auth.repository.UserRepository;
import com.project.trading.dashboard.dto.DashboardSummaryDTO;
import com.project.trading.dashboard.dto.RecentTradeDTO;
import com.project.trading.journal.model.Journal;
import com.project.trading.journal.repository.JournalRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private UserRepository userRepository;

    public DashboardSummaryDTO sendDashSum(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Journal> trades = journalRepository.findAllByUserEmail(email);

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
        double drawdown = 0;


        return new DashboardSummaryDTO(totalPnl,winRate,avgRR,totalTrades,drawdown);
    }

    public List<RecentTradeDTO> getRecentTrades() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return journalRepository.findTop3ByUserEmailOrderByCreatedAtDesc(email)
                .stream()
                .map(journal -> new RecentTradeDTO(
                        journal.getDate(),
                        journal.getSymbol(),
                        journal.getTradeType(),  // assuming `side` = tradeType (BUY/SELL)
                        journal.getEntryPrice(),
                        journal.getExitPrice(),
                        journal.getPnl(),
                        journal.getNote()  // assuming `note` is where you store emotion
                ))
                .toList();
    }
}
