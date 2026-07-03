package com.carbonaudit.carbonaudit.scheduler;

import com.carbonaudit.carbonaudit.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
@RequiredArgsConstructor
public class ReportScheduler {

    private static final Logger logger = Logger.getLogger(ReportScheduler.class.getName());
    private final ReportService reportService;

    // Run at 00:00:00 on the 1st day of every month
    @Scheduled(cron = "0 0 0 1 * ?")
    public void generateMonthlyReports() {
        logger.info("Starting scheduled monthly report generation...");
        try {
            reportService.generateMonthlyReports(null);
            logger.info("Scheduled monthly report generation completed successfully.");
        } catch (Exception e) {
            logger.severe("Error during scheduled monthly report generation: " + e.getMessage());
        }
    }
}
