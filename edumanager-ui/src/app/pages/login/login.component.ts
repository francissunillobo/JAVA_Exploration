import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-page">
      <!-- Decorative background -->
      <div class="bg-pattern"></div>
      
      <div class="login-container animate-slide-up">
        <!-- Logo/Brand -->
        <div class="brand">
          <div class="logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="var(--color-primary)"/>
              <path d="M14 34V18L24 12L34 18V34" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 22L24 28L34 22" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="24" cy="18" r="3" fill="var(--color-accent)"/>
            </svg>
          </div>
          <h1>EduManager</h1>
          <p class="tagline">Student Management System</p>
        </div>

        <!-- Login Form -->
        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              [(ngModel)]="username" 
              name="username"
              placeholder="Enter your username"
              autocomplete="username"
              required
              [disabled]="loading()"
            >
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="password" 
              name="password"
              placeholder="Enter your password"
              autocomplete="current-password"
              required
              [disabled]="loading()"
            >
          </div>

          @if (error()) {
            <div class="error-message">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 4h2v5H7V4zm0 6h2v2H7v-2z"/>
              </svg>
              {{ error() }}
            </div>
          }

          <button type="submit" class="btn btn-primary btn-block" [disabled]="loading()">
            @if (loading()) {
              <span class="spinner"></span>
              Signing in...
            } @else {
              Sign In
            }
          </button>
        </form>

        <!-- Demo credentials -->
        <div class="demo-info">
          <p class="demo-title">Demo Credentials</p>
          <div class="credentials">
            <button type="button" class="credential-btn" (click)="fillCredentials('admin', 'admin')">
              <span class="badge badge-admin">Admin</span>
              <span>admin / admin</span>
            </button>
            <button type="button" class="credential-btn" (click)="fillCredentials('user', 'user')">
              <span class="badge badge-user">User</span>
              <span>user / user</span>
            </button>
          </div>
        </div>

        <!-- Continue without login -->
        <div class="guest-link">
          <a routerLink="/students">Continue as guest →</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-lg);
      position: relative;
      overflow: hidden;
    }

    .bg-pattern {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 20% 80%, rgba(26, 95, 90, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(212, 168, 83, 0.08) 0%, transparent 50%),
        linear-gradient(135deg, var(--color-bg) 0%, #f0ebe3 100%);
      z-index: -1;
    }

    .login-container {
      width: 100%;
      max-width: 420px;
      background: var(--color-bg-card);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      padding: var(--space-2xl);
      border: 1px solid var(--color-border);
    }

    .brand {
      text-align: center;
      margin-bottom: var(--space-2xl);
    }

    .logo {
      margin-bottom: var(--space-md);
    }

    .brand h1 {
      font-family: var(--font-display);
      font-size: 1.75rem;
      color: var(--color-primary);
      margin-bottom: var(--space-xs);
    }

    .tagline {
      color: var(--color-text-muted);
      font-size: 0.9rem;
      margin: 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text);
      margin-bottom: var(--space-sm);
    }

    .form-group input {
      padding: 0.875rem var(--space-md);
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-md);
      background: rgba(197, 57, 41, 0.08);
      border: 1px solid rgba(197, 57, 41, 0.2);
      border-radius: var(--radius-md);
      color: var(--color-error);
      font-size: 0.875rem;
    }

    .btn-block {
      width: 100%;
      padding: var(--space-md) var(--space-xl);
      font-size: 1rem;
    }

    .btn-block .spinner {
      width: 18px;
      height: 18px;
      border-width: 2px;
      border-top-color: white;
    }

    .demo-info {
      margin-top: var(--space-xl);
      padding-top: var(--space-xl);
      border-top: 1px solid var(--color-border);
    }

    .demo-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--color-text-muted);
      text-align: center;
      margin-bottom: var(--space-md);
    }

    .credentials {
      display: flex;
      gap: var(--space-sm);
    }

    .credential-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-md);
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      font-size: 0.8rem;
      color: var(--color-text-light);
    }

    .credential-btn:hover {
      border-color: var(--color-primary);
      background: rgba(26, 95, 90, 0.03);
    }

    .guest-link {
      text-align: center;
      margin-top: var(--space-lg);
    }

    .guest-link a {
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }

    .guest-link a:hover {
      color: var(--color-primary);
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = signal(false);
  error = signal('');
  
  private returnUrl = '/students';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Get return URL from route parameters
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/students';
    
    // If already logged in, redirect
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  fillCredentials(username: string, password: string): void {
    this.username = username;
    this.password = password;
    this.error.set('');
  }

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.error.set('Please enter username and password');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: (err) => {
          this.loading.set(false);
          if (err.status === 401) {
            this.error.set('Invalid username or password');
          } else {
            this.error.set('Login failed. Please try again.');
          }
        }
      });
  }
}

