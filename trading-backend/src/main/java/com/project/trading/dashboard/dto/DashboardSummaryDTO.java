package com.project.trading.dashboard.dto;

public class DashboardSummaryDTO {

    double total_pnl;

    double winrate;

    double avg_rrr;

    int total_trade;

    double max_drawdown;

    public DashboardSummaryDTO(double total_pnl, double winrate, double avg_rrr, int total_trade, double max_drawdown) {
        this.total_pnl = total_pnl;
        this.winrate = winrate;
        this.avg_rrr = avg_rrr;
        this.total_trade = total_trade;
        this.max_drawdown = max_drawdown;
    }

    public double getTotal_pnl() {
        return total_pnl;
    }

    public void setTotal_pnl(double total_pnl) {
        this.total_pnl = total_pnl;
    }

    public double getWinrate() {
        return winrate;
    }

    public void setWinrate(double winrate) {
        this.winrate = winrate;
    }

    public double getAvg_rrr() {
        return avg_rrr;
    }

    public void setAvg_rrr(double avg_rrr) {
        this.avg_rrr = avg_rrr;
    }

    public int getTotal_trade() {
        return total_trade;
    }

    public void setTotal_trade(int total_trade) {
        this.total_trade = total_trade;
    }

    public double getMax_drawdown() {
        return max_drawdown;
    }

    public void setMax_drawdown(double max_drawdown) {
        this.max_drawdown = max_drawdown;
    }
}
