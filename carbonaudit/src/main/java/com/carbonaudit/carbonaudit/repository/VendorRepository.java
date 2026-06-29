package com.carbonaudit.carbonaudit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.carbonaudit.carbonaudit.entity.Vendor;
import com.carbonaudit.carbonaudit.entity.User;
import java.util.Optional;

public interface VendorRepository
extends JpaRepository<Vendor, Long> {
    Optional<Vendor> findByUser(User user);
}