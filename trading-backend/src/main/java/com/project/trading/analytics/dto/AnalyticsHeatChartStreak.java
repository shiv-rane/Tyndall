package com.project.trading.analytics.dto;

import java.time.LocalDate;

public class AnalyticsHeatChartStreak{

    private LocalDate date;
    private double pnl;

    public AnalyticsHeatChartStreak(LocalDate date, double pnl) {
        this.date = date;
        this.pnl = pnl;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getPnl() {
        return pnl;
    }

    public void setPnl(double pnl) {
        this.pnl = pnl;
    }
}
