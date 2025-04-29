package com.project.trading.analytics.dto;
//THis class is for strategy table
public record AnalyticsStrategyDTO(
        String strategy,
        long totalTrades,
        double winRate,
        double totalPnl,
        double avgPnlPerTrade
) {}


