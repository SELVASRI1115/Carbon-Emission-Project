package com.carbonaudit.carbonaudit.controller;

import com.carbonaudit.carbonaudit.dto.NotificationDTO;
import com.carbonaudit.carbonaudit.service.NotificationService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<?> addNotification(
            @RequestBody NotificationDTO dto){

        return ResponseEntity.ok(
                notificationService
                        .addNotification(dto));
    }

    @GetMapping
    public ResponseEntity<?> getAllNotifications(){

        return ResponseEntity.ok(
                notificationService
                        .getAllNotifications());
    }

    @PutMapping("/read/{id}")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long id){

        return ResponseEntity.ok(
                notificationService
                        .markAsRead(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(
            @PathVariable Long id){

        notificationService
                .deleteNotification(id);

        return ResponseEntity.ok(
                "Deleted Successfully");
    }
}