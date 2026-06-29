package com.carbonaudit.carbonaudit.util;

public class ReportGenerator {

    public static String generateReportName(
            String companyName){

        return companyName
                +"_Carbon_Report.pdf";
    }

}