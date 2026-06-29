package com.carbonaudit.carbonaudit.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

            .cors(cors -> {})

            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // Login/Register
                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()

                // Admin pages
                .requestMatchers(
                    "/api/dashboard/**",
                    "/api/users/**",
                    "/api/vendors/**"
                ).permitAll()

                // Vendor pages
                .requestMatchers(
                    "/api/emissions/my"
                ).permitAll()

                // Shared APIs
                .requestMatchers(
                    "/api/emissions/**",
                    "/api/categories/**",
                    "/api/reports/**"
                ).permitAll()

                // Audit
                .requestMatchers(
                    "/api/audit/**"
                ).permitAll()

                // Notifications
                .requestMatchers(
                    "/api/notifications/**"
                ).permitAll()

                .anyRequest()
                .authenticated()
            );

        return http.build();
    }
}