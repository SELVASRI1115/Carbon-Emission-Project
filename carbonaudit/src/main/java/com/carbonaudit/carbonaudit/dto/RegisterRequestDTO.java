package com.carbonaudit.carbonaudit.dto;

import com.carbonaudit.carbonaudit.entity.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {

    private String name;

    private String email;

    private String password;

    private Role role;

}