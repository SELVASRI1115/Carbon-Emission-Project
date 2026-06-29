package com.carbonaudit.carbonaudit.repository;

import com.carbonaudit.carbonaudit.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report,Long> {

}