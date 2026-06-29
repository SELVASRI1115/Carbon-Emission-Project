package com.carbonaudit.carbonaudit.service;

import com.carbonaudit.carbonaudit.dto.LoginRequestDTO;
import com.carbonaudit.carbonaudit.dto.RegisterRequestDTO;

public interface AuthService {

    Object register(RegisterRequestDTO request);

    Object login(LoginRequestDTO request);

}