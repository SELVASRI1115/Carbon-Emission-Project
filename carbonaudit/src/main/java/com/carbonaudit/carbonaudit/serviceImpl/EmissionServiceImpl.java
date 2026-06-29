package com.carbonaudit.carbonaudit.serviceImpl;

import com.carbonaudit.carbonaudit.dto.EmissionDTO;
import com.carbonaudit.carbonaudit.entity.AuditRecord;
import com.carbonaudit.carbonaudit.entity.Emission;
import com.carbonaudit.carbonaudit.entity.EmissionCategory;
import com.carbonaudit.carbonaudit.entity.Vendor;
import com.carbonaudit.carbonaudit.entity.User;
import com.carbonaudit.carbonaudit.entity.Role;
import com.carbonaudit.carbonaudit.repository.AuditRepository;
import com.carbonaudit.carbonaudit.repository.EmissionCategoryRepository;
import com.carbonaudit.carbonaudit.repository.EmissionRepository;
import com.carbonaudit.carbonaudit.repository.VendorRepository;
import com.carbonaudit.carbonaudit.repository.UserRepository;
import com.carbonaudit.carbonaudit.service.EmissionService;
import com.carbonaudit.carbonaudit.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmissionServiceImpl
        implements EmissionService {

    private final EmissionRepository emissionRepository;
    private final VendorRepository vendorRepository;
    private final EmissionCategoryRepository emissionCategoryRepository;
    private final AuditRepository auditRepository;
    private final HttpServletRequest request;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    public Object addEmission(
            EmissionDTO emissionDTO) {

        Vendor vendor = vendorRepository
                .findById(emissionDTO.getVendorId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Vendor not found"));

        Vendor buyer = null;
        if (emissionDTO.getBuyerId() != null) {
            buyer = vendorRepository.findById(emissionDTO.getBuyerId()).orElse(null);
        }

        EmissionCategory category =
                emissionCategoryRepository
                        .findById(
                                emissionDTO.getCategoryId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Category not found"));

        Emission emission =
                new Emission();

        emission.setVendor(vendor);

        emission.setBuyer(buyer);

        emission.setCategory(category);

        emission.setActivityData(
                emissionDTO.getActivityData());

        emission.setEmissionFactor(
                emissionDTO.getEmissionFactor());

        emission.setTotalEmission(
                emissionDTO.getActivityData()
                        * emissionDTO.getEmissionFactor());

        emission.setReportingMonth(
                emissionDTO.getReportingMonth());

        emission.setStatus(
                emissionDTO.getStatus());

        // Save emission
        Emission savedEmission =
                emissionRepository.save(emission);

        // Create Audit Record Automatically
        AuditRecord auditRecord =
                new AuditRecord();

        auditRecord.setEmission(
                savedEmission);

        auditRecord.setRemarks(
                "Awaiting Auditor Verification");

        auditRecord.setAction(
                "PENDING");

        auditRecord.setCreatedDate(
                LocalDateTime.now());

        auditRecord.setAuditedDate(
                null);

        auditRepository.save(
                auditRecord);

        return savedEmission;
    }

    @Override
    public Object getAllEmissions() {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String email = jwtService.getEmailFromToken(token);
                User user = userRepository.findByEmail(email).orElse(null);
                if (user != null && user.getRole() == Role.VENDOR) {
                    Vendor vendor = vendorRepository.findByUser(user).orElse(null);
                    if (vendor != null) {
                        return emissionRepository.findByVendor_VendorId(vendor.getVendorId());
                    }
                }
            } catch (Exception e) {
                // Ignore and fall back to returning all
            }
        }
        return emissionRepository.findAll();
    }

    @Override
    public Object getEmissionById(
            Long id) {

        return emissionRepository
                .findById(id);
    }

    @Override
    public Object updateEmission(
            Long id,
            EmissionDTO emissionDTO) {

        Emission emission =
                emissionRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Emission not found"));

        Vendor vendor =
                vendorRepository
                        .findById(
                                emissionDTO.getVendorId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Vendor not found"));

        EmissionCategory category =
                emissionCategoryRepository
                        .findById(
                                emissionDTO.getCategoryId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Category not found"));

        emission.setVendor(vendor);

        emission.setCategory(category);

        emission.setActivityData(
                emissionDTO.getActivityData());

        emission.setEmissionFactor(
                emissionDTO.getEmissionFactor());

        emission.setTotalEmission(
                emissionDTO.getActivityData()
                        * emissionDTO.getEmissionFactor());

        emission.setReportingMonth(
                emissionDTO.getReportingMonth());

        emission.setStatus(
                emissionDTO.getStatus());

        return emissionRepository
                .save(emission);
    }

    @Override
    public void deleteEmission(
            Long id) {

        emissionRepository
                .deleteById(id);
    }
@Override
public Object getMyEmissions() {
    String authHeader = request.getHeader("Authorization");
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        String token = authHeader.substring(7);
        try {
            String email = jwtService.getEmailFromToken(token);
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null && user.getRole() == Role.VENDOR) {
                Vendor vendor = vendorRepository.findByUser(user).orElse(null);
                if (vendor != null) {
                    return emissionRepository.findByVendor_VendorId(vendor.getVendorId());
                }
            }
        } catch (Exception e) {
            // fall through to empty list
        }
    }
    return new java.util.ArrayList<>();
}
}