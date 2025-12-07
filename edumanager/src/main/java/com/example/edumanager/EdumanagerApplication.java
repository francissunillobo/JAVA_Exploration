package com.example.edumanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the EduManager Spring Boot application.
 * 
 * This is a demo Student Management REST API that demonstrates:
 * - RESTful API design
 * - Spring Data JPA for persistence
 * - JWT-based authentication
 * - Role-based authorization
 */
@SpringBootApplication
public class EdumanagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(EdumanagerApplication.class, args);
    }
}

