package com.carbonaudit.carbonaudit.serviceImpl;

import com.carbonaudit.carbonaudit.dto.VendorDTO;
import com.carbonaudit.carbonaudit.entity.User;
import com.carbonaudit.carbonaudit.entity.Vendor;
import com.carbonaudit.carbonaudit.entity.Emission;
import com.carbonaudit.carbonaudit.repository.UserRepository;
import com.carbonaudit.carbonaudit.repository.VendorRepository;
import com.carbonaudit.carbonaudit.repository.EmissionRepository;
import com.carbonaudit.carbonaudit.service.VendorService;
import java.util.List;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VendorServiceImpl implements VendorService {

    private final VendorRepository vendorRepository;

    private final UserRepository userRepository;

    private final EmissionRepository emissionRepository;

    @Override
    public Object addVendor(VendorDTO vendorDTO) {

        User user = userRepository
                .findById(vendorDTO.getUserId())
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        ));

        Vendor vendor = new Vendor();

        vendor.setCompanyName(
                vendorDTO.getCompanyName());

        vendor.setIndustry(
                vendorDTO.getIndustry());

        vendor.setAddress(
                vendorDTO.getAddress());

        vendor.setStatus(
                vendorDTO.getStatus());

        vendor.setCompanyType(
                vendorDTO.getCompanyType());

        vendor.setUser(user);

        return vendorRepository.save(vendor);
    }

    @Override
    public Object getAllVendors() {
        List<Vendor> vendors = vendorRepository.findAll();
        for (Vendor vendor : vendors) {
            double total = 0.0;
            List<Emission> emissions = null;
            if ("CUSTOMER".equalsIgnoreCase(vendor.getCompanyType())) {
                emissions = emissionRepository.findByBuyer_VendorId(vendor.getVendorId());
            } else {
                emissions = emissionRepository.findByVendor_VendorId(vendor.getVendorId());
            }
            if (emissions != null) {
                for (Emission e : emissions) {
                    if (e.getTotalEmission() != null) {
                        total += e.getTotalEmission();
                    }
                }
            }
            vendor.setTotalCarbonEmission(total);
        }
        return vendors;
    }

    @Override
    public Object getVendorById(Long id) {
        Vendor vendor = vendorRepository.findById(id).orElse(null);
        if (vendor != null) {
            double total = 0.0;
            List<Emission> emissions = null;
            if ("CUSTOMER".equalsIgnoreCase(vendor.getCompanyType())) {
                emissions = emissionRepository.findByBuyer_VendorId(vendor.getVendorId());
            } else {
                emissions = emissionRepository.findByVendor_VendorId(vendor.getVendorId());
            }
            if (emissions != null) {
                for (Emission e : emissions) {
                    if (e.getTotalEmission() != null) {
                        total += e.getTotalEmission();
                    }
                }
            }
            vendor.setTotalCarbonEmission(total);
        }
        return java.util.Optional.ofNullable(vendor);
    }

 @Override
public Object updateVendor(
        Long id,
        VendorDTO vendorDTO) {

    Vendor vendor =
            vendorRepository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Vendor Not Found"));

    User user =
            userRepository.findById(
                    vendorDTO.getUserId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "User Not Found"));

    vendor.setCompanyName(
            vendorDTO.getCompanyName());

    vendor.setIndustry(
            vendorDTO.getIndustry());

    vendor.setAddress(
            vendorDTO.getAddress());

    vendor.setStatus(
            vendorDTO.getStatus());

    vendor.setUser(user);

    return vendorRepository.save(
            vendor);
}

    @Override
    public void deleteVendor(Long id) {

        vendorRepository.deleteById(id);
    }
}