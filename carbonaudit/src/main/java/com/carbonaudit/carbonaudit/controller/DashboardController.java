package com.carbonaudit.carbonaudit.controller;

import com.carbonaudit.carbonaudit.service.DashboardService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<?> dashboardSummary(){

        return ResponseEntity.ok(
                dashboardService.getDashboardSummary());
    }
}