package com.carbonaudit.carbonaudit.controller;

import com.carbonaudit.carbonaudit.service.ReportService;
import com.carbonaudit.carbonaudit.dto.ReportDTO;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<?> getReports(){

        return ResponseEntity.ok(
                reportService.getAllReports());
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateReport(@RequestBody ReportDTO reportDTO){

        return ResponseEntity.ok(
                reportService.generateReport(reportDTO));
    }

    @PostMapping("/trigger-monthly")
    public ResponseEntity<?> triggerMonthlyReports(@RequestParam(required = false) String month) {
        return ResponseEntity.ok(
                reportService.generateMonthlyReports(month));
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadReport(@PathVariable Long id) {
        return reportService.downloadReport(id);
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<byte[]> viewReport(@PathVariable Long id) {
        return reportService.viewReport(id);
    }
}