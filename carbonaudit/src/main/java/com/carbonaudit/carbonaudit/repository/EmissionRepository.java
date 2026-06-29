package com.carbonaudit.carbonaudit.repository;

import com.carbonaudit.carbonaudit.entity.Emission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmissionRepository extends JpaRepository<Emission,Long> {

    List<Emission> findByStatus(String status);

    List<Emission> findByVendor_VendorId(Long vendorId);

    List<Emission> findByBuyer_VendorId(Long buyerId);
}