package com.carbonaudit.carbonaudit.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponseDTO {

    private Long totalUsers;

    private Long totalVendors;

    private Long totalEmissions;

    private Long totalReports;

    private Long approvedAudits;

    private Long rejectedAudits;

    private Long pendingAudits;

    private Double totalCarbonEmission;
}