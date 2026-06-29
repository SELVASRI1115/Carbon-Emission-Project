package com.carbonaudit.carbonaudit.serviceImpl;
import com.carbonaudit.carbonaudit.entity.User;
import com.carbonaudit.carbonaudit.repository.UserRepository;
import com.carbonaudit.carbonaudit.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class UserServiceImpl
        implements UserService {

    private final UserRepository userRepository;

    @Override
    public Object getAllUsers() {

        return userRepository.findAll();
    }

    @Override
    public Object getUserById(Long id) {

        return userRepository.findById(id);
    }

    @Override
    public Object updateUser(
            Long id,
            User updatedUser) {

        User user =
                userRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User Not Found"));

        user.setName(
                updatedUser.getName());

        user.setEmail(
                updatedUser.getEmail());

        user.setRole(
                updatedUser.getRole());

        return userRepository.save(
                user);
    }

    @Override
    public void deleteUser(Long id) {

        userRepository.deleteById(id);
    }
}