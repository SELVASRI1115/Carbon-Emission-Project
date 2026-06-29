package com.carbonaudit.carbonaudit.repository;

import com.carbonaudit.carbonaudit.entity.EmissionCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmissionCategoryRepository 
        extends JpaRepository<EmissionCategory, Long> {

    Optional<EmissionCategory> findByCategoryName(String categoryName);

}