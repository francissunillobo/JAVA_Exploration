package com.example.edumanager.service;

import com.example.edumanager.entity.Student;
import com.example.edumanager.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service layer for Student business logic.
 * Handles all student-related operations.
 */
@Service
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    /**
     * Get all students.
     */
    @Transactional(readOnly = true)
    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    /**
     * Find a student by ID.
     */
    @Transactional(readOnly = true)
    public Optional<Student> findById(Long id) {
        return studentRepository.findById(id);
    }

    /**
     * Find a student by email.
     */
    @Transactional(readOnly = true)
    public Optional<Student> findByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    /**
     * Search students by name.
     */
    @Transactional(readOnly = true)
    public List<Student> searchByName(String name) {
        return studentRepository.findByNameContainingIgnoreCase(name);
    }

    /**
     * Create or update a student.
     */
    public Student save(Student student) {
        return studentRepository.save(student);
    }

    /**
     * Update an existing student.
     */
    public Optional<Student> update(Long id, Student studentDetails) {
        return studentRepository.findById(id)
                .map(existingStudent -> {
                    existingStudent.setName(studentDetails.getName());
                    existingStudent.setEmail(studentDetails.getEmail());
                    existingStudent.setPhone(studentDetails.getPhone());
                    return studentRepository.save(existingStudent);
                });
    }

    /**
     * Delete a student by ID.
     */
    public void deleteById(Long id) {
        studentRepository.deleteById(id);
    }

    /**
     * Check if a student with the given email exists.
     */
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return studentRepository.existsByEmail(email);
    }
}

