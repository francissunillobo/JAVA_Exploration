package com.example.edumanager.controller;

import com.example.edumanager.dto.ApiResponse;
import com.example.edumanager.entity.Student;
import com.example.edumanager.service.StudentService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Student REST Controller.
 * 
 * Provides CRUD operations for Student entity.
 * 
 * Endpoints:
 * - GET    /api/students        - Get all students (public)
 * - GET    /api/students/{id}   - Get student by ID (public)
 * - GET    /api/students/search - Search students by name (public)
 * - POST   /api/students        - Create new student (authenticated)
 * - PUT    /api/students/{id}   - Update student (authenticated)
 * - DELETE /api/students/{id}   - Delete student (ADMIN only)
 */
@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StudentController {

    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    /**
     * Get all students.
     * Public endpoint - no authentication required.
     * 
     * Example: GET /api/students
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Student>>> getAllStudents() {
        logger.debug("Fetching all students");
        List<Student> students = studentService.findAll();
        return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully", students));
    }

    /**
     * Get student by ID.
     * Public endpoint - no authentication required.
     * 
     * Example: GET /api/students/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> getStudentById(@PathVariable Long id) {
        logger.debug("Fetching student with id: {}", id);
        return studentService.findById(id)
                .map(student -> ResponseEntity.ok(ApiResponse.success("Student found", student)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Student not found with id: " + id)));
    }

    /**
     * Search students by name.
     * Public endpoint - no authentication required.
     * 
     * Example: GET /api/students/search?name=John
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Student>>> searchStudents(
            @RequestParam String name) {
        logger.debug("Searching students with name containing: {}", name);
        List<Student> students = studentService.searchByName(name);
        return ResponseEntity.ok(ApiResponse.success("Search results", students));
    }

    /**
     * Create a new student.
     * Requires authentication (any logged-in user).
     * 
     * Example: POST /api/students
     * Headers: Authorization: Bearer <token>
     * Body: { "name": "John Doe", "email": "john@example.com", "phone": "123456789" }
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Student>> createStudent(
            @Valid @RequestBody Student student) {
        logger.info("Creating new student: {}", student.getName());
        
        // Check if email already exists
        if (studentService.existsByEmail(student.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("Email already exists: " + student.getEmail()));
        }
        
        Student savedStudent = studentService.save(student);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student created successfully", savedStudent));
    }

    /**
     * Update an existing student.
     * Requires authentication (any logged-in user).
     * 
     * Example: PUT /api/students/1
     * Headers: Authorization: Bearer <token>
     * Body: { "name": "John Updated", "email": "john.updated@example.com", "phone": "987654321" }
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody Student studentDetails) {
        logger.info("Updating student with id: {}", id);
        
        return studentService.update(id, studentDetails)
                .map(student -> ResponseEntity.ok(
                        ApiResponse.success("Student updated successfully", student)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Student not found with id: " + id)));
    }

    /**
     * Delete a student.
     * Requires ADMIN role.
     * 
     * Example: DELETE /api/students/1
     * Headers: Authorization: Bearer <token>  (must be admin token)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")  // Additional security check via annotation
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        logger.info("Deleting student with id: {}", id);
        
        if (studentService.findById(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Student not found with id: " + id));
        }
        
        studentService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully", null));
    }
}

