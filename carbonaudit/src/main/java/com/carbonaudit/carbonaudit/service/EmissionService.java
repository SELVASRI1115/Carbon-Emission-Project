package com.carbonaudit.carbonaudit.service;

import com.carbonaudit.carbonaudit.dto.EmissionDTO;


public interface EmissionService {

    Object addEmission(EmissionDTO emissionDTO);

    Object getAllEmissions();

    Object getEmissionById(Long id);

    Object updateEmission(Long id,
                          EmissionDTO emissionDTO);

    void deleteEmission(Long id);

    Object getMyEmissions();

}