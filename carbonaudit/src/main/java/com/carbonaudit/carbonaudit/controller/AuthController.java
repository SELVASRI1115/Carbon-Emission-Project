package com.carbonaudit.carbonaudit.controller;

import com.carbonaudit.carbonaudit.dto.LoginRequestDTO;
import com.carbonaudit.carbonaudit.dto.RegisterRequestDTO;
import com.carbonaudit.carbonaudit.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequestDTO request){

        return ResponseEntity.ok(
                authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequestDTO request){

        return ResponseEntity.ok(
                authService.login(request));
    }
}