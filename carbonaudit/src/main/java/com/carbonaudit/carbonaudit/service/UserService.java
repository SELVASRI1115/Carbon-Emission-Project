package com.carbonaudit.carbonaudit.service;
import com.carbonaudit.carbonaudit.entity.User;

public interface UserService {

    Object getAllUsers();

    Object getUserById(Long id);

    Object updateUser(Long id, User user);

    void deleteUser(Long id);
}
