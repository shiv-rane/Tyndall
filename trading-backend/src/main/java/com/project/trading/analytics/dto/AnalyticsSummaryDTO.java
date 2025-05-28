package com.project.trading.analytics.dto;

public class AnalyticsSummaryDTO {
    private double totalPnl;
    private int totalTrades;
    private double winRate;
    private double avgRiskReward;
    private double maxDrawdown;

    public AnalyticsSummaryDTO(double totalPnl,  double winRate, double avgRiskReward,int totalTrades, double maxDrawdown) {
        this.totalPnl = totalPnl;
        this.totalTrades = totalTrades;
        this.winRate = winRate;
        this.avgRiskReward = avgRiskReward;
        this.maxDrawdown = maxDrawdown;
    }

    public double getTotalPnl() {
        return totalPnl;
    }

    public void setTotalPnl(double totalPnl) {
        this.totalPnl = totalPnl;
    }

    public int getTotalTrades() {
        return totalTrades;
    }

    public void setTotalTrades(int totalTrades) {
        this.totalTrades = totalTrades;
    }

    public double getWinRate() {
        return winRate;
    }

    public void setWinRate(double winRate) {
        this.winRate = winRate;
    }

    public double getAvgRiskReward() {
        return avgRiskReward;
    }

    public void setAvgRiskReward(double avgRiskReward) {
        this.avgRiskReward = avgRiskReward;
    }

    public double getMaxDrawdown() {
        return maxDrawdown;
    }

    public void setMaxDrawdown(double maxDrawdown) {
        this.maxDrawdown = maxDrawdown;
    }
}
