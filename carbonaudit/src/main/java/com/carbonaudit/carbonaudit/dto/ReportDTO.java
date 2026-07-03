package com.carbonaudit.carbonaudit.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportDTO {

    private String reportName;

    private String reportType;

    private String filePath;

    private Long vendorId;

    private String reportingMonth;

}