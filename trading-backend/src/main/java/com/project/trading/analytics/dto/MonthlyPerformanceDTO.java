package com.project.trading.analytics.dto;

public class MonthlyPerformanceDTO {
    String month;
    double total_pnl;

    public MonthlyPerformanceDTO(String month, double total_pnl) {
        this.month = month;
        this.total_pnl = total_pnl;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public double getTotal_pnl() {
        return total_pnl;
    }

    public void setTotal_pnl(double total_pnl) {
        this.total_pnl = total_pnl;
    }
}
