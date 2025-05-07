package com.project.trading.analytics.dto;

public class AnalyticsSummaryDTO {
    private double totalPnl;
    private int totalTrades;
    private double winRate;
    private double avgRiskReward;
    private double maxDrawdrown;

    public AnalyticsSummaryDTO(double totalPnl,  double winRate, double avgRiskReward,int totalTrades, double maxDrawdrown) {
        this.totalPnl = totalPnl;
        this.totalTrades = totalTrades;
        this.winRate = winRate;
        this.avgRiskReward = avgRiskReward;
        this.maxDrawdrown=maxDrawdrown;
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

    public double getMaxDrawdrown() {
        return maxDrawdrown;
    }

    public void setMaxDrawdrown(double maxDrawdrown) {
        this.maxDrawdrown = maxDrawdrown;
    }
}
