package com.carbonaudit.carbonaudit.serviceImpl;

import com.carbonaudit.carbonaudit.dto.LoginRequestDTO;
import com.carbonaudit.carbonaudit.dto.RegisterRequestDTO;
import com.carbonaudit.carbonaudit.entity.User;
import com.carbonaudit.carbonaudit.entity.Vendor;
import com.carbonaudit.carbonaudit.entity.Role;
import com.carbonaudit.carbonaudit.exception.InvalidCredentialsException;
import com.carbonaudit.carbonaudit.exception.UserAlreadyExistsException;
import com.carbonaudit.carbonaudit.repository.UserRepository;
import com.carbonaudit.carbonaudit.repository.VendorRepository;
import com.carbonaudit.carbonaudit.security.JwtService;
import com.carbonaudit.carbonaudit.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final VendorRepository vendorRepository;

    @Override
    public Object register(RegisterRequestDTO request) {

        if(userRepository.findByEmail(
                request.getEmail()).isPresent()) {

            throw new UserAlreadyExistsException(
                    "Email already exists");
        }

        User user=new User();

        user.setName(
                request.getName());

        user.setEmail(
                request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setRole(
                request.getRole());

        User savedUser = userRepository.save(user);

        if (savedUser.getRole() == Role.VENDOR) {
            Vendor vendor = new Vendor();
            vendor.setCompanyName(savedUser.getName() + " Ltd");
            vendor.setIndustry("General");
            vendor.setAddress("Unspecified");
            vendor.setStatus("ACTIVE");
            vendor.setCompanyType("SUPPLIER");
            vendor.setUser(savedUser);
            vendorRepository.save(vendor);
        }

        return "User Registered Successfully";
    }

   @Override
public Object login(LoginRequestDTO request) {

    User user = userRepository
            .findByEmail(request.getEmail())
            .orElseThrow(() ->
                    new InvalidCredentialsException(
                            "Invalid Email"));

    if (!passwordEncoder.matches(
            request.getPassword(),
            user.getPassword())) {

        throw new InvalidCredentialsException(
                "Invalid Password");
    }

    String token =
            jwtService.generateToken(
                    user.getEmail());

    Long vendorId = null;
    if (user.getRole() == Role.VENDOR) {
        Vendor vendor = vendorRepository.findByUser(user)
                .orElseGet(() -> {
                    Vendor newVendor = new Vendor();
                    newVendor.setCompanyName(user.getName() + " Ltd");
                    newVendor.setIndustry("General");
                    newVendor.setAddress("Unspecified");
                    newVendor.setStatus("ACTIVE");
                    newVendor.setCompanyType("SUPPLIER");
                    newVendor.setUser(user);
                    return vendorRepository.save(newVendor);
                });
        vendorId = vendor.getVendorId();
    }

    java.util.Map<String, Object> responseMap = new java.util.HashMap<>();
    responseMap.put("token", token);
    responseMap.put("id", user.getId());
    responseMap.put("name", user.getName());
    responseMap.put("email", user.getEmail());
    responseMap.put("role", user.getRole().name());
    if (vendorId != null) {
        responseMap.put("vendorId", vendorId);
    }
    return responseMap;
}
}