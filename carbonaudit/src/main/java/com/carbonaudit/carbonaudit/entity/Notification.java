package com.carbonaudit.carbonaudit.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long notificationId;

    private String message;

    private String status;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;
}