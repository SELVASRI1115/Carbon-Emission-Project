package com.carbonaudit.carbonaudit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.carbonaudit.carbonaudit.entity.AuditRecord;

public interface AuditRepository
        extends JpaRepository<AuditRecord, Long> {

    List<AuditRecord> findByAction(
            String action
    );

    long countByAction(
            String action
    );

}