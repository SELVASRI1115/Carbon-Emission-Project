package com.carbonaudit.carbonaudit.util;

public class EmissionCalculator {

    public static Double calculateEmission(
            Double activityData,
            Double emissionFactor) {

        return activityData * emissionFactor;
    }

}