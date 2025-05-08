package com.project.trading.analytics.dto;

import java.time.LocalDate;

public class WeeklyPerformanceDTO {
    private LocalDate weekStart;
    private double pnl;

    public WeeklyPerformanceDTO(LocalDate weekStart, double pnl) {
        this.weekStart = weekStart;
        this.pnl = pnl;
    }

    public LocalDate getWeekStart() {
        return weekStart;
    }

    public void setWeekStart(LocalDate weekStart) {
        this.weekStart = weekStart;
    }

    public double getPnl() {
        return pnl;
    }

    public void setPnl(double pnl) {
        this.pnl = pnl;
    }
}
