package com.carbonaudit.carbonaudit.controller;

import com.carbonaudit.carbonaudit.dto.AuditDTO;
import com.carbonaudit.carbonaudit.service.AuditService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingRecords() {

        return ResponseEntity.ok(
                auditService.getPendingRecords());
    }
    @GetMapping("/all")
public ResponseEntity<?> getAllAudits() {

    return ResponseEntity.ok(
            auditService.getAllAudits()
    );
}

    @PutMapping("/approve/{auditId}")
    public ResponseEntity<?> approveRecord(
            @PathVariable Long auditId,
            @RequestBody AuditDTO auditDTO) {

        return ResponseEntity.ok(
                auditService.approveRecord(
                        auditId,
                        auditDTO));
    }

    @PutMapping("/reject/{auditId}")
    public ResponseEntity<?> rejectRecord(
            @PathVariable Long auditId,
            @RequestBody AuditDTO auditDTO) {

        return ResponseEntity.ok(
                auditService.rejectRecord(
                        auditId,
                        auditDTO));
    }
}