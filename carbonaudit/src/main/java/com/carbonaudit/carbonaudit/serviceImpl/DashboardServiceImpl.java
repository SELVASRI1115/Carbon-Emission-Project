package com.carbonaudit.carbonaudit.serviceImpl;

import com.carbonaudit.carbonaudit.service.DashboardService;
import org.springframework.stereotype.Service;
import com.carbonaudit.carbonaudit.dto.DashboardResponseDTO;
import com.carbonaudit.carbonaudit.entity.Emission;
import com.carbonaudit.carbonaudit.repository.AuditRepository;
import com.carbonaudit.carbonaudit.repository.EmissionRepository;  
import com.carbonaudit.carbonaudit.repository.ReportRepository;
import com.carbonaudit.carbonaudit.repository.UserRepository;
import com.carbonaudit.carbonaudit.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final EmissionRepository emissionRepository;
    private final ReportRepository reportRepository;
    private final AuditRepository auditRepository;

    @Override
    public Object getDashboardSummary() {

        DashboardResponseDTO dashboard =
                new DashboardResponseDTO();

        dashboard.setTotalUsers(
                userRepository.count());

        dashboard.setTotalVendors(
                vendorRepository.count());

        dashboard.setTotalEmissions(
                emissionRepository.count());

        dashboard.setTotalReports(
                reportRepository.count());

        dashboard.setApprovedAudits(
                auditRepository.countByAction("APPROVED"));

        dashboard.setRejectedAudits(
                auditRepository.countByAction("REJECTED"));

        dashboard.setPendingAudits(
                auditRepository.countByAction("PENDING"));

        Double totalCarbonEmission =
                emissionRepository.findAll()
                        .stream()
                        .mapToDouble(
                                Emission::getTotalEmission)
                        .sum();

        dashboard.setTotalCarbonEmission(
                totalCarbonEmission);

        return dashboard;
    }
}