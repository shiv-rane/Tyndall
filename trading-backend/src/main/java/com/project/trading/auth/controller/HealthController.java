package com.project.trading.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
/*
Render shutdowns when no request has been pass after a while thus
this endpoint pings render every 5 min through https://uptimerobot.com/
making render stay active
 */
@RestController
public class HealthController {
    @GetMapping("/api/ping")
    public String ping() {
        return "pong";
    }
}

