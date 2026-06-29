package com.carbonaudit.carbonaudit.serviceImpl;

import com.carbonaudit.carbonaudit.dto.AuditDTO;
import com.carbonaudit.carbonaudit.entity.AuditRecord;
import com.carbonaudit.carbonaudit.entity.User;
import com.carbonaudit.carbonaudit.entity.Emission;
import com.carbonaudit.carbonaudit.repository.AuditRepository;
import com.carbonaudit.carbonaudit.repository.UserRepository;
import com.carbonaudit.carbonaudit.repository.EmissionRepository;
import com.carbonaudit.carbonaudit.service.AuditService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl
        implements AuditService {

    private final AuditRepository auditRepository;
    private final UserRepository userRepository;
    private final EmissionRepository emissionRepository;

 @Override
public Object getPendingRecords() {

    return auditRepository.findByAction(
            "PENDING");
}

        @Override
public Object getAllAudits() {

    return auditRepository.findAll();
}
    @Override
    public Object approveRecord(
            Long auditId,
            AuditDTO auditDTO) {

        AuditRecord audit =
                auditRepository
                        .findById(auditId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Audit Record Not Found"));

        User auditor =
                userRepository
                        .findById(
                                auditDTO.getAuditorId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Auditor Not Found"));

        audit.setAuditor(auditor);

        audit.setRemarks(
                auditDTO.getRemarks());

        audit.setAction(
                "APPROVED");

        audit.setAuditedDate(
                LocalDateTime.now());

        if (audit.getEmission() != null) {
            Emission emission = audit.getEmission();
            emission.setStatus("APPROVED");
            emissionRepository.save(emission);
        }

        return auditRepository.save(
                audit);
    }

    @Override
    public Object rejectRecord(
            Long auditId,
            AuditDTO auditDTO) {

        AuditRecord audit =
                auditRepository
                        .findById(auditId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Audit Record Not Found"));

        User auditor =
                userRepository
                        .findById(
                                auditDTO.getAuditorId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Auditor Not Found"));

        audit.setAuditor(auditor);

        audit.setRemarks(
                auditDTO.getRemarks());

        audit.setAction(
                "REJECTED");

        audit.setAuditedDate(
                LocalDateTime.now());

        if (audit.getEmission() != null) {
            Emission emission = audit.getEmission();
            emission.setStatus("REJECTED");
            emissionRepository.save(emission);
        }

        return auditRepository.save(
                audit);
    }
}