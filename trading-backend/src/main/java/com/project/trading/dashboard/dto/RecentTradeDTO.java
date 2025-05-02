package com.project.trading.dashboard.dto;

import java.time.LocalDate;

public class RecentTradeDTO {

    LocalDate date;

    String symbol;

    String side;

    double entry;

    double exit;

    double pnl;

    String note;


    public RecentTradeDTO(LocalDate date, String symbol, String side, double entry, double exit, double pnl, String emotion) {
        this.date = date;
        this.symbol = symbol;
        this.side = side;
        this.entry = entry;
        this.exit = exit;
        this.pnl = pnl;
        this.note = note;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getSide() {
        return side;
    }

    public void setSide(String side) {
        this.side = side;
    }

    public double getEntry() {
        return entry;
    }

    public void setEntry(double entry) {
        this.entry = entry;
    }

    public double getExit() {
        return exit;
    }

    public void setExit(double exit) {
        this.exit = exit;
    }

    public double getPnl() {
        return pnl;
    }

    public void setPnl(double pnl) {
        this.pnl = pnl;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
