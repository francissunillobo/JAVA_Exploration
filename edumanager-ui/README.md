# EduManager UI - Angular Frontend

A modern Angular 17 frontend for the EduManager Student Management API.

## ✨ Features

- **Modern Angular 17** with standalone components and signals
- **JWT Authentication** with automatic token refresh
- **Role-based Access Control** (Admin vs User)
- **Responsive Design** with a warm, sophisticated aesthetic
- **Student Management** - Create, Read, Update, Delete operations
- **Search Functionality** - Filter students by name
- **Lazy Loading** - Optimized route loading

## 🎨 Design

The UI features a sophisticated design with:
- **Playfair Display** serif font for headings
- **DM Sans** for body text
- **Deep teal** primary color (#1a5f5a)
- **Warm gold** accent color (#d4a853)
- Smooth animations and transitions
- Mobile-responsive layout

## 📋 Prerequisites

- **Node.js 18+** (LTS recommended)
- **npm** or **yarn**
- **EduManager Backend** running on `http://localhost:8080`

## 🚀 Quick Start

```bash
# 1. Navigate to the frontend directory
cd edumanager-ui

# 2. Install dependencies
npm install

# 3. Start the development server
npm start

# 4. Open browser at http://localhost:4200
```

## 📁 Project Structure

```
edumanager-ui/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── navbar/           # Navigation bar component
│   │   ├── guards/
│   │   │   └── auth.guard.ts     # Route protection
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts # JWT token injection
│   │   ├── models/
│   │   │   ├── auth.model.ts     # Auth interfaces
│   │   │   └── student.model.ts  # Student interfaces
│   │   ├── pages/
│   │   │   ├── login/            # Login page
│   │   │   ├── students/         # Student list page
│   │   │   └── student-form/     # Add/Edit student page
│   │   ├── services/
│   │   │   ├── auth.service.ts   # Authentication service
│   │   │   └── student.service.ts # Student API service
│   │   ├── app.component.ts      # Root component
│   │   └── app.routes.ts         # Route definitions
│   ├── environments/
│   │   ├── environment.ts        # Dev environment
│   │   └── environment.prod.ts   # Production environment
│   ├── styles.css                # Global styles
│   ├── index.html                # HTML entry point
│   └── main.ts                   # Application bootstrap
├── angular.json                  # Angular CLI config
├── package.json                  # Dependencies
└── tsconfig.json                 # TypeScript config
```

## 🔐 Authentication Flow

1. **Login Page** (`/login`)
   - Enter credentials (admin/admin or user/user)
   - JWT token stored in localStorage
   - Redirected to students page

2. **Protected Routes**
   - `/students/new` - Requires authentication
   - `/students/edit/:id` - Requires authentication
   - Delete button - Requires ADMIN role

3. **Token Handling**
   - `authInterceptor` adds Bearer token to all API requests
   - 401 responses trigger automatic logout

## 📱 Pages

### Login (`/login`)
- Username/password form
- Demo credential buttons
- Guest access link

### Students List (`/students`)
- Grid display of all students
- Search by name
- Edit/Delete actions (based on permissions)
- Add new student button

### Student Form (`/students/new`, `/students/edit/:id`)
- Create or edit student
- Form validation
- Error handling

## 🔧 Configuration

### API URL

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'  // Your backend URL
};
```

## 🧪 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Build and watch for changes
npm run watch
```

## 🌐 API Integration

The frontend connects to these backend endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get student by ID |
| GET | `/api/students/search?name=` | Search students |
| POST | `/api/students` | Create student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student (Admin) |

## 🎯 User Roles

| Role | Permissions |
|------|-------------|
| **Guest** | View students, search |
| **User** | + Create, edit students |
| **Admin** | + Delete students |

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/edumanager-ui` directory.

### Serve with a static server

```bash
npx serve dist/edumanager-ui/browser
```

## 📝 Notes

- Make sure the Spring Boot backend is running before starting the frontend
- CORS is configured in the backend to allow `http://localhost:4200`
- JWT tokens expire after 24 hours (configurable in backend)

## 🔗 Related

- [EduManager Backend](../edumanager/README.md) - Spring Boot REST API

