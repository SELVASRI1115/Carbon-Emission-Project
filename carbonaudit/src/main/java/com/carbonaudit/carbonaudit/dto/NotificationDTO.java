package com.carbonaudit.carbonaudit.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private Long userId;

    private String message;

    private String status;

}
