package com.carbonaudit.carbonaudit.service;

import com.carbonaudit.carbonaudit.dto.VendorDTO;

public interface VendorService {

    Object addVendor(VendorDTO vendorDTO);

    Object getAllVendors();

    Object getVendorById(Long id);

    Object updateVendor(Long id, VendorDTO vendorDTO);

    void deleteVendor(Long id);

}