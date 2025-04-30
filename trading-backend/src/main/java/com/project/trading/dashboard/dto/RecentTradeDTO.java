package com.project.trading.dashboard.dto;

import java.time.LocalDate;

public class RecentTradeDTO {

    LocalDate date;

    String symbol;

    String side;

    double entry;

    double exit;

    double pnl;

    String emotion;
}
