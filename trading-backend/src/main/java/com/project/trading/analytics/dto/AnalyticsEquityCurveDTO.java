package com.project.trading.analytics.dto;

import java.time.LocalDate;

public class AnalyticsEquityCurveDTO {

    private LocalDate date;
    private long capital;

    public AnalyticsEquityCurveDTO(){    }

    public AnalyticsEquityCurveDTO(LocalDate date, Long capital) {
        this.date = date;
        this.capital = capital;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getCapital() {
        return capital;
    }

    public void setCapital(long capital) {
        this.capital = capital;
    }
}
