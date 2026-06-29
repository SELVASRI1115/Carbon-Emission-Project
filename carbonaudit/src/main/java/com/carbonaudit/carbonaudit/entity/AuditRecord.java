package com.carbonaudit.carbonaudit.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name="audit_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuditRecord {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long auditId;

    @OneToOne
    @JoinColumn(name="emission_id")
    private Emission emission;

    @ManyToOne
    @JoinColumn(name="auditor_id")
    private User auditor;

    private String remarks;

    private String action;

    private LocalDateTime auditedDate;

    private LocalDateTime createdDate;
   
}