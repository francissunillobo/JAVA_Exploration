# EduManager - Architecture & Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Class Diagram](#class-diagram)
3. [Sequence Diagrams](#sequence-diagrams)
4. [Execution Steps](#execution-steps)
5. [API Reference](#api-reference)

---

## Project Overview

EduManager is a full-stack Student Management System with:
- **Backend**: Spring Boot 3.2 REST API with JWT Authentication
- **Frontend**: Angular 17 Single Page Application
- **Database**: H2 (in-memory) or PostgreSQL

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 17, TypeScript, TailwindCSS |
| Backend | Spring Boot 3.2, Spring Security, Spring Data JPA |
| Authentication | JWT (JSON Web Tokens) |
| Database | H2 (dev) / PostgreSQL (prod) |
| Build Tools | Maven (backend), npm (frontend) |

---

## Class Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              EDUMANAGER CLASS DIAGRAM                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   ENTITIES                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────┐          ┌─────────────────────────────┐           │
│  │       <<Entity>>        │          │         <<Entity>>          │           │
│  │        Student          │          │           User              │           │
│  ├─────────────────────────┤          ├─────────────────────────────┤           │
│  │ - id: Long              │          │ - id: Long                  │           │
│  │ - name: String          │          │ - username: String          │           │
│  │ - email: String         │          │ - password: String          │           │
│  │ - phone: String         │          │ - roles: Set<String>        │           │
│  ├─────────────────────────┤          │ - enabled: boolean          │           │
│  │ + getId(): Long         │          ├─────────────────────────────┤           │
│  │ + getName(): String     │          │ + getId(): Long             │           │
│  │ + getEmail(): String    │          │ + getUsername(): String     │           │
│  │ + getPhone(): String    │          │ + getPassword(): String     │           │
│  │ + setName(String)       │          │ + getRoles(): Set<String>   │           │
│  │ + setEmail(String)      │          │ + isEnabled(): boolean      │           │
│  │ + setPhone(String)      │          │ + setPassword(String)       │           │
│  └─────────────────────────┘          └─────────────────────────────┘           │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  REPOSITORIES                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────────────────────┐    ┌──────────────────────────────────┐   │
│  │      <<Interface>>               │    │       <<Interface>>              │   │
│  │    StudentRepository             │    │      UserRepository              │   │
│  │  extends JpaRepository           │    │   extends JpaRepository          │   │
│  ├──────────────────────────────────┤    ├──────────────────────────────────┤   │
│  │ + findByEmail(String)            │    │ + findByUsername(String)         │   │
│  │   : Optional<Student>            │    │   : Optional<User>               │   │
│  │ + findByNameContainingIgnoreCase │    │ + existsByUsername(String)       │   │
│  │   (String): List<Student>        │    │   : boolean                      │   │
│  │ + existsByEmail(String): boolean │    │                                  │   │
│  └──────────────────────────────────┘    └──────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   SERVICES                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────┐    ┌────────────────────────────────┐  │
│  │          <<Service>>                │    │        <<Service>>             │  │
│  │        StudentService               │    │  CustomUserDetailsService      │  │
│  ├─────────────────────────────────────┤    │  implements UserDetailsService │  │
│  │ - studentRepository                 │    ├────────────────────────────────┤  │
│  ├─────────────────────────────────────┤    │ - userRepository               │  │
│  │ + findAll(): List<Student>          │    ├────────────────────────────────┤  │
│  │ + findById(Long): Optional<Student> │    │ + loadUserByUsername(String)   │  │
│  │ + findByEmail(String): Optional     │    │   : UserDetails                │  │
│  │ + searchByName(String): List        │    └────────────────────────────────┘  │
│  │ + save(Student): Student            │                                        │
│  │ + update(Long, Student): Optional   │                                        │
│  │ + deleteById(Long): void            │                                        │
│  │ + existsByEmail(String): boolean    │                                        │
│  └─────────────────────────────────────┘                                        │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  CONTROLLERS                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────┐    ┌────────────────────────────────┐  │
│  │        <<RestController>>           │    │      <<RestController>>        │  │
│  │       StudentController             │    │       AuthController           │  │
│  │    /api/students                    │    │        /api/auth               │  │
│  ├─────────────────────────────────────┤    ├────────────────────────────────┤  │
│  │ - studentService                    │    │ - authenticationManager        │  │
│  ├─────────────────────────────────────┤    │ - jwtUtils                     │  │
│  │ + getAllStudents(): List<Student>   │    ├────────────────────────────────┤  │
│  │ + getStudentById(Long): Student     │    │ + login(LoginRequest)          │  │
│  │ + searchStudents(String): List      │    │   : LoginResponse              │  │
│  │ + createStudent(Student): Student   │    │ + getCurrentUser(): UserInfo   │  │
│  │ + updateStudent(Long, Student)      │    └────────────────────────────────┘  │
│  │ + deleteStudent(Long): void         │                                        │
│  └─────────────────────────────────────┘                                        │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   SECURITY                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────────────────┐    ┌────────────────────────────────────────┐ │
│  │       <<Component>>          │    │           <<Component>>                │ │
│  │         JwtUtils             │    │          JwtAuthFilter                 │ │
│  ├──────────────────────────────┤    │   extends OncePerRequestFilter         │ │
│  │ - jwtSecret: String          │    ├────────────────────────────────────────┤ │
│  │ - jwtExpirationMs: int       │    │ - jwtUtils                             │ │
│  ├──────────────────────────────┤    │ - userDetailsService                   │ │
│  │ + generateToken(Auth): String│    ├────────────────────────────────────────┤ │
│  │ + validateToken(String): bool│    │ + doFilterInternal(request, response,  │ │
│  │ + getUsernameFromToken(String│    │   filterChain): void                   │ │
│  │   ): String                  │    │ - parseJwt(request): String            │ │
│  └──────────────────────────────┘    └────────────────────────────────────────┘ │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                        <<Configuration>>                                 │    │
│  │                         SecurityConfig                                   │    │
│  ├─────────────────────────────────────────────────────────────────────────┤    │
│  │ + securityFilterChain(HttpSecurity): SecurityFilterChain                │    │
│  │ + authenticationManager(AuthenticationConfiguration): AuthenticationMgr │    │
│  │ + passwordEncoder(): PasswordEncoder                                    │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                     DTOs                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐  │
│  │    LoginRequest     │  │   LoginResponse     │  │     ApiResponse<T>      │  │
│  ├─────────────────────┤  ├─────────────────────┤  ├─────────────────────────┤  │
│  │ - username: String  │  │ - token: String     │  │ - success: boolean      │  │
│  │ - password: String  │  │ - type: String      │  │ - message: String       │  │
│  └─────────────────────┘  │ - username: String  │  │ - data: T               │  │
│                           │ - roles: Set<String>│  │ - timestamp: LocalDateTime│ │
│                           └─────────────────────┘  └─────────────────────────┘  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘


                            RELATIONSHIPS DIAGRAM
                            
    ┌──────────────────┐         ┌──────────────────┐
    │  AuthController  │────────▶│     JwtUtils     │
    └────────┬─────────┘         └──────────────────┘
             │                            ▲
             │                            │
             ▼                            │
    ┌──────────────────┐         ┌───────┴──────────┐
    │ Authentication   │         │   JwtAuthFilter  │
    │    Manager       │         └──────────────────┘
    └────────┬─────────┘                  │
             │                            │
             ▼                            ▼
    ┌──────────────────┐         ┌──────────────────┐
    │ CustomUserDetails│────────▶│  UserRepository  │────────▶ User
    │    Service       │         └──────────────────┘
    └──────────────────┘

    ┌──────────────────┐         ┌──────────────────┐
    │StudentController │────────▶│  StudentService  │────────▶ StudentRepository ──▶ Student
    └──────────────────┘         └──────────────────┘
```

---

## Sequence Diagrams

### 1. User Login Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           USER LOGIN SEQUENCE DIAGRAM                            │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌──────┐     ┌──────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐     ┌─────────┐
  │Client│     │AuthController│  │AuthManager   │     │UserDetails  │     │UserRepo  │     │JwtUtils │
  └──┬───┘     └─────┬────┘     └──────┬───────┘     │Service      │     └────┬─────┘     └────┬────┘
     │               │                 │              └──────┬──────┘          │                │
     │  POST /api/auth/login           │                     │                 │                │
     │  {username, password}           │                     │                 │                │
     │──────────────────────────────▶  │                     │                 │                │
     │               │                 │                     │                 │                │
     │               │  authenticate() │                     │                 │                │
     │               │────────────────▶│                     │                 │                │
     │               │                 │                     │                 │                │
     │               │                 │ loadUserByUsername()│                 │                │
     │               │                 │────────────────────▶│                 │                │
     │               │                 │                     │                 │                │
     │               │                 │                     │ findByUsername()│                │
     │               │                 │                     │────────────────▶│                │
     │               │                 │                     │                 │                │
     │               │                 │                     │   User entity   │                │
     │               │                 │                     │◀────────────────│                │
     │               │                 │                     │                 │                │
     │               │                 │    UserDetails      │                 │                │
     │               │                 │◀────────────────────│                 │                │
     │               │                 │                     │                 │                │
     │               │                 │  Validate password  │                 │                │
     │               │                 │  (BCrypt compare)   │                 │                │
     │               │                 │                     │                 │                │
     │               │  Authentication │                     │                 │                │
     │               │◀────────────────│                     │                 │                │
     │               │                 │                     │                 │                │
     │               │                 │                     │                 │  generateToken()
     │               │─────────────────────────────────────────────────────────────────────────▶│
     │               │                 │                     │                 │                │
     │               │                 │                     │                 │    JWT Token   │
     │               │◀─────────────────────────────────────────────────────────────────────────│
     │               │                 │                     │                 │                │
     │  LoginResponse│                 │                     │                 │                │
     │  {token, username, roles}       │                     │                 │                │
     │◀──────────────────────────────  │                     │                 │                │
     │               │                 │                     │                 │                │
  ┌──┴───┐     ┌─────┴────┐     ┌──────┴───────┐     ┌──────┴──────┐     ┌────┴─────┐     ┌────┴────┐
  │Client│     │AuthController│  │AuthManager   │     │UserDetails  │     │UserRepo  │     │JwtUtils │
  └──────┘     └──────────┘     └──────────────┘     │Service      │     └──────────┘     └─────────┘
                                                     └─────────────┘
```

### 2. JWT Authentication Filter Flow (Protected Request)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      JWT AUTHENTICATION FILTER SEQUENCE                          │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌──────┐     ┌─────────────┐     ┌─────────┐     ┌─────────────┐     ┌───────────────┐     ┌──────────┐
  │Client│     │JwtAuthFilter│     │JwtUtils │     │UserDetails  │     │SecurityContext│     │Controller│
  └──┬───┘     └──────┬──────┘     └────┬────┘     │Service      │     └───────┬───────┘     └────┬─────┘
     │                │                 │          └──────┬──────┘             │                  │
     │  HTTP Request  │                 │                 │                    │                  │
     │  Authorization: Bearer <JWT>     │                 │                    │                  │
     │───────────────▶│                 │                 │                    │                  │
     │                │                 │                 │                    │                  │
     │                │  parseJwt()     │                 │                    │                  │
     │                │  Extract token  │                 │                    │                  │
     │                │                 │                 │                    │                  │
     │                │ validateToken() │                 │                    │                  │
     │                │────────────────▶│                 │                    │                  │
     │                │                 │                 │                    │                  │
     │                │     true        │                 │                    │                  │
     │                │◀────────────────│                 │                    │                  │
     │                │                 │                 │                    │                  │
     │                │getUsernameFromToken()             │                    │                  │
     │                │────────────────▶│                 │                    │                  │
     │                │                 │                 │                    │                  │
     │                │   "admin"       │                 │                    │                  │
     │                │◀────────────────│                 │                    │                  │
     │                │                 │                 │                    │                  │
     │                │ loadUserByUsername("admin")       │                    │                  │
     │                │───────────────────────────────────▶                    │                  │
     │                │                 │                 │                    │                  │
     │                │   UserDetails   │                 │                    │                  │
     │                │◀───────────────────────────────────                    │                  │
     │                │                 │                 │                    │                  │
     │                │ setAuthentication(auth)           │                    │                  │
     │                │─────────────────────────────────────────────────────────▶                 │
     │                │                 │                 │                    │                  │
     │                │                 │                 │                    │                  │
     │                │ filterChain.doFilter() ───────────────────────────────────────────────────▶
     │                │                 │                 │                    │                  │
     │                │                 │                 │                    │   Process       │
     │                │                 │                 │                    │   Request       │
     │                │                 │                 │                    │                  │
     │  HTTP Response │                 │                 │                    │                  │
     │◀───────────────────────────────────────────────────────────────────────────────────────────│
     │                │                 │                 │                    │                  │
  ┌──┴───┐     ┌──────┴──────┐     ┌────┴────┐     ┌──────┴──────┐     ┌───────┴───────┐     ┌────┴─────┐
  │Client│     │JwtAuthFilter│     │JwtUtils │     │UserDetails  │     │SecurityContext│     │Controller│
  └──────┘     └─────────────┘     └─────────┘     │Service      │     └───────────────┘     └──────────┘
                                                   └─────────────┘
```

### 3. Create Student Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         CREATE STUDENT SEQUENCE DIAGRAM                          │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌──────┐     ┌─────────────┐     ┌──────────────────┐     ┌──────────────┐     ┌───────────────┐     ┌────────┐
  │Client│     │JwtAuthFilter│     │StudentController │     │StudentService│     │StudentRepository│   │Database│
  └──┬───┘     └──────┬──────┘     └────────┬─────────┘     └──────┬───────┘     └───────┬───────┘     └───┬────┘
     │                │                     │                      │                     │                 │
     │  POST /api/students                  │                      │                     │                 │
     │  Authorization: Bearer <JWT>         │                      │                     │                 │
     │  Body: {name, email, phone}          │                      │                     │                 │
     │───────────────▶│                     │                      │                     │                 │
     │                │                     │                      │                     │                 │
     │                │ [Authenticate]      │                      │                     │                 │
     │                │ (see filter flow)   │                      │                     │                 │
     │                │                     │                      │                     │                 │
     │                │ Forward Request     │                      │                     │                 │
     │                │────────────────────▶│                      │                     │                 │
     │                │                     │                      │                     │                 │
     │                │                     │  @Valid validation   │                     │                 │
     │                │                     │  (name, email, phone)│                     │                 │
     │                │                     │                      │                     │                 │
     │                │                     │ existsByEmail(email) │                     │                 │
     │                │                     │─────────────────────▶│                     │                 │
     │                │                     │                      │                     │                 │
     │                │                     │                      │ existsByEmail()     │                 │
     │                │                     │                      │────────────────────▶│                 │
     │                │                     │                      │                     │                 │
     │                │                     │                      │                     │  SELECT COUNT   │
     │                │                     │                      │                     │────────────────▶│
     │                │                     │                      │                     │                 │
     │                │                     │                      │                     │     0           │
     │                │                     │                      │                     │◀────────────────│
     │                │                     │                      │                     │                 │
     │                │                     │                      │      false          │                 │
     │                │                     │                      │◀────────────────────│                 │
     │                │                     │                      │                     │                 │
     │                │                     │      false           │                     │                 │
     │                │                     │◀─────────────────────│                     │                 │
     │                │                     │                      │                     │                 │
     │                │                     │  save(student)       │                     │                 │
     │                │                     │─────────────────────▶│                     │                 │
     │                │                     │                      │                     │                 │
     │                │                     │                      │    save(student)    │                 │
     │                │                     │                      │────────────────────▶│                 │
     │                │                     │                      │                     │                 │
     │                │                     │                      │                     │ INSERT INTO     │
     │                │                     │                      │                     │ students        │
     │                │                     │                      │                     │────────────────▶│
     │                │                     │                      │                     │                 │
     │                │                     │                      │                     │ Generated ID    │
     │                │                     │                      │                     │◀────────────────│
     │                │                     │                      │                     │                 │
     │                │                     │                      │  Student (with ID)  │                 │
     │                │                     │                      │◀────────────────────│                 │
     │                │                     │                      │                     │                 │
     │                │                     │  Student (with ID)   │                     │                 │
     │                │                     │◀─────────────────────│                     │                 │
     │                │                     │                      │                     │                 │
     │  201 Created   │                     │                      │                     │                 │
     │  ApiResponse{success, student}       │                      │                     │                 │
     │◀─────────────────────────────────────│                      │                     │                 │
     │                │                     │                      │                     │                 │
  ┌──┴───┐     ┌──────┴──────┐     ┌────────┴─────────┐     ┌──────┴───────┐     ┌───────┴───────┐     ┌───┴────┐
  │Client│     │JwtAuthFilter│     │StudentController │     │StudentService│     │StudentRepository│   │Database│
  └──────┘     └─────────────┘     └──────────────────┘     └──────────────┘     └───────────────┘     └────────┘
```

### 4. Get All Students Flow (Public Endpoint)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       GET ALL STUDENTS SEQUENCE DIAGRAM                          │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌──────┐          ┌──────────────────┐     ┌──────────────┐     ┌───────────────┐     ┌────────┐
  │Client│          │StudentController │     │StudentService│     │StudentRepository│   │Database│
  └──┬───┘          └────────┬─────────┘     └──────┬───────┘     └───────┬───────┘     └───┬────┘
     │                       │                      │                     │                 │
     │  GET /api/students    │                      │                     │                 │
     │  (No auth required)   │                      │                     │                 │
     │──────────────────────▶│                      │                     │                 │
     │                       │                      │                     │                 │
     │                       │    findAll()         │                     │                 │
     │                       │─────────────────────▶│                     │                 │
     │                       │                      │                     │                 │
     │                       │                      │    findAll()        │                 │
     │                       │                      │────────────────────▶│                 │
     │                       │                      │                     │                 │
     │                       │                      │                     │  SELECT * FROM  │
     │                       │                      │                     │  students       │
     │                       │                      │                     │────────────────▶│
     │                       │                      │                     │                 │
     │                       │                      │                     │  Result Set     │
     │                       │                      │                     │◀────────────────│
     │                       │                      │                     │                 │
     │                       │                      │  List<Student>      │                 │
     │                       │                      │◀────────────────────│                 │
     │                       │                      │                     │                 │
     │                       │   List<Student>      │                     │                 │
     │                       │◀─────────────────────│                     │                 │
     │                       │                      │                     │                 │
     │  200 OK               │                      │                     │                 │
     │  ApiResponse{success, │                      │                     │                 │
     │    students[]}        │                      │                     │                 │
     │◀──────────────────────│                      │                     │                 │
     │                       │                      │                     │                 │
  ┌──┴───┐          ┌────────┴─────────┐     ┌──────┴───────┐     ┌───────┴───────┐     ┌───┴────┐
  │Client│          │StudentController │     │StudentService│     │StudentRepository│   │Database│
  └──────┘          └──────────────────┘     └──────────────┘     └───────────────┘     └────────┘
```

---

## Execution Steps

### Prerequisites

1. **Java 21** - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/#java21) or use OpenJDK
2. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
3. **Git** - Download from [git-scm.com](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/francissunillobo/JAVA_Exploration.git
cd JAVA_Exploration
```

### Step 2: Start the Backend (Spring Boot)

#### Option A: Using Maven Wrapper (Recommended)

```bash
# Navigate to backend directory
cd edumanager

# Run with H2 in-memory database (no external DB needed)
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2

# Windows:
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=h2"
```

#### Option B: Using System Maven

```bash
cd edumanager
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

#### Option C: Build JAR and Run

```bash
cd edumanager

# Compile and package
./mvnw clean package -DskipTests

# Run the JAR
java -jar target/edumanager-0.0.1-SNAPSHOT.jar --spring.profiles.active=h2
```

**Backend will start at:** `http://localhost:8080`

### Step 3: Start the Frontend (Angular)

```bash
# Open a new terminal
cd edumanager-ui

# Install dependencies (first time only)
npm install

# Start development server
npm start
```

**Frontend will start at:** `http://localhost:4200`

### Step 4: Verify the Application

1. **Open browser:** Navigate to `http://localhost:4200`
2. **Login with demo credentials:**
   - Admin: `admin` / `admin`
   - User: `user` / `user`
3. **Test the features:**
   - View students list
   - Add new student (requires login)
   - Edit student (requires login)
   - Delete student (requires admin)

### Step 5: Access H2 Console (Optional)

- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:edudb`
- Username: `sa`
- Password: (leave empty)

---

## Build Commands Summary

| Task | Command | Directory |
|------|---------|-----------|
| **Backend - Compile** | `./mvnw compile` | `edumanager/` |
| **Backend - Run Tests** | `./mvnw test` | `edumanager/` |
| **Backend - Package JAR** | `./mvnw package` | `edumanager/` |
| **Backend - Clean Build** | `./mvnw clean install` | `edumanager/` |
| **Backend - Run** | `./mvnw spring-boot:run -Dspring-boot.run.profiles=h2` | `edumanager/` |
| **Frontend - Install** | `npm install` | `edumanager-ui/` |
| **Frontend - Run Dev** | `npm start` | `edumanager-ui/` |
| **Frontend - Build Prod** | `npm run build` | `edumanager-ui/` |
| **Frontend - Run Tests** | `npm test` | `edumanager-ui/` |

---

## API Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Login and get JWT token | No |
| GET | `/api/auth/me` | Get current user info | Yes |

### Student Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/students` | Get all students | No |
| GET | `/api/students/{id}` | Get student by ID | No |
| GET | `/api/students/search?name=` | Search students | No |
| POST | `/api/students` | Create student | Yes |
| PUT | `/api/students/{id}` | Update student | Yes |
| DELETE | `/api/students/{id}` | Delete student | Yes (Admin) |

### Example API Calls

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'

# Get all students
curl http://localhost:8080/api/students

# Create student (with token)
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"123456789"}'

# Search students
curl "http://localhost:8080/api/students/search?name=John"
```

---

## Project Structure

```
Prj_EduManager/
├── edumanager/                    # Spring Boot Backend
│   ├── src/main/java/com/example/edumanager/
│   │   ├── EdumanagerApplication.java    # Main entry point
│   │   ├── controller/                    # REST Controllers
│   │   │   ├── AuthController.java
│   │   │   └── StudentController.java
│   │   ├── dto/                           # Data Transfer Objects
│   │   │   ├── ApiResponse.java
│   │   │   ├── LoginRequest.java
│   │   │   └── LoginResponse.java
│   │   ├── entity/                        # JPA Entities
│   │   │   ├── Student.java
│   │   │   └── User.java
│   │   ├── exception/                     # Exception Handlers
│   │   │   └── GlobalExceptionHandler.java
│   │   ├── repository/                    # Data Repositories
│   │   │   ├── StudentRepository.java
│   │   │   └── UserRepository.java
│   │   ├── security/                      # Security Configuration
│   │   │   ├── CustomUserDetailsService.java
│   │   │   ├── DataInitializer.java
│   │   │   ├── JwtAuthFilter.java
│   │   │   ├── JwtUtils.java
│   │   │   └── SecurityConfig.java
│   │   └── service/                       # Business Logic
│   │       └── StudentService.java
│   ├── src/main/resources/
│   │   ├── application.yml                # Main config (PostgreSQL)
│   │   └── application-h2.yml             # H2 profile config
│   └── pom.xml                            # Maven dependencies
│
├── edumanager-ui/                 # Angular Frontend
│   ├── src/app/
│   │   ├── components/                    # Shared Components
│   │   │   └── navbar/
│   │   ├── guards/                        # Route Guards
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/                  # HTTP Interceptors
│   │   │   └── auth.interceptor.ts
│   │   ├── models/                        # TypeScript Models
│   │   │   ├── auth.model.ts
│   │   │   └── student.model.ts
│   │   ├── pages/                         # Page Components
│   │   │   ├── login/
│   │   │   ├── student-form/
│   │   │   └── students/
│   │   ├── services/                      # API Services
│   │   │   ├── auth.service.ts
│   │   │   └── student.service.ts
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   └── package.json                       # npm dependencies
│
└── ARCHITECTURE.md                # This documentation
```

---

## Troubleshooting

### Common Issues

1. **Port 8080 already in use**
   ```bash
   # Find process using port 8080
   netstat -ano | findstr :8080
   # Kill the process
   taskkill /PID <pid> /F
   ```

2. **Maven wrapper not working**
   - Download Maven manually and use `mvn` instead of `./mvnw`

3. **CORS errors in browser**
   - Backend is configured to allow all origins (`*`)
   - Ensure backend is running before frontend

4. **JWT token expired**
   - Tokens expire after 24 hours
   - Login again to get a new token

---

*Last Updated: December 2024*

