package com.project.trading.journal.dto;

import java.time.LocalDate;

public class FilterTrade {

    LocalDate startDate;
    LocalDate endDate;


    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalDate getStartDate() {
        return startDate;
    }
}
