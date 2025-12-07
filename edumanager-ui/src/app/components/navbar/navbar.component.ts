import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <!-- Logo -->
        <a routerLink="/students" class="nav-brand">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="10" fill="var(--color-primary)"/>
            <path d="M14 34V18L24 12L34 18V34" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 22L24 28L34 22" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="24" cy="18" r="3" fill="var(--color-accent)"/>
          </svg>
          <span>EduManager</span>
        </a>

        <!-- Nav Links -->
        <div class="nav-links">
          <a routerLink="/students" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            Students
          </a>
          @if (authService.isLoggedIn()) {
            <a routerLink="/students/new" routerLinkActive="active">
              Add Student
            </a>
          }
        </div>

        <!-- User Section -->
        <div class="nav-user">
          @if (authService.isLoggedIn()) {
            <div class="user-info">
              <span class="user-avatar">{{ authService.username().charAt(0).toUpperCase() }}</span>
              <div class="user-details">
                <span class="user-name">{{ authService.username() }}</span>
                @if (authService.isAdmin()) {
                  <span class="badge badge-admin">Admin</span>
                } @else {
                  <span class="badge badge-user">User</span>
                }
              </div>
            </div>
            <button class="btn btn-ghost btn-sm" (click)="authService.logout()">
              Logout
            </button>
          } @else {
            <a routerLink="/login" class="btn btn-primary btn-sm">
              Sign In
            </a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: var(--color-bg-card);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: var(--shadow-sm);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--space-md) var(--space-lg);
      display: flex;
      align-items: center;
      gap: var(--space-xl);
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-primary);
      text-decoration: none;
    }

    .nav-brand svg {
      width: 32px;
      height: 32px;
    }

    .nav-links {
      display: flex;
      gap: var(--space-md);
      flex: 1;
    }

    .nav-links a {
      padding: var(--space-sm) var(--space-md);
      color: var(--color-text-light);
      font-weight: 500;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }

    .nav-links a:hover {
      color: var(--color-primary);
      background: rgba(26, 95, 90, 0.05);
    }

    .nav-links a.active {
      color: var(--color-primary);
      background: rgba(26, 95, 90, 0.1);
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--color-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-name {
      font-weight: 500;
      font-size: 0.875rem;
      color: var(--color-text);
    }

    .user-details .badge {
      font-size: 0.65rem;
      padding: 2px 6px;
    }

    @media (max-width: 768px) {
      .nav-container {
        flex-wrap: wrap;
      }

      .nav-links {
        order: 3;
        width: 100%;
        justify-content: center;
        padding-top: var(--space-sm);
        border-top: 1px solid var(--color-border);
        margin-top: var(--space-sm);
      }

      .user-details {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}
}

