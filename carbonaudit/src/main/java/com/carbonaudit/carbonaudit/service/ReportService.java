package com.carbonaudit.carbonaudit.service;

import com.carbonaudit.carbonaudit.dto.ReportDTO;
import org.springframework.http.ResponseEntity;

public interface ReportService {

    Object getAllReports();

    Object generateReport(ReportDTO reportDTO);

    ResponseEntity<byte[]> downloadReport(Long id);

    ResponseEntity<byte[]> viewReport(Long id);

}