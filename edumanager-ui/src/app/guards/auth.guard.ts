import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth guard that protects routes requiring authentication.
 * Redirects to login page if user is not logged in.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    return true;
  }
  
  // Not logged in, redirect to login with return URL
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  
  return false;
};

/**
 * Admin guard that protects routes requiring ADMIN role.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }
  
  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  } else {
    // Logged in but not admin - redirect to students
    router.navigate(['/students']);
  }
  
  return false;
};

