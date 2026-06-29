package com.carbonaudit.carbonaudit.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="vendors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long vendorId;

    private String companyName;

    private String industry;

    private String address;

    private String status;

    private String companyType;

    @OneToOne
    @JoinColumn(name="user_id")
    private User user;

    @Transient
    private Double totalCarbonEmission;
}
