package com.example.edumanager.security;

import com.example.edumanager.entity.User;
import com.example.edumanager.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Data initializer that creates default users on application startup.
 * 
 * Creates two demo users:
 * 1. admin/admin - with ROLE_ADMIN (can do everything including delete)
 * 2. user/user - with ROLE_USER (can view and create, but not delete)
 * 
 * This is for demo purposes only. In production, use proper user management.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Create admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRoles(Set.of("ROLE_ADMIN", "ROLE_USER"));
            admin.setEnabled(true);
            userRepository.save(admin);
            logger.info("Created default admin user: admin/admin");
        }

        // Create regular user if not exists
        if (!userRepository.existsByUsername("user")) {
            User user = new User();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user"));
            user.setRoles(Set.of("ROLE_USER"));
            user.setEnabled(true);
            userRepository.save(user);
            logger.info("Created default regular user: user/user");
        }

        logger.info("===========================================");
        logger.info("Demo users available:");
        logger.info("  Admin: username=admin, password=admin");
        logger.info("  User:  username=user, password=user");
        logger.info("===========================================");
    }
}

