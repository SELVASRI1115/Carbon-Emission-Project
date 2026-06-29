package com.carbonaudit.carbonaudit.controller;

import com.carbonaudit.carbonaudit.entity.EmissionCategory;
import com.carbonaudit.carbonaudit.repository.EmissionCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class EmissionCategoryController {

    private final EmissionCategoryRepository categoryRepository;

    @PostMapping
    public ResponseEntity<?> addCategory(
            @RequestBody EmissionCategory category){

        return ResponseEntity.ok(
                categoryRepository.save(category));
    }

    @GetMapping
    public ResponseEntity<?> getAllCategories(){

        return ResponseEntity.ok(
                categoryRepository.findAll());
    }
}