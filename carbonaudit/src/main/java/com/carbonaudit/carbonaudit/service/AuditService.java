package com.carbonaudit.carbonaudit.service;

import com.carbonaudit.carbonaudit.dto.AuditDTO;

public interface AuditService {

    Object getPendingRecords();
    Object getAllAudits();

    Object approveRecord(
            Long auditId,
            AuditDTO auditDTO);

    Object rejectRecord(
            Long auditId,
            AuditDTO auditDTO);
}