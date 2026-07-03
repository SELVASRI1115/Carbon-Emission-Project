package com.carbonaudit.carbonaudit.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name="reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long reportId;

    private String reportName;

    private String reportType;

    private String filePath;

    private LocalDateTime generatedDate;

    private String reportingMonth;

    @ManyToOne
    @JoinColumn(name="vendor_id")
    private Vendor vendor;
}