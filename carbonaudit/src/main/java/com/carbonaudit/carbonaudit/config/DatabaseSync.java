package com.carbonaudit.carbonaudit.config;

import com.carbonaudit.carbonaudit.entity.AuditRecord;
import com.carbonaudit.carbonaudit.entity.Emission;
import com.carbonaudit.carbonaudit.repository.AuditRepository;
import com.carbonaudit.carbonaudit.repository.EmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DatabaseSync implements CommandLineRunner {

    private final AuditRepository auditRepository;
    private final EmissionRepository emissionRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>> Running Database Status Synchronization...");
        List<AuditRecord> audits = auditRepository.findAll();
        int updatedCount = 0;
        for (AuditRecord audit : audits) {
            Emission emission = audit.getEmission();
            if (emission != null) {
                String auditAction = audit.getAction();
                String emissionStatus = emission.getStatus();
                if (auditAction != null && !auditAction.equals(emissionStatus)) {
                    emission.setStatus(auditAction);
                    emissionRepository.save(emission);
                    updatedCount++;
                }
            }
        }
        System.out.println(">>> Database Status Synchronization Completed. Updated " + updatedCount + " emissions.");
    }
}
