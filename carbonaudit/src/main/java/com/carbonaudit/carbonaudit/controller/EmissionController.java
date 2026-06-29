package com.carbonaudit.carbonaudit.controller;

import com.carbonaudit.carbonaudit.dto.EmissionDTO;
import com.carbonaudit.carbonaudit.service.EmissionService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/emissions")
@RequiredArgsConstructor
public class EmissionController {

    private final EmissionService emissionService;

    @PostMapping
    public ResponseEntity<?> addEmission(
            @RequestBody EmissionDTO dto) {

        return ResponseEntity.ok(
                emissionService.addEmission(dto)
        );
    }

    @GetMapping
    public ResponseEntity<?> getAllEmissions() {

        return ResponseEntity.ok(
                emissionService.getAllEmissions()
        );
    }

    // ADD THIS
    @GetMapping("/my")
    public ResponseEntity<?> getMyEmissions() {

        return ResponseEntity.ok(
                emissionService.getMyEmissions()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmission(
            @PathVariable Long id,
            @RequestBody EmissionDTO emissionDTO) {

        return ResponseEntity.ok(
                emissionService.updateEmission(
                        id,
                        emissionDTO
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmission(
            @PathVariable Long id) {

        emissionService.deleteEmission(id);

        return ResponseEntity.ok(
                "Emission Deleted Successfully"
        );
    }
}