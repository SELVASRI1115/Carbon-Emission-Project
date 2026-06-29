package com.carbonaudit.carbonaudit.serviceImpl;

import com.carbonaudit.carbonaudit.dto.NotificationDTO;
import com.carbonaudit.carbonaudit.entity.Notification;
import com.carbonaudit.carbonaudit.entity.User;
import com.carbonaudit.carbonaudit.repository.NotificationRepository;
import com.carbonaudit.carbonaudit.repository.UserRepository;
import com.carbonaudit.carbonaudit.service.NotificationService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl
        implements NotificationService {

    private final NotificationRepository notificationRepository;

    private final UserRepository userRepository;

    @Override
    public Object addNotification(
            NotificationDTO dto) {

        User user = userRepository
                .findById(dto.getUserId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));

        Notification notification =
                new Notification();

        notification.setUser(user);

        notification.setMessage(
                dto.getMessage());

        notification.setStatus(
                dto.getStatus());

        return notificationRepository
                .save(notification);
    }

    @Override
    public Object getAllNotifications() {

        return notificationRepository.findAll();
    }

    @Override
    public Object markAsRead(Long id) {

        Notification notification =
                notificationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Notification not found"));

        notification.setStatus("READ");

        return notificationRepository.save(
                notification);
    }

    @Override
    public void deleteNotification(
            Long id) {

        notificationRepository.deleteById(id);
    }
}