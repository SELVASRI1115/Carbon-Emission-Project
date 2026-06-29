package com.carbonaudit.carbonaudit.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuditDTO {

    private Long emissionId;

    private Long auditorId;

    private String remarks;

    private String action;

}