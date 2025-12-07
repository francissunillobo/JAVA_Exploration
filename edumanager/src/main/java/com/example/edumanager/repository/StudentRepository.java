package com.example.edumanager.repository;

import com.example.edumanager.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Student entity.
 * Spring Data JPA automatically provides CRUD operations.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    /**
     * Find a student by email address.
     */
    Optional<Student> findByEmail(String email);

    /**
     * Check if a student with the given email exists.
     */
    boolean existsByEmail(String email);

    /**
     * Find students whose name contains the given string (case-insensitive).
     */
    List<Student> findByNameContainingIgnoreCase(String name);
}

