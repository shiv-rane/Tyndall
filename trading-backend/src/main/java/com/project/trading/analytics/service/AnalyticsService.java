package com.project.trading.analytics.service;

import com.project.trading.analytics.dto.*;
import com.project.trading.auth.model.User;
import com.project.trading.auth.repository.UserRepository;
import com.project.trading.journal.model.Journal;
import com.project.trading.journal.repository.JournalRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private UserRepository userRepository;

    public AnalyticsSummaryDTO getSummary(String email){
        List<Journal> trades = journalRepository.findAllByUserEmail(email);
        User user = userRepository.findByEmail(email).orElseThrow();
        long capital = user.getInitial_capital();
        if (capital == 0) capital = 1;

        if(trades.isEmpty()){
            throw new EntityNotFoundException("No trade was found");
        }

        double totalPnl = trades.stream().mapToDouble(Journal::getPnl).sum();
        int totalTrades = trades.size();

        Map<LocalDate, Long> dailyPnL = new TreeMap<>();
        for (Journal trade : trades) {
            LocalDate date = trade.getDate();
            dailyPnL.put(date, dailyPnL.getOrDefault(date, 0L) + (long) trade.getPnl());
        }
        long wins = trades.stream().filter(t -> t.getPnl() > 0).count();
        double winRate = totalTrades == 0 ? 0 : (wins * 100.0) / totalTrades;

        double avgRR = trades.stream()
                .filter(t -> t.getEntryPrice() != 0)
                .mapToDouble(t -> Math.abs(t.getPnl() / (t.getEntryPrice() * t.getQuantity())))
                .average().orElse(0);
        long peak = capital;
        long equity = capital;
        double maxDrawdown=0;
        for (Map.Entry<LocalDate, Long> entry : dailyPnL.entrySet()) {
            equity += entry.getValue();

            if (equity > peak) {
                peak = equity;
            } else {
                double drawdown = ((double)(peak - equity) / peak) * 100.0;
                maxDrawdown = Math.max(maxDrawdown, drawdown);
            }
        }

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

    public List<WeeklyPerformanceDTO> getWeeklyPerformance(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Journal> trades = journalRepository.findAllByUserEmail(email);

        Map<LocalDate, Double> weeklyPnL = trades.stream()
                .collect(Collectors.groupingBy(
                        trade -> trade.getDate().with(DayOfWeek.MONDAY), // group by weekStart
                        Collectors.summingDouble(Journal::getPnl)           // sum PnL for the week
                ));
        return  weeklyPnL.entrySet().stream()
                .map(entry -> new WeeklyPerformanceDTO(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparing(WeeklyPerformanceDTO::getWeekStart)) // optional: sort by week
                .collect(Collectors.toList());
    }


    public List<MonthlyPerformanceDTO> getMonthlyPerformance() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Journal> trades = journalRepository.findAllByUserEmail(email);

        // Use a Map to group by "YYYY-MM"
        Map<String, Double> monthlyPnLMap = new HashMap<>();

        for (Journal trade : trades) {
            String journalDate = String.valueOf(trade.getDate()); // format: YYYY/MM/DD
            String monthKey = journalDate.substring(0, 7).replace("/", "-"); // "YYYY-MM"

            monthlyPnLMap.put(
                    monthKey,
                    monthlyPnLMap.getOrDefault(monthKey, 0.0) + trade.getPnl()
            );
        }

        // Convert map entries to DTO list
        List<MonthlyPerformanceDTO> result = new ArrayList<>();
        for (Map.Entry<String, Double> entry : monthlyPnLMap.entrySet()) {
            result.add(new MonthlyPerformanceDTO(entry.getKey(), Math.round(entry.getValue())));
        }

        // Optional: sort by date
        result.sort(Comparator.comparing(MonthlyPerformanceDTO::getMonth));

        return result;
    }


    public List<AnalyticsEquityCurveDTO> getEquityCurve(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<Journal> trades = journalRepository.findAllByUserEmailOrderByDateAsc(email);
        User user = userRepository.findByEmail(email).orElseThrow();
        long capital = user.getInitial_capital();

        Map<LocalDate, Long> dailyPnL = new TreeMap<>();
        for (Journal trade : trades) {
            LocalDate date = trade.getDate();
            dailyPnL.put(date, dailyPnL.getOrDefault(date, 0L) + (long)trade.getPnl());
        }
        List<AnalyticsEquityCurveDTO> equityCurve = new ArrayList<>();
        for (Map.Entry<LocalDate, Long> entry : dailyPnL.entrySet()) {
            capital += entry.getValue();
            equityCurve.add(new AnalyticsEquityCurveDTO(entry.getKey(), capital));
        }
        return equityCurve;
    }
}
