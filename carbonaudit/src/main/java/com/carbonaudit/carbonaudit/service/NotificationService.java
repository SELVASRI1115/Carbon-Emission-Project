package com.carbonaudit.carbonaudit.service;

import com.carbonaudit.carbonaudit.dto.NotificationDTO;

public interface NotificationService {

    Object addNotification(NotificationDTO dto);

    Object getAllNotifications();

    Object markAsRead(Long id);

    void deleteNotification(Long id);
}