package com.carbonaudit.carbonaudit.controller;

import com.carbonaudit.carbonaudit.dto.VendorDTO;
import com.carbonaudit.carbonaudit.service.VendorService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @PostMapping
    public ResponseEntity<?> addVendor(
            @RequestBody VendorDTO vendorDTO){

        return ResponseEntity.ok(
                vendorService.addVendor(vendorDTO)
        );
    }

    @GetMapping
    public ResponseEntity<?> getAllVendors(){

        return ResponseEntity.ok(
                vendorService.getAllVendors()
        );
    }
    @GetMapping("/{id}")
public ResponseEntity<?> getVendorById(
        @PathVariable Long id){

    return ResponseEntity.ok(
            vendorService.getVendorById(id));
}

@PutMapping("/{id}")
public ResponseEntity<?> updateVendor(
        @PathVariable Long id,
        @RequestBody VendorDTO vendorDTO){

    return ResponseEntity.ok(
            vendorService.updateVendor(
                    id,
                    vendorDTO));
}

    @DeleteMapping("/{id}")
public ResponseEntity<?> deleteVendor(
        @PathVariable Long id){

    vendorService.deleteVendor(id);

    return ResponseEntity.ok(
            "Vendor Deleted Successfully");
}
}