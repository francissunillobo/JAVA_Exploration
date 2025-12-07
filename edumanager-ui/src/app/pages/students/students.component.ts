import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <main class="main-content">
      <div class="container">
        <!-- Header -->
        <header class="page-header animate-slide-up">
          <div class="header-text">
            <h1>Students</h1>
            <p class="text-muted">Manage your student records</p>
          </div>
          @if (authService.isLoggedIn()) {
            <a routerLink="/students/new" class="btn btn-primary">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
              </svg>
              Add Student
            </a>
          }
        </header>

        <!-- Search & Stats Bar -->
        <div class="toolbar animate-slide-up" style="animation-delay: 100ms">
          <div class="search-box">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search students by name..."
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
            >
            @if (searchTerm) {
              <button class="clear-btn" (click)="clearSearch()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z"/>
                </svg>
              </button>
            }
          </div>
          <div class="stats">
            <span class="stat-item">
              <strong>{{ filteredStudents().length }}</strong> students
            </span>
          </div>
        </div>

        <!-- Content -->
        @if (loading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading students...</p>
          </div>
        } @else if (error()) {
          <div class="error-state card">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="var(--color-error)">
              <path d="M24 4C12.96 4 4 12.96 4 24s8.96 20 20 20 20-8.96 20-20S35.04 4 24 4zm2 30h-4v-4h4v4zm0-8h-4V14h4v12z"/>
            </svg>
            <h3>Failed to load students</h3>
            <p class="text-muted">{{ error() }}</p>
            <button class="btn btn-primary" (click)="loadStudents()">Try Again</button>
          </div>
        } @else if (filteredStudents().length === 0) {
          <div class="empty-state card">
            @if (searchTerm) {
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="28" cy="28" r="20" stroke="var(--color-border)" stroke-width="4"/>
                <path d="M44 44L56 56" stroke="var(--color-border)" stroke-width="4" stroke-linecap="round"/>
                <path d="M20 28H36" stroke="var(--color-text-muted)" stroke-width="3" stroke-linecap="round"/>
              </svg>
              <h3>No results found</h3>
              <p class="text-muted">No students match "{{ searchTerm }}"</p>
              <button class="btn btn-secondary" (click)="clearSearch()">Clear Search</button>
            } @else {
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <rect x="8" y="12" width="48" height="40" rx="4" stroke="var(--color-border)" stroke-width="3"/>
                <path d="M20 28H44M20 36H36" stroke="var(--color-text-muted)" stroke-width="3" stroke-linecap="round"/>
                <circle cx="32" cy="8" r="4" fill="var(--color-accent)"/>
              </svg>
              <h3>No students yet</h3>
              <p class="text-muted">Get started by adding your first student</p>
              @if (authService.isLoggedIn()) {
                <a routerLink="/students/new" class="btn btn-primary">Add Student</a>
              } @else {
                <a routerLink="/login" class="btn btn-primary">Sign in to add students</a>
              }
            }
          </div>
        } @else {
          <!-- Student Grid -->
          <div class="student-grid">
            @for (student of filteredStudents(); track student.id; let i = $index) {
              <div class="student-card card animate-slide-up" [style.animation-delay]="(i * 50) + 'ms'">
                <div class="student-avatar">
                  {{ student.name.charAt(0).toUpperCase() }}
                </div>
                <div class="student-info">
                  <h3 class="student-name">{{ student.name }}</h3>
                  <div class="student-details">
                    <span class="detail-item">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2-.5a.5.5 0 00-.5.5v8a.5.5 0 00.5.5h8a.5.5 0 00.5-.5V4a.5.5 0 00-.5-.5H4z"/>
                        <path d="M5 6h6v1H5V6zm0 2h6v1H5V8zm0 2h4v1H5v-1z"/>
                      </svg>
                      {{ student.email }}
                    </span>
                    @if (student.phone) {
                      <span class="detail-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M3.654 1.328a.678.678 0 00-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 004.168 6.608 17.569 17.569 0 006.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 00-.063-1.015l-2.307-1.794a.678.678 0 00-.58-.122l-2.19.547a1.745 1.745 0 01-1.657-.459L5.482 8.062a1.745 1.745 0 01-.46-1.657l.548-2.19a.678.678 0 00-.122-.58L3.654 1.328z"/>
                        </svg>
                        {{ student.phone }}
                      </span>
                    }
                  </div>
                </div>
                @if (authService.isLoggedIn()) {
                  <div class="student-actions">
                    <a [routerLink]="['/students/edit', student.id]" class="btn btn-ghost btn-sm" title="Edit">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                        <path d="M12.146 1.146a2 2 0 012.708 2.708l-8.5 8.5-3.5 1 1-3.5 8.292-8.708z"/>
                      </svg>
                    </a>
                    @if (authService.isAdmin()) {
                      <button class="btn btn-ghost btn-sm btn-danger-hover" title="Delete" (click)="confirmDelete(student)">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                          <path d="M6.5 1h5a.5.5 0 01.5.5v1H6v-1a.5.5 0 01.5-.5zM4.5 4h9l-.5 11.5a1 1 0 01-1 .5h-6a1 1 0 01-1-.5L4.5 4zm2 2v8h1V6h-1zm2 0v8h1V6h-1zm2 0v8h1V6h-1z"/>
                          <path d="M3 3.5h12v1H3v-1z"/>
                        </svg>
                      </button>
                    }
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </main>

    <!-- Delete Confirmation Modal -->
    @if (studentToDelete()) {
      <div class="modal-overlay" (click)="cancelDelete()">
        <div class="modal card" (click)="$event.stopPropagation()">
          <h3>Delete Student?</h3>
          <p class="text-muted">
            Are you sure you want to delete <strong>{{ studentToDelete()?.name }}</strong>? 
            This action cannot be undone.
          </p>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="cancelDelete()">Cancel</button>
            <button class="btn btn-danger" (click)="deleteStudent()" [disabled]="deleting()">
              @if (deleting()) {
                <span class="spinner"></span>
              }
              Delete
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Toast Notification -->
    @if (toast()) {
      <div class="toast" [class]="'toast-' + toast()!.type">
        {{ toast()!.message }}
      </div>
    }
  `,
  styles: [`
    .main-content {
      padding: var(--space-xl) 0;
      min-height: calc(100vh - 70px);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);
    }

    .header-text h1 {
      margin-bottom: var(--space-xs);
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);
      gap: var(--space-md);
      flex-wrap: wrap;
    }

    .search-box {
      position: relative;
      flex: 1;
      max-width: 400px;
    }

    .search-box input {
      padding-left: 44px;
      padding-right: 40px;
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-muted);
    }

    .clear-btn {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      padding: 6px;
      cursor: pointer;
      color: var(--color-text-muted);
      border-radius: var(--radius-sm);
    }

    .clear-btn:hover {
      background: var(--color-bg);
      color: var(--color-text);
    }

    .stats {
      display: flex;
      gap: var(--space-lg);
    }

    .stat-item {
      color: var(--color-text-muted);
      font-size: 0.9rem;
    }

    .stat-item strong {
      color: var(--color-text);
    }

    /* Loading & Empty States */
    .loading-state, .empty-state, .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-2xl);
      text-align: center;
      gap: var(--space-md);
    }

    .loading-state .spinner {
      width: 40px;
      height: 40px;
    }

    .empty-state h3, .error-state h3 {
      margin-top: var(--space-md);
    }

    /* Student Grid */
    .student-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: var(--space-lg);
    }

    .student-card {
      display: flex;
      align-items: flex-start;
      gap: var(--space-md);
      padding: var(--space-lg);
      transition: all var(--transition-base);
    }

    .student-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .student-avatar {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .student-info {
      flex: 1;
      min-width: 0;
    }

    .student-name {
      font-family: var(--font-body);
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: var(--space-sm);
      color: var(--color-text);
    }

    .student-details {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: 0.85rem;
      color: var(--color-text-light);
    }

    .detail-item svg {
      flex-shrink: 0;
      opacity: 0.6;
    }

    .student-actions {
      display: flex;
      gap: var(--space-xs);
      opacity: 0;
      transition: opacity var(--transition-fast);
    }

    .student-card:hover .student-actions {
      opacity: 1;
    }

    .btn-danger-hover:hover {
      color: var(--color-error) !important;
      background: rgba(197, 57, 41, 0.08) !important;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: var(--space-lg);
      animation: fadeIn var(--transition-fast);
    }

    .modal {
      max-width: 400px;
      width: 100%;
      animation: slideUp var(--transition-base);
    }

    .modal h3 {
      margin-bottom: var(--space-md);
    }

    .modal-actions {
      display: flex;
      gap: var(--space-md);
      margin-top: var(--space-xl);
      justify-content: flex-end;
    }

    @media (max-width: 640px) {
      .student-grid {
        grid-template-columns: 1fr;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-md);
      }

      .student-actions {
        opacity: 1;
      }
    }
  `]
})
export class StudentsComponent implements OnInit {
  students = signal<Student[]>([]);
  loading = signal(true);
  error = signal('');
  searchTerm = '';
  studentToDelete = signal<Student | null>(null);
  deleting = signal(false);
  toast = signal<{ message: string; type: 'success' | 'error' } | null>(null);

  filteredStudents = computed(() => {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.students();
    return this.students().filter(s => 
      s.name.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term)
    );
  });

  constructor(
    private studentService: StudentService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading.set(true);
    this.error.set('');
    
    this.studentService.getAll().subscribe({
      next: (students) => {
        this.students.set(students);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load students');
        this.loading.set(false);
      }
    });
  }

  onSearch(): void {
    // Filtering is handled by computed signal
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  confirmDelete(student: Student): void {
    this.studentToDelete.set(student);
  }

  cancelDelete(): void {
    this.studentToDelete.set(null);
  }

  deleteStudent(): void {
    const student = this.studentToDelete();
    if (!student?.id) return;

    this.deleting.set(true);

    this.studentService.delete(student.id).subscribe({
      next: () => {
        this.students.update(list => list.filter(s => s.id !== student.id));
        this.studentToDelete.set(null);
        this.deleting.set(false);
        this.showToast('Student deleted successfully', 'success');
      },
      error: (err) => {
        this.deleting.set(false);
        this.showToast(err.error?.message || 'Failed to delete student', 'error');
      }
    });
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    this.toast.set({ message, type });
    setTimeout(() => this.toast.set(null), 3000);
  }
}

