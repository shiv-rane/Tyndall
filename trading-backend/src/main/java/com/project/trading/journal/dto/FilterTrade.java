package com.project.trading.journal.dto;

public class FilterTrade {
    String symbol;
    String date;

    public FilterTrade(String symbol, String date) {
        this.symbol = symbol;
        this.date = date;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
