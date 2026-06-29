package com.carbonaudit.carbonaudit.serviceImpl;

import com.carbonaudit.carbonaudit.dto.ReportDTO;
import com.carbonaudit.carbonaudit.entity.Report;
import com.carbonaudit.carbonaudit.entity.Vendor;
import com.carbonaudit.carbonaudit.entity.Emission;
import com.carbonaudit.carbonaudit.repository.ReportRepository;
import com.carbonaudit.carbonaudit.repository.VendorRepository;
import com.carbonaudit.carbonaudit.repository.EmissionRepository;
import com.carbonaudit.carbonaudit.service.ReportService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ContentDisposition;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.awt.Color;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;
    private final VendorRepository vendorRepository;
    private final EmissionRepository emissionRepository;

    @Override
    public Object getAllReports() {
        return reportRepository.findAll();
    }

    @Override
    public Object generateReport(ReportDTO reportDTO) {
        Vendor vendor = vendorRepository
                .findById(reportDTO.getVendorId())
                .orElseThrow(() ->
                        new RuntimeException("Vendor Not Found"));

        Report report = new Report();
        report.setReportName(reportDTO.getReportName());
        report.setReportType(reportDTO.getReportType());
        report.setFilePath(reportDTO.getFilePath());
        report.setGeneratedDate(LocalDateTime.now());
        report.setVendor(vendor);

        return reportRepository.save(report);
    }

    @Override
    public ResponseEntity<byte[]> downloadReport(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        byte[] pdfBytes = generatePdfReport(report);
        String filename = report.getReportName().replaceAll("[^a-zA-Z0-9-_\\.]", "_") + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(filename).build().toString())
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @Override
    public ResponseEntity<byte[]> viewReport(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        byte[] pdfBytes = generatePdfReport(report);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.inline().build().toString())
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    private byte[] generatePdfReport(Report report) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document(PageSize.A4, 36, 36, 54, 36);
            PdfWriter.getInstance(document, baos);
            document.open();

            // Font styles
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, Color.WHITE);
            Font sectionTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, new Color(46, 125, 50));
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 9, new Color(33, 33, 33));
            Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, new Color(33, 33, 33));
            Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 8, new Color(117, 117, 117));

            // Main Title Banner
            PdfPTable headerTable = new PdfPTable(1);
            headerTable.setWidthPercentage(100);
            PdfPCell headerCell = new PdfPCell(new Phrase("CARBON AUDIT & EMISSION REPORT", titleFont));
            headerCell.setBackgroundColor(new Color(46, 125, 50)); // Forest Green
            headerCell.setPadding(15);
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            headerCell.setBorder(Rectangle.NO_BORDER);
            headerTable.addCell(headerCell);
            document.add(headerTable);

            document.add(new Paragraph(" ")); // Spacer

            // Report Meta Information Table
            PdfPTable metaTable = new PdfPTable(2);
            metaTable.setWidthPercentage(100);
            metaTable.setWidths(new float[]{1.0f, 2.0f});

            addMetaRow(metaTable, "Report Name:", report.getReportName(), boldFont, normalFont);
            addMetaRow(metaTable, "Report Type:", report.getReportType(), boldFont, normalFont);
            addMetaRow(metaTable, "Generated Date:", report.getGeneratedDate() != null ? report.getGeneratedDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm")) : "", boldFont, normalFont);
            
            Vendor vendor = report.getVendor();
            if (vendor != null) {
                addMetaRow(metaTable, "Company Name:", vendor.getCompanyName(), boldFont, normalFont);
                addMetaRow(metaTable, "Industry Type:", vendor.getIndustry(), boldFont, normalFont);
                addMetaRow(metaTable, "Address:", vendor.getAddress(), boldFont, normalFont);
            }
            document.add(metaTable);

            document.add(new Paragraph(" ")); // Spacer

            // Emissions Statistics Summary Cards
            List<Emission> emissions = emissionRepository.findByVendor_VendorId(vendor != null ? vendor.getVendorId() : 0L);
            double totalEmissions = 0;
            double approvedEmissions = 0;
            double pendingEmissions = 0;
            int totalRecords = emissions.size();
            
            for (Emission e : emissions) {
                double val = e.getTotalEmission() != null ? e.getTotalEmission() : 0.0;
                totalEmissions += val;
                if ("APPROVED".equalsIgnoreCase(e.getStatus())) {
                    approvedEmissions += val;
                } else if ("PENDING".equalsIgnoreCase(e.getStatus())) {
                    pendingEmissions += val;
                }
            }

            Paragraph statsTitle = new Paragraph("EMISSIONS SUMMARY SUMMARY", sectionTitleFont);
            statsTitle.setSpacingAfter(8);
            document.add(statsTitle);

            PdfPTable statsTable = new PdfPTable(4);
            statsTable.setWidthPercentage(100);
            statsTable.setSpacingAfter(12);
            
            addStatCell(statsTable, "Total Footprint", String.format("%.2f tCO2e", totalEmissions), new Color(46, 125, 50));
            addStatCell(statsTable, "Approved Emissions", String.format("%.2f tCO2e", approvedEmissions), new Color(21, 101, 192));
            addStatCell(statsTable, "Pending Audit", String.format("%.2f tCO2e", pendingEmissions), new Color(239, 108, 0));
            addStatCell(statsTable, "Total Filings", String.valueOf(totalRecords), new Color(55, 71, 79));
            document.add(statsTable);

            // Table of Detailed Emissions
            Paragraph detailsTitle = new Paragraph("DETAILED EMISSIONS LOG", sectionTitleFont);
            detailsTitle.setSpacingAfter(8);
            document.add(detailsTitle);

            PdfPTable detailsTable = new PdfPTable(6);
            detailsTable.setWidthPercentage(100);
            detailsTable.setWidths(new float[]{1.5f, 1.2f, 1.2f, 1.2f, 1.2f, 1.2f});

            // Headers
            String[] headers = {"Category", "Month", "Activity Data", "Emission Factor", "Total (tCO2e)", "Status"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
                cell.setBackgroundColor(new Color(46, 125, 50));
                cell.setPadding(6);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                detailsTable.addCell(cell);
            }

            for (Emission e : emissions) {
                // Category
                String catName = e.getCategory() != null ? e.getCategory().getCategoryName() : "N/A";
                PdfPCell c1 = new PdfPCell(new Phrase(catName, normalFont));
                c1.setPadding(5);
                detailsTable.addCell(c1);

                // Month
                PdfPCell c2 = new PdfPCell(new Phrase(e.getReportingMonth(), normalFont));
                c2.setPadding(5);
                c2.setHorizontalAlignment(Element.ALIGN_CENTER);
                detailsTable.addCell(c2);

                // Activity Data
                PdfPCell c3 = new PdfPCell(new Phrase(e.getActivityData() != null ? String.valueOf(e.getActivityData()) : "0", normalFont));
                c3.setPadding(5);
                c3.setHorizontalAlignment(Element.ALIGN_RIGHT);
                detailsTable.addCell(c3);

                // Emission Factor
                PdfPCell c4 = new PdfPCell(new Phrase(e.getEmissionFactor() != null ? String.valueOf(e.getEmissionFactor()) : "0", normalFont));
                c4.setPadding(5);
                c4.setHorizontalAlignment(Element.ALIGN_RIGHT);
                detailsTable.addCell(c4);

                // Total
                PdfPCell c5 = new PdfPCell(new Phrase(e.getTotalEmission() != null ? String.format("%.2f", e.getTotalEmission()) : "0.00", boldFont));
                c5.setPadding(5);
                c5.setHorizontalAlignment(Element.ALIGN_RIGHT);
                detailsTable.addCell(c5);

                // Status
                String stat = e.getStatus() != null ? e.getStatus() : "PENDING";
                PdfPCell c6 = new PdfPCell(new Phrase(stat, boldFont));
                c6.setPadding(5);
                c6.setHorizontalAlignment(Element.ALIGN_CENTER);
                if ("APPROVED".equalsIgnoreCase(stat)) {
                    c6.setBackgroundColor(new Color(232, 245, 233)); // Very light green
                } else if ("REJECTED".equalsIgnoreCase(stat)) {
                    c6.setBackgroundColor(new Color(255, 235, 235)); // Very light red
                } else {
                    c6.setBackgroundColor(new Color(255, 243, 224)); // Very light orange
                }
                detailsTable.addCell(c6);
            }

            document.add(detailsTable);

            // Document Footer Notice
            document.add(new Paragraph(" "));
            Paragraph footerNote = new Paragraph("This is an automatically generated environmental report compiled from vendor disclosures and independent audit verifications.", smallFont);
            footerNote.setAlignment(Element.ALIGN_CENTER);
            document.add(footerNote);

            document.close();
            return baos.toByteArray();
        } catch (Exception ex) {
            throw new RuntimeException("Error generating PDF: " + ex.getMessage(), ex);
        }
    }

    private void addMetaRow(PdfPTable table, String label, String value, Font labelFont, Font valFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setBorder(Rectangle.BOTTOM);
        labelCell.setBorderColor(new Color(224, 224, 224));
        labelCell.setPadding(5);
        table.addCell(labelCell);

        PdfPCell valCell = new PdfPCell(new Phrase(value != null ? value : "", valFont));
        valCell.setBorder(Rectangle.BOTTOM);
        valCell.setBorderColor(new Color(224, 224, 224));
        valCell.setPadding(5);
        table.addCell(valCell);
    }

    private void addStatCell(PdfPTable table, String title, String value, Color color) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(new Color(244, 246, 248));
        cell.setPadding(6);
        cell.setBorderWidth(1);
        cell.setBorderColor(new Color(224, 224, 224));
        
        Paragraph pTitle = new Paragraph(title, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 7, new Color(117, 117, 117)));
        pTitle.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(pTitle);

        Paragraph pVal = new Paragraph(value, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, color));
        pVal.setAlignment(Element.ALIGN_CENTER);
        pVal.setSpacingBefore(3);
        cell.addElement(pVal);

        table.addCell(cell);
    }
}