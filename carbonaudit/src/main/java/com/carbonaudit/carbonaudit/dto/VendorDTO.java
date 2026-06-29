package com.carbonaudit.carbonaudit.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VendorDTO {

    private String companyName;

    private String industry;

    private String address;

    private String status;

    private String companyType;
    
    private Long userId;

}