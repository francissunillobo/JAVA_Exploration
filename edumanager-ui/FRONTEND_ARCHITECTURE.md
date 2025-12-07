# EduManager UI - Frontend Architecture & Documentation

## Table of Contents
1. [Overview](#overview)
2. [Interface Diagram](#interface-diagram)
3. [Component Diagram](#component-diagram)
4. [Sequence Diagrams](#sequence-diagrams)
5. [Data Flow](#data-flow)
6. [Route Configuration](#route-configuration)

---

## Overview

The EduManager UI is an Angular 17 Single Page Application (SPA) that provides a modern, responsive interface for managing students.

### Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 17.x | Frontend Framework |
| TypeScript | 5.x | Programming Language |
| RxJS | 7.x | Reactive Programming |
| Angular Signals | Built-in | State Management |
| TailwindCSS-like | Custom | Styling |

---

## Interface Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        EDUMANAGER-UI INTERFACE DIAGRAM                           │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   MODELS                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────┐    ┌─────────────────────────┐                     │
│  │    <<interface>>        │    │     <<interface>>       │                     │
│  │       Student           │    │      LoginRequest       │                     │
│  ├─────────────────────────┤    ├─────────────────────────┤                     │
│  │ + id?: number           │    │ + username: string      │                     │
│  │ + name: string          │    │ + password: string      │                     │
│  │ + email: string         │    └─────────────────────────┘                     │
│  │ + phone?: string        │                                                    │
│  └─────────────────────────┘    ┌─────────────────────────┐                     │
│                                 │     <<interface>>       │                     │
│  ┌─────────────────────────┐    │     LoginResponse       │                     │
│  │    <<interface>>        │    ├─────────────────────────┤                     │
│  │   ApiResponse<T>        │    │ + token: string         │                     │
│  ├─────────────────────────┤    │ + type: string          │                     │
│  │ + success: boolean      │    │ + username: string      │                     │
│  │ + message: string       │    │ + roles: string[]       │                     │
│  │ + data: T               │    └─────────────────────────┘                     │
│  │ + timestamp: string     │                                                    │
│  └─────────────────────────┘    ┌─────────────────────────┐                     │
│                                 │     <<interface>>       │                     │
│                                 │         User            │                     │
│                                 ├─────────────────────────┤                     │
│                                 │ + username: string      │                     │
│                                 │ + roles: string[]       │                     │
│                                 │ + token: string         │                     │
│                                 └─────────────────────────┘                     │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  SERVICES                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                           <<Injectable>>                                  │   │
│  │                            AuthService                                    │   │
│  ├──────────────────────────────────────────────────────────────────────────┤   │
│  │ PRIVATE STATE (Signals)                                                  │   │
│  │ ─────────────────────────                                                │   │
│  │ - currentUserSignal: WritableSignal<User | null>                         │   │
│  │                                                                          │   │
│  │ PUBLIC COMPUTED (Readonly)                                               │   │
│  │ ─────────────────────────                                                │   │
│  │ + currentUser: Signal<User | null>                                       │   │
│  │ + isLoggedIn: Signal<boolean>                                            │   │
│  │ + isAdmin: Signal<boolean>                                               │   │
│  │ + username: Signal<string>                                               │   │
│  │                                                                          │   │
│  │ PUBLIC METHODS                                                           │   │
│  │ ─────────────────────────                                                │   │
│  │ + login(credentials: LoginRequest): Observable<LoginResponse>            │   │
│  │ + logout(): void                                                         │   │
│  │ + getToken(): string | null                                              │   │
│  │ + hasRole(role: string): boolean                                         │   │
│  │                                                                          │   │
│  │ PRIVATE METHODS                                                          │   │
│  │ ─────────────────────────                                                │   │
│  │ - saveAuth(response: LoginResponse): void                                │   │
│  │ - loadUserFromStorage(): User | null                                     │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │                           <<Injectable>>                                  │   │
│  │                           StudentService                                  │   │
│  ├──────────────────────────────────────────────────────────────────────────┤   │
│  │ DEPENDENCIES                                                             │   │
│  │ ─────────────────────────                                                │   │
│  │ - http: HttpClient                                                       │   │
│  │ - apiUrl: string (from environment)                                      │   │
│  │                                                                          │   │
│  │ PUBLIC METHODS                                                           │   │
│  │ ─────────────────────────                                                │   │
│  │ + getAll(): Observable<Student[]>                                        │   │
│  │ + getById(id: number): Observable<Student>                               │   │
│  │ + search(name: string): Observable<Student[]>                            │   │
│  │ + create(student: Student): Observable<Student>                          │   │
│  │ + update(id: number, student: Student): Observable<Student>              │   │
│  │ + delete(id: number): Observable<void>                                   │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              GUARDS & INTERCEPTORS                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────────────────┐    ┌────────────────────────────────────┐   │
│  │      <<CanActivateFn>>         │    │      <<HttpInterceptorFn>>         │   │
│  │         authGuard              │    │        authInterceptor             │   │
│  ├────────────────────────────────┤    ├────────────────────────────────────┤   │
│  │ Checks if user is logged in    │    │ 1. Adds JWT token to requests      │   │
│  │ If not: redirect to /login     │    │ 2. Handles 401 errors              │   │
│  │ Stores returnUrl in query      │    │ 3. Auto-logout on unauthorized     │   │
│  └────────────────────────────────┘    └────────────────────────────────────┘   │
│                                                                                  │
│  ┌────────────────────────────────┐                                             │
│  │      <<CanActivateFn>>         │                                             │
│  │        adminGuard              │                                             │
│  ├────────────────────────────────┤                                             │
│  │ Checks if user has ADMIN role  │                                             │
│  │ If not logged in: → /login     │                                             │
│  │ If not admin: → /students      │                                             │
│  └────────────────────────────────┘                                             │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          COMPONENT HIERARCHY DIAGRAM                             │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────────┐
                              │    AppComponent     │
                              │  (Root Component)   │
                              │  <router-outlet>    │
                              └──────────┬──────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
        ┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
        │  LoginComponent   │ │ StudentsComponent │ │StudentFormComponent│
        │    /login         │ │    /students      │ │ /students/new     │
        └───────────────────┘ └─────────┬─────────┘ │ /students/edit/:id│
                                        │           └─────────┬─────────┘
                                        │                     │
                              ┌─────────┴─────────┐ ┌─────────┴─────────┐
                              │  NavbarComponent  │ │  NavbarComponent  │
                              │   (Shared)        │ │   (Shared)        │
                              └───────────────────┘ └───────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────┐
│                            COMPONENT DETAILS                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                         <<Standalone Component>>                         │    │
│  │                           LoginComponent                                 │    │
│  │                             /login                                       │    │
│  ├─────────────────────────────────────────────────────────────────────────┤    │
│  │ STATE (Signals)                                                         │    │
│  │ ─────────────────                                                       │    │
│  │ - username: string                                                      │    │
│  │ - password: string                                                      │    │
│  │ - loading: WritableSignal<boolean>                                      │    │
│  │ - error: WritableSignal<string>                                         │    │
│  │ - returnUrl: string                                                     │    │
│  │                                                                         │    │
│  │ METHODS                                                                 │    │
│  │ ─────────────────                                                       │    │
│  │ + fillCredentials(username, password): void                             │    │
│  │ + onSubmit(): void                                                      │    │
│  │                                                                         │    │
│  │ DEPENDENCIES                                                            │    │
│  │ ─────────────────                                                       │    │
│  │ - AuthService                                                           │    │
│  │ - Router                                                                │    │
│  │ - ActivatedRoute                                                        │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                         <<Standalone Component>>                         │    │
│  │                          StudentsComponent                               │    │
│  │                            /students                                     │    │
│  ├─────────────────────────────────────────────────────────────────────────┤    │
│  │ STATE (Signals)                                                         │    │
│  │ ─────────────────                                                       │    │
│  │ - students: WritableSignal<Student[]>                                   │    │
│  │ - loading: WritableSignal<boolean>                                      │    │
│  │ - error: WritableSignal<string>                                         │    │
│  │ - searchTerm: string                                                    │    │
│  │ - studentToDelete: WritableSignal<Student | null>                       │    │
│  │ - deleting: WritableSignal<boolean>                                     │    │
│  │ - toast: WritableSignal<{message, type} | null>                         │    │
│  │                                                                         │    │
│  │ COMPUTED                                                                │    │
│  │ ─────────────────                                                       │    │
│  │ + filteredStudents: Signal<Student[]>                                   │    │
│  │                                                                         │    │
│  │ METHODS                                                                 │    │
│  │ ─────────────────                                                       │    │
│  │ + ngOnInit(): void                                                      │    │
│  │ + loadStudents(): void                                                  │    │
│  │ + onSearch(): void                                                      │    │
│  │ + clearSearch(): void                                                   │    │
│  │ + confirmDelete(student): void                                          │    │
│  │ + cancelDelete(): void                                                  │    │
│  │ + deleteStudent(): void                                                 │    │
│  │ - showToast(message, type): void                                        │    │
│  │                                                                         │    │
│  │ DEPENDENCIES                                                            │    │
│  │ ─────────────────                                                       │    │
│  │ - StudentService                                                        │    │
│  │ - AuthService (public for template)                                     │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                         <<Standalone Component>>                         │    │
│  │                        StudentFormComponent                              │    │
│  │                    /students/new, /students/edit/:id                     │    │
│  ├─────────────────────────────────────────────────────────────────────────┤    │
│  │ STATE                                                                   │    │
│  │ ─────────────────                                                       │    │
│  │ - student: Student                                                      │    │
│  │ - isEditMode: WritableSignal<boolean>                                   │    │
│  │ - loadingStudent: WritableSignal<boolean>                               │    │
│  │ - saving: WritableSignal<boolean>                                       │    │
│  │ - error: WritableSignal<string>                                         │    │
│  │ - studentId: number | null                                              │    │
│  │                                                                         │    │
│  │ METHODS                                                                 │    │
│  │ ─────────────────                                                       │    │
│  │ + ngOnInit(): void                                                      │    │
│  │ - loadStudent(): void                                                   │    │
│  │ + onSubmit(): void                                                      │    │
│  │                                                                         │    │
│  │ DEPENDENCIES                                                            │    │
│  │ ─────────────────                                                       │    │
│  │ - StudentService                                                        │    │
│  │ - Router                                                                │    │
│  │ - ActivatedRoute                                                        │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                         <<Standalone Component>>                         │    │
│  │                           NavbarComponent                                │    │
│  │                           (Shared Component)                             │    │
│  ├─────────────────────────────────────────────────────────────────────────┤    │
│  │ TEMPLATE FEATURES                                                       │    │
│  │ ─────────────────                                                       │    │
│  │ - Brand logo & name                                                     │    │
│  │ - Navigation links (Students, Add Student)                              │    │
│  │ - User info (avatar, username, role badge)                              │    │
│  │ - Login/Logout button                                                   │    │
│  │                                                                         │    │
│  │ DEPENDENCIES                                                            │    │
│  │ ─────────────────                                                       │    │
│  │ - AuthService (public for template)                                     │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Sequence Diagrams

### 1. User Login Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND LOGIN SEQUENCE DIAGRAM                           │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌─────┐     ┌──────────────┐     ┌───────────┐     ┌──────────────┐     ┌────────┐
  │User │     │LoginComponent│     │AuthService│     │HttpClient    │     │Backend │
  └──┬──┘     └──────┬───────┘     └─────┬─────┘     └──────┬───────┘     └───┬────┘
     │               │                   │                  │                 │
     │ Enter credentials                 │                  │                 │
     │──────────────▶│                   │                  │                 │
     │               │                   │                  │                 │
     │ Click "Sign In"                   │                  │                 │
     │──────────────▶│                   │                  │                 │
     │               │                   │                  │                 │
     │               │ onSubmit()        │                  │                 │
     │               │ loading.set(true) │                  │                 │
     │               │ error.set('')     │                  │                 │
     │               │                   │                  │                 │
     │               │ login(credentials)│                  │                 │
     │               │──────────────────▶│                  │                 │
     │               │                   │                  │                 │
     │               │                   │ POST /api/auth/login               │
     │               │                   │─────────────────▶│                 │
     │               │                   │                  │                 │
     │               │                   │                  │ HTTP POST       │
     │               │                   │                  │────────────────▶│
     │               │                   │                  │                 │
     │               │                   │                  │ LoginResponse   │
     │               │                   │                  │ {token,username,│
     │               │                   │                  │  roles}         │
     │               │                   │                  │◀────────────────│
     │               │                   │                  │                 │
     │               │                   │ Observable<LoginResponse>          │
     │               │                   │◀─────────────────│                 │
     │               │                   │                  │                 │
     │               │                   │ saveAuth()       │                 │
     │               │                   │ ┌───────────────────────┐          │
     │               │                   │ │ localStorage.setItem  │          │
     │               │                   │ │ ('edu_token', token)  │          │
     │               │                   │ │ ('edu_user', user)    │          │
     │               │                   │ │ currentUserSignal.set │          │
     │               │                   │ └───────────────────────┘          │
     │               │                   │                  │                 │
     │               │ LoginResponse     │                  │                 │
     │               │◀──────────────────│                  │                 │
     │               │                   │                  │                 │
     │               │ subscribe.next()  │                  │                 │
     │               │ router.navigate   │                  │                 │
     │               │ ([returnUrl])     │                  │                 │
     │               │                   │                  │                 │
     │ Redirect to   │                   │                  │                 │
     │ /students     │                   │                  │                 │
     │◀──────────────│                   │                  │                 │
     │               │                   │                  │                 │
  ┌──┴──┐     ┌──────┴───────┐     ┌─────┴─────┐     ┌──────┴───────┐     ┌───┴────┐
  │User │     │LoginComponent│     │AuthService│     │HttpClient    │     │Backend │
  └─────┘     └──────────────┘     └───────────┘     └──────────────┘     └────────┘
```

### 2. HTTP Interceptor Flow (Adding JWT Token)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      AUTH INTERCEPTOR SEQUENCE DIAGRAM                           │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────┐     ┌───────────────┐     ┌───────────┐     ┌───────────────┐
  │ Component   │     │authInterceptor│     │AuthService│     │  HttpClient   │
  └──────┬──────┘     └───────┬───────┘     └─────┬─────┘     └───────┬───────┘
         │                    │                   │                   │
         │ HTTP Request       │                   │                   │
         │ (e.g., GET /api/students)              │                   │
         │───────────────────▶│                   │                   │
         │                    │                   │                   │
         │                    │ getToken()        │                   │
         │                    │──────────────────▶│                   │
         │                    │                   │                   │
         │                    │ "eyJhbG..."       │                   │
         │                    │◀──────────────────│                   │
         │                    │                   │                   │
         │                    │ req.clone({       │                   │
         │                    │   setHeaders: {   │                   │
         │                    │     Authorization:│                   │
         │                    │     'Bearer <token>'                  │
         │                    │   }               │                   │
         │                    │ })                │                   │
         │                    │                   │                   │
         │                    │ next(clonedReq)   │                   │
         │                    │──────────────────────────────────────▶│
         │                    │                   │                   │
         │                    │                   │      Response     │
         │                    │◀──────────────────────────────────────│
         │                    │                   │                   │
         │                    │ [If 401 Error]    │                   │
         │                    │ authService.logout()                  │
         │                    │ router.navigate(['/login'])           │
         │                    │                   │                   │
         │     Response       │                   │                   │
         │◀───────────────────│                   │                   │
         │                    │                   │                   │
  ┌──────┴──────┐     ┌───────┴───────┐     ┌─────┴─────┐     ┌───────┴───────┐
  │ Component   │     │authInterceptor│     │AuthService│     │  HttpClient   │
  └─────────────┘     └───────────────┘     └───────────┘     └───────────────┘
```

### 3. Load Students Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       LOAD STUDENTS SEQUENCE DIAGRAM                             │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌─────┐     ┌─────────────────┐     ┌──────────────┐     ┌───────────────┐     ┌────────┐
  │User │     │StudentsComponent│     │StudentService│     │authInterceptor│     │Backend │
  └──┬──┘     └────────┬────────┘     └──────┬───────┘     └───────┬───────┘     └───┬────┘
     │                 │                     │                     │                 │
     │ Navigate to     │                     │                     │                 │
     │ /students       │                     │                     │                 │
     │────────────────▶│                     │                     │                 │
     │                 │                     │                     │                 │
     │                 │ ngOnInit()          │                     │                 │
     │                 │ loadStudents()      │                     │                 │
     │                 │ loading.set(true)   │                     │                 │
     │                 │                     │                     │                 │
     │                 │ getAll()            │                     │                 │
     │                 │────────────────────▶│                     │                 │
     │                 │                     │                     │                 │
     │                 │                     │ GET /api/students   │                 │
     │                 │                     │────────────────────▶│                 │
     │                 │                     │                     │                 │
     │                 │                     │                     │ [Add JWT if     │
     │                 │                     │                     │  logged in]     │
     │                 │                     │                     │                 │
     │                 │                     │                     │ GET request     │
     │                 │                     │                     │────────────────▶│
     │                 │                     │                     │                 │
     │                 │                     │                     │ ApiResponse<    │
     │                 │                     │                     │ Student[]>      │
     │                 │                     │                     │◀────────────────│
     │                 │                     │                     │                 │
     │                 │                     │ Observable<ApiResponse>              │
     │                 │                     │◀────────────────────│                 │
     │                 │                     │                     │                 │
     │                 │                     │ .pipe(map(          │                 │
     │                 │                     │   r => r.data))     │                 │
     │                 │                     │                     │                 │
     │                 │ Observable<Student[]>                     │                 │
     │                 │◀────────────────────│                     │                 │
     │                 │                     │                     │                 │
     │                 │ subscribe.next()    │                     │                 │
     │                 │ students.set(data)  │                     │                 │
     │                 │ loading.set(false)  │                     │                 │
     │                 │                     │                     │                 │
     │ Display student │                     │                     │                 │
     │ grid            │                     │                     │                 │
     │◀────────────────│                     │                     │                 │
     │                 │                     │                     │                 │
  ┌──┴──┐     ┌────────┴────────┐     ┌──────┴───────┐     ┌───────┴───────┐     ┌───┴────┐
  │User │     │StudentsComponent│     │StudentService│     │authInterceptor│     │Backend │
  └─────┘     └─────────────────┘     └──────────────┘     └───────────────┘     └────────┘
```

### 4. Create Student Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       CREATE STUDENT SEQUENCE DIAGRAM                            │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌─────┐     ┌───────────┐     ┌──────────────────┐     ┌──────────────┐     ┌────────┐
  │User │     │ authGuard │     │StudentFormComponent│   │StudentService│     │Backend │
  └──┬──┘     └─────┬─────┘     └────────┬─────────┘     └──────┬───────┘     └───┬────┘
     │              │                    │                      │                 │
     │ Navigate to  │                    │                      │                 │
     │ /students/new│                    │                      │                 │
     │─────────────▶│                    │                      │                 │
     │              │                    │                      │                 │
     │              │ isLoggedIn()?      │                      │                 │
     │              │ ┌────────────┐     │                      │                 │
     │              │ │ Check      │     │                      │                 │
     │              │ │ AuthService│     │                      │                 │
     │              │ └────────────┘     │                      │                 │
     │              │                    │                      │                 │
     │              │ [If not logged in] │                      │                 │
     │              │ redirect /login    │                      │                 │
     │              │ ?returnUrl=/students/new                  │                 │
     │              │                    │                      │                 │
     │              │ [If logged in]     │                      │                 │
     │              │ return true        │                      │                 │
     │              │                    │                      │                 │
     │              │ Allow navigation   │                      │                 │
     │              │───────────────────▶│                      │                 │
     │              │                    │                      │                 │
     │ Display form │                    │                      │                 │
     │◀─────────────────────────────────│                      │                 │
     │              │                    │                      │                 │
     │ Fill form    │                    │                      │                 │
     │ (name, email,│                    │                      │                 │
     │  phone)      │                    │                      │                 │
     │─────────────────────────────────▶│                      │                 │
     │              │                    │                      │                 │
     │ Click "Create Student"           │                      │                 │
     │─────────────────────────────────▶│                      │                 │
     │              │                    │                      │                 │
     │              │                    │ onSubmit()           │                 │
     │              │                    │ saving.set(true)     │                 │
     │              │                    │                      │                 │
     │              │                    │ create(student)      │                 │
     │              │                    │─────────────────────▶│                 │
     │              │                    │                      │                 │
     │              │                    │                      │ POST /api/students
     │              │                    │                      │ + JWT token     │
     │              │                    │                      │────────────────▶│
     │              │                    │                      │                 │
     │              │                    │                      │ ApiResponse<    │
     │              │                    │                      │ Student>        │
     │              │                    │                      │◀────────────────│
     │              │                    │                      │                 │
     │              │                    │ Observable<Student>  │                 │
     │              │                    │◀─────────────────────│                 │
     │              │                    │                      │                 │
     │              │                    │ subscribe.next()     │                 │
     │              │                    │ router.navigate      │                 │
     │              │                    │ (['/students'])      │                 │
     │              │                    │                      │                 │
     │ Redirect to  │                    │                      │                 │
     │ /students    │                    │                      │                 │
     │◀─────────────────────────────────│                      │                 │
     │              │                    │                      │                 │
  ┌──┴──┐     ┌─────┴─────┐     ┌────────┴─────────┐     ┌──────┴───────┐     ┌───┴────┐
  │User │     │ authGuard │     │StudentFormComponent│   │StudentService│     │Backend │
  └─────┘     └───────────┘     └──────────────────┘     └──────────────┘     └────────┘
```

### 5. Delete Student Flow (Admin Only)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    DELETE STUDENT SEQUENCE DIAGRAM (ADMIN)                       │
└─────────────────────────────────────────────────────────────────────────────────┘

  ┌─────┐     ┌─────────────────┐     ┌──────────────┐     ┌────────┐
  │Admin│     │StudentsComponent│     │StudentService│     │Backend │
  └──┬──┘     └────────┬────────┘     └──────┬───────┘     └───┬────┘
     │                 │                     │                 │
     │ Click Delete    │                     │                 │
     │ button on card  │                     │                 │
     │────────────────▶│                     │                 │
     │                 │                     │                 │
     │                 │ confirmDelete(student)               │
     │                 │ studentToDelete.set(student)         │
     │                 │                     │                 │
     │ Display modal   │                     │                 │
     │ "Delete Student?"                     │                 │
     │◀────────────────│                     │                 │
     │                 │                     │                 │
     │ Click "Delete"  │                     │                 │
     │ in modal        │                     │                 │
     │────────────────▶│                     │                 │
     │                 │                     │                 │
     │                 │ deleteStudent()     │                 │
     │                 │ deleting.set(true)  │                 │
     │                 │                     │                 │
     │                 │ delete(student.id)  │                 │
     │                 │────────────────────▶│                 │
     │                 │                     │                 │
     │                 │                     │ DELETE          │
     │                 │                     │ /api/students/:id
     │                 │                     │ + JWT (admin)   │
     │                 │                     │────────────────▶│
     │                 │                     │                 │
     │                 │                     │                 │ [Check ADMIN role]
     │                 │                     │                 │
     │                 │                     │ 200 OK          │
     │                 │                     │◀────────────────│
     │                 │                     │                 │
     │                 │ Observable<void>    │                 │
     │                 │◀────────────────────│                 │
     │                 │                     │                 │
     │                 │ subscribe.next()    │                 │
     │                 │ students.update(    │                 │
     │                 │   filter out deleted)                 │
     │                 │ studentToDelete.set(null)             │
     │                 │ deleting.set(false) │                 │
     │                 │ showToast('success')│                 │
     │                 │                     │                 │
     │ Close modal     │                     │                 │
     │ Show toast      │                     │                 │
     │ "Student deleted"                     │                 │
     │◀────────────────│                     │                 │
     │                 │                     │                 │
  ┌──┴──┐     ┌────────┴────────┐     ┌──────┴───────┐     ┌───┴────┐
  │Admin│     │StudentsComponent│     │StudentService│     │Backend │
  └─────┘     └─────────────────┘     └──────────────┘     └────────┘
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW ARCHITECTURE                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────────┐
                                    │   localStorage  │
                                    │  ┌───────────┐  │
                                    │  │ edu_token │  │
                                    │  │ edu_user  │  │
                                    │  └───────────┘  │
                                    └────────┬────────┘
                                             │
                                             │ Load on init
                                             │ Save on login
                                             ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Component  │    │  Component  │    │ AuthService │    │   Backend   │
│  Template   │◀───│   State     │◀───│  (Signals)  │◀───│    API      │
│             │    │  (Signals)  │    │             │    │             │
└─────────────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
                         │                   │                  │
                         │                   │                  │
      User Actions       │                   │                  │
      ─────────────      │                   │                  │
      • Click            │                   │                  │
      • Input            │                   │                  │
      • Submit           │                   │                  │
             │           │                   │                  │
             ▼           │                   │                  │
      ┌─────────────┐    │                   │                  │
      │  Component  │────┘                   │                  │
      │   Methods   │                        │                  │
      └──────┬──────┘                        │                  │
             │                               │                  │
             │ Call Service                  │                  │
             └──────────────────────────────▶│                  │
                                             │                  │
                                             │ HTTP Request     │
                                             │ (via HttpClient) │
                                             └─────────────────▶│
                                                                │
                                             ┌──────────────────┘
                                             │ HTTP Response
                                             ▼
                                    ┌─────────────────┐
                                    │ authInterceptor │
                                    │ • Add JWT token │
                                    │ • Handle 401    │
                                    └─────────────────┘


                         SIGNAL-BASED STATE MANAGEMENT
                         ─────────────────────────────

    ┌──────────────────────────────────────────────────────────────┐
    │                        AuthService                            │
    │                                                               │
    │   ┌─────────────────────┐                                     │
    │   │ currentUserSignal   │◀──── signal<User | null>           │
    │   │ (WritableSignal)    │                                     │
    │   └──────────┬──────────┘                                     │
    │              │                                                │
    │              │ computed()                                     │
    │              ▼                                                │
    │   ┌─────────────────────┐                                     │
    │   │ isLoggedIn          │──── computed(() => !!user)         │
    │   │ isAdmin             │──── computed(() => hasRole)        │
    │   │ username            │──── computed(() => user.name)      │
    │   │ (Readonly Signals)  │                                     │
    │   └─────────────────────┘                                     │
    │                                                               │
    └──────────────────────────────────────────────────────────────┘
                              │
                              │ Used by Components
                              ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                    Component Templates                        │
    │                                                               │
    │   @if (authService.isLoggedIn()) {                           │
    │     <button (click)="authService.logout()">Logout</button>   │
    │   }                                                           │
    │                                                               │
    │   @if (authService.isAdmin()) {                              │
    │     <button (click)="deleteStudent()">Delete</button>        │
    │   }                                                           │
    │                                                               │
    └──────────────────────────────────────────────────────────────┘
```

---

## Route Configuration

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ROUTE CONFIGURATION                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────────────────┐
    │                           Angular Routes                                 │
    └─────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────┬──────────────────────┬───────────┬───────────────────┐
    │      Path        │      Component       │   Guard   │    Description    │
    ├──────────────────┼──────────────────────┼───────────┼───────────────────┤
    │ /                │ (redirect)           │    -      │ → /students       │
    ├──────────────────┼──────────────────────┼───────────┼───────────────────┤
    │ /login           │ LoginComponent       │    -      │ Login page        │
    │                  │ (lazy loaded)        │           │                   │
    ├──────────────────┼──────────────────────┼───────────┼───────────────────┤
    │ /students        │ StudentsComponent    │    -      │ Student list      │
    │                  │ (lazy loaded)        │           │ (public)          │
    ├──────────────────┼──────────────────────┼───────────┼───────────────────┤
    │ /students/new    │ StudentFormComponent │ authGuard │ Create student    │
    │                  │ (lazy loaded)        │           │ (login required)  │
    ├──────────────────┼──────────────────────┼───────────┼───────────────────┤
    │ /students/edit/:id│ StudentFormComponent│ authGuard │ Edit student      │
    │                  │ (lazy loaded)        │           │ (login required)  │
    ├──────────────────┼──────────────────────┼───────────┼───────────────────┤
    │ **               │ (redirect)           │    -      │ → /students       │
    │                  │                      │           │ (wildcard/404)    │
    └──────────────────┴──────────────────────┴───────────┴───────────────────┘


                            NAVIGATION FLOW DIAGRAM
                            ───────────────────────

                              ┌─────────────────┐
                              │   App Start     │
                              │   (Root URL)    │
                              └────────┬────────┘
                                       │
                                       │ redirect
                                       ▼
                              ┌─────────────────┐
                              │   /students     │◀──────────────────────┐
                              │  (Public View)  │                       │
                              └────────┬────────┘                       │
                                       │                                │
                    ┌──────────────────┼──────────────────┐             │
                    │                  │                  │             │
                    ▼                  ▼                  ▼             │
           ┌────────────────┐ ┌────────────────┐ ┌────────────────┐     │
           │  Click Login   │ │ Click Add      │ │ Click Edit     │     │
           │                │ │ Student        │ │ (on card)      │     │
           └───────┬────────┘ └───────┬────────┘ └───────┬────────┘     │
                   │                  │                  │              │
                   │                  │                  │              │
                   ▼                  ▼                  ▼              │
           ┌────────────────┐ ┌────────────────┐ ┌────────────────┐     │
           │    /login      │ │ authGuard      │ │ authGuard      │     │
           │                │ │ Check          │ │ Check          │     │
           └───────┬────────┘ └───────┬────────┘ └───────┬────────┘     │
                   │                  │                  │              │
                   │           ┌──────┴──────┐    ┌──────┴──────┐       │
                   │           │             │    │             │       │
                   │           ▼             ▼    ▼             ▼       │
                   │    [Logged In]    [Not Logged] [Logged In] [Not]   │
                   │           │             │          │         │     │
                   │           │             │          │         │     │
                   │           ▼             │          ▼         │     │
                   │    ┌────────────┐       │   ┌────────────┐   │     │
                   │    │/students/  │       │   │/students/  │   │     │
                   │    │   new      │       │   │edit/:id    │   │     │
                   │    └─────┬──────┘       │   └─────┬──────┘   │     │
                   │          │              │         │          │     │
                   │          │              │         │          │     │
                   │          │ Submit       │         │ Submit   │     │
                   │          │              │         │          │     │
                   │          └──────────────┼─────────┘          │     │
                   │                         │                    │     │
                   │                         │ redirect           │     │
                   │                         │ /login?returnUrl   │     │
                   │                         │                    │     │
                   │                         ▼                    │     │
                   │                  ┌────────────┐              │     │
                   └─────────────────▶│   /login   │◀─────────────┘     │
                                      │            │                    │
                                      └─────┬──────┘                    │
                                            │                           │
                                            │ Success                   │
                                            │                           │
                                            └───────────────────────────┘
                                              (redirect to returnUrl
                                               or /students)
```

---

## File Structure

```
edumanager-ui/
├── src/
│   ├── app/
│   │   ├── components/                 # Shared/Reusable Components
│   │   │   └── navbar/
│   │   │       └── navbar.component.ts
│   │   │
│   │   ├── guards/                     # Route Guards
│   │   │   └── auth.guard.ts           # authGuard, adminGuard
│   │   │
│   │   ├── interceptors/               # HTTP Interceptors
│   │   │   └── auth.interceptor.ts     # JWT token injection
│   │   │
│   │   ├── models/                     # TypeScript Interfaces
│   │   │   ├── auth.model.ts           # LoginRequest, LoginResponse, User
│   │   │   └── student.model.ts        # Student, ApiResponse<T>
│   │   │
│   │   ├── pages/                      # Page Components (Routes)
│   │   │   ├── login/
│   │   │   │   └── login.component.ts
│   │   │   ├── students/
│   │   │   │   └── students.component.ts
│   │   │   └── student-form/
│   │   │       └── student-form.component.ts
│   │   │
│   │   ├── services/                   # Business Logic Services
│   │   │   ├── auth.service.ts         # Authentication
│   │   │   └── student.service.ts      # Student CRUD
│   │   │
│   │   ├── app.component.ts            # Root Component
│   │   └── app.routes.ts               # Route Configuration
│   │
│   ├── environments/
│   │   ├── environment.ts              # Dev config (apiUrl)
│   │   └── environment.prod.ts         # Prod config
│   │
│   ├── styles.css                      # Global Styles
│   ├── index.html                      # Main HTML
│   └── main.ts                         # Bootstrap
│
├── angular.json                        # Angular CLI config
├── package.json                        # Dependencies
└── tsconfig.json                       # TypeScript config
```

---

*Last Updated: December 2024*

