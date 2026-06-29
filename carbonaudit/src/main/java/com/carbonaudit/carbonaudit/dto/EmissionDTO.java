package com.carbonaudit.carbonaudit.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmissionDTO {

    private Long vendorId;

    private Long buyerId;

    private Long categoryId;

    private Double activityData;

    private Double emissionFactor;

    private String reportingMonth;

    private String status;

}