package com.project.trading.analytics.dto;

public class AnalyticsStreaksDTO {

    private int longestWinStreak;
    private int longestLossStreak;

    public AnalyticsStreaksDTO(int longestWinStreak, int longestLossStreak) {
        this.longestWinStreak = longestWinStreak;
        this.longestLossStreak = longestLossStreak;
    }

    public int getLongestWinStreak() {
        return longestWinStreak;
    }

    public void setLongestWinStreak(int longestWinStreak) {
        this.longestWinStreak = longestWinStreak;
    }

    public int getLongestLossStreak() {
        return longestLossStreak;
    }

    public void setLongestLossStreak(int longestLossStreak) {
        this.longestLossStreak = longestLossStreak;
    }
}
