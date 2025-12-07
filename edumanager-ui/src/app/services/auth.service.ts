import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../models/auth.model';
import { environment } from '../../environments/environment';

const TOKEN_KEY = 'edu_token';
const USER_KEY = 'edu_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Reactive state using signals
  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());
  
  // Public computed values
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.currentUserSignal());
  readonly isAdmin = computed(() => {
    const user = this.currentUserSignal();
    return user?.roles.includes('ROLE_ADMIN') ?? false;
  });
  readonly username = computed(() => this.currentUserSignal()?.username ?? '');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Login with username and password
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.saveAuth(response);
        }),
        catchError(error => {
          console.error('Login failed:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Logout and clear storage
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Get the stored JWT token
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    const user = this.currentUserSignal();
    return user?.roles.includes(role) ?? false;
  }

  /**
   * Save authentication data to storage and update state
   */
  private saveAuth(response: LoginResponse): void {
    const user: User = {
      username: response.username,
      roles: response.roles,
      token: response.token
    };
    
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  /**
   * Load user from localStorage on app init
   */
  private loadUserFromStorage(): User | null {
    try {
      const userJson = localStorage.getItem(USER_KEY);
      const token = localStorage.getItem(TOKEN_KEY);
      
      if (userJson && token) {
        const user = JSON.parse(userJson) as User;
        return user;
      }
    } catch (e) {
      console.error('Error loading user from storage:', e);
    }
    return null;
  }
}

