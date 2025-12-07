import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'students',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'students',
    loadComponent: () => import('./pages/students/students.component').then(m => m.StudentsComponent)
  },
  {
    path: 'students/new',
    loadComponent: () => import('./pages/student-form/student-form.component').then(m => m.StudentFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'students/edit/:id',
    loadComponent: () => import('./pages/student-form/student-form.component').then(m => m.StudentFormComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'students'
  }
];

