package com.project.trading.analytics.dto;

public class AnalyticsSummaryDTO {
    private double totalPnl;
    private int totalTrades;
    private double winRate;
    private double avgRiskReward;

    public AnalyticsSummaryDTO(double totalPnl, int totalTrades, double winRate, double avgRiskReward) {
        this.totalPnl = totalPnl;
        this.totalTrades = totalTrades;
        this.winRate = winRate;
        this.avgRiskReward = avgRiskReward;
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
}
