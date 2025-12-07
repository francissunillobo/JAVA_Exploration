# EduManager - Student Management REST API

A simple Spring Boot demo project demonstrating REST APIs, JWT authentication, and PostgreSQL persistence.

## 🚀 Features

- **RESTful API** for Student CRUD operations
- **JWT Authentication** with role-based authorization
- **Spring Data JPA** for database persistence
- **PostgreSQL** database (with H2 fallback for development)
- **Input Validation** using Jakarta Validation
- **CORS Configuration** for frontend integration

## 📋 Prerequisites

- **Java 17** (JDK)
- **Maven** (or use included wrapper `mvnw`)
- **Docker** (for PostgreSQL) OR use H2 in-memory database
- **Postman** or **cURL** for testing APIs

## 🏃 Quick Start

### Option 1: With PostgreSQL (Docker)

```bash
# 1. Start PostgreSQL with Docker
docker run --name edupg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=edudb -p 5432:5432 -d postgres

# 2. Navigate to project directory
cd edumanager

# 3. Build and run
./mvnw spring-boot:run
```

### Option 2: With H2 In-Memory Database (No Docker needed)

```bash
# Navigate to project directory
cd edumanager

# Run with H2 profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2

# H2 Console available at: http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:edudb
# Username: sa, Password: (empty)
```

## 👤 Default Users

On startup, the application creates two demo users:

| Username | Password | Roles                 | Permissions                      |
| -------- | -------- | --------------------- | -------------------------------- |
| `admin`  | `admin`  | ROLE_ADMIN, ROLE_USER | Full access (including delete)   |
| `user`   | `user`   | ROLE_USER             | View, Create, Update (no delete) |

## 🔐 API Endpoints

### Authentication

| Method | Endpoint          | Description             | Auth Required |
| ------ | ----------------- | ----------------------- | ------------- |
| POST   | `/api/auth/login` | Login and get JWT token | No            |
| GET    | `/api/auth/me`    | Get current user info   | Yes           |

### Students

| Method | Endpoint                     | Description       | Auth Required    |
| ------ | ---------------------------- | ----------------- | ---------------- |
| GET    | `/api/students`              | Get all students  | No               |
| GET    | `/api/students/{id}`         | Get student by ID | No               |
| GET    | `/api/students/search?name=` | Search by name    | No               |
| POST   | `/api/students`              | Create student    | Yes (any user)   |
| PUT    | `/api/students/{id}`         | Update student    | Yes (any user)   |
| DELETE | `/api/students/{id}`         | Delete student    | Yes (ADMIN only) |

## 📝 API Examples (cURL)

### 1. Login (Get JWT Token)

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "username": "admin",
  "roles": ["ROLE_ADMIN", "ROLE_USER"]
}
```

### 2. Get All Students (Public)

```bash
curl http://localhost:8080/api/students
```

### 3. Create Student (Requires Auth)

```bash
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123456789"
  }'
```

### 4. Update Student

```bash
curl -X PUT http://localhost:8080/api/students/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Updated",
    "email": "john.updated@example.com",
    "phone": "987654321"
  }'
```

### 5. Delete Student (Admin Only)

```bash
curl -X DELETE http://localhost:8080/api/students/1 \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## 📁 Project Structure

```
edumanager/
├── src/main/java/com/example/edumanager/
│   ├── EdumanagerApplication.java      # Main entry point
│   ├── controller/
│   │   ├── AuthController.java         # Login endpoint
│   │   └── StudentController.java      # Student CRUD
│   ├── dto/
│   │   ├── ApiResponse.java            # Generic response wrapper
│   │   ├── LoginRequest.java           # Login request body
│   │   └── LoginResponse.java          # Login response with token
│   ├── entity/
│   │   ├── Student.java                # Student JPA entity
│   │   └── User.java                   # User JPA entity
│   ├── exception/
│   │   └── GlobalExceptionHandler.java # Error handling
│   ├── repository/
│   │   ├── StudentRepository.java      # Student data access
│   │   └── UserRepository.java         # User data access
│   ├── security/
│   │   ├── CustomUserDetailsService.java # Load user for auth
│   │   ├── DataInitializer.java        # Create default users
│   │   ├── JwtAuthFilter.java          # JWT request filter
│   │   ├── JwtUtils.java               # JWT token utilities
│   │   └── SecurityConfig.java         # Security configuration
│   └── service/
│       └── StudentService.java         # Business logic
├── src/main/resources/
│   ├── application.yml                 # Main config (PostgreSQL)
│   └── application-h2.yml              # H2 profile config
└── pom.xml                             # Maven dependencies
```

## 🔑 Key Concepts Explained

### JWT Authentication Flow

1. **Login**: User sends credentials to `/api/auth/login`
2. **Token Generation**: Server validates credentials and returns JWT token
3. **Authenticated Requests**: Client includes token in `Authorization: Bearer <token>` header
4. **Token Validation**: `JwtAuthFilter` intercepts requests, validates token, sets authentication

### Security Configuration

- **Public Endpoints**: `/api/auth/**`, GET `/api/students/**`
- **Authenticated**: POST/PUT `/api/students/**`
- **Admin Only**: DELETE `/api/students/**`

### Spring Data JPA

- Entities annotated with `@Entity` map to database tables
- Repositories extend `JpaRepository` for automatic CRUD operations
- Custom queries defined by method naming convention (e.g., `findByEmail`)

## 🔄 Next Steps

1. **Add Angular Frontend**: Create an Angular app that calls these APIs
2. **Add More Entities**: Course, Teacher, Enrollment
3. **Add Flyway Migrations**: Version control your database schema
4. **Add File Upload**: Store student photos using MinIO
5. **Add Pagination**: Use `Pageable` for large datasets
6. **Add Swagger/OpenAPI**: Auto-generate API documentation

## 🛠️ Configuration

### application.yml

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/edudb
    username: postgres
    password: postgres

jwt:
  secret: mySecretKeyForJwtTokenGenerationMustBeLongEnough256Bits!!
  expiration-ms: 86400000 # 24 hours
```

## 📞 Support

This is a learning project. Feel free to experiment and break things!
