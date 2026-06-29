package com.carbonaudit.carbonaudit.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="emissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Emission {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long emissionId;

    @ManyToOne
    @JoinColumn(name="vendor_id")
    private Vendor vendor;

    @ManyToOne
    @JoinColumn(name="buyer_id")
    private Vendor buyer;

    @ManyToOne
    @JoinColumn(name="category_id")
    private EmissionCategory category;

    private Double activityData;

    private Double emissionFactor;

    private Double totalEmission;

    private String reportingMonth;

    private String status;
}