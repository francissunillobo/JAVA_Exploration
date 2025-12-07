import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    
    <main class="main-content">
      <div class="container">
        <div class="form-page animate-slide-up">
          <!-- Back link -->
          <a routerLink="/students" class="back-link">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
            </svg>
            Back to Students
          </a>

          <!-- Form Card -->
          <div class="form-card card">
            <div class="form-header">
              <h1>{{ isEditMode() ? 'Edit Student' : 'Add New Student' }}</h1>
              <p class="text-muted">
                {{ isEditMode() ? 'Update the student information below' : 'Fill in the details to create a new student record' }}
              </p>
            </div>

            @if (loadingStudent()) {
              <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading student data...</p>
              </div>
            } @else {
              <form (ngSubmit)="onSubmit()" class="student-form">
                <!-- Name Field -->
                <div class="form-group">
                  <label for="name">
                    Full Name <span class="required">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    [(ngModel)]="student.name" 
                    name="name"
                    placeholder="Enter student's full name"
                    required
                    minlength="2"
                    maxlength="100"
                    [disabled]="saving()"
                    #nameInput="ngModel"
                  >
                  @if (nameInput.invalid && nameInput.touched) {
                    <span class="field-error">
                      @if (nameInput.errors?.['required']) {
                        Name is required
                      } @else if (nameInput.errors?.['minlength']) {
                        Name must be at least 2 characters
                      }
                    </span>
                  }
                </div>

                <!-- Email Field -->
                <div class="form-group">
                  <label for="email">
                    Email Address <span class="required">*</span>
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    [(ngModel)]="student.email" 
                    name="email"
                    placeholder="Enter email address"
                    required
                    email
                    [disabled]="saving()"
                    #emailInput="ngModel"
                  >
                  @if (emailInput.invalid && emailInput.touched) {
                    <span class="field-error">
                      @if (emailInput.errors?.['required']) {
                        Email is required
                      } @else if (emailInput.errors?.['email']) {
                        Please enter a valid email address
                      }
                    </span>
                  }
                </div>

                <!-- Phone Field -->
                <div class="form-group">
                  <label for="phone">
                    Phone Number
                    <span class="optional">(optional)</span>
                  </label>
                  <input 
                    type="tel" 
                    id="phone" 
                    [(ngModel)]="student.phone" 
                    name="phone"
                    placeholder="Enter phone number"
                    maxlength="20"
                    [disabled]="saving()"
                  >
                </div>

                <!-- Error Message -->
                @if (error()) {
                  <div class="error-message">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 4h2v5H7V4zm0 6h2v2H7v-2z"/>
                    </svg>
                    {{ error() }}
                  </div>
                }

                <!-- Form Actions -->
                <div class="form-actions">
                  <a routerLink="/students" class="btn btn-secondary">
                    Cancel
                  </a>
                  <button type="submit" class="btn btn-primary" [disabled]="saving()">
                    @if (saving()) {
                      <span class="spinner"></span>
                      {{ isEditMode() ? 'Saving...' : 'Creating...' }}
                    } @else {
                      {{ isEditMode() ? 'Save Changes' : 'Create Student' }}
                    }
                  </button>
                </div>
              </form>
            }
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .main-content {
      padding: var(--space-xl) 0;
      min-height: calc(100vh - 70px);
    }

    .form-page {
      max-width: 600px;
      margin: 0 auto;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      color: var(--color-text-light);
      font-size: 0.9rem;
      margin-bottom: var(--space-lg);
      transition: color var(--transition-fast);
    }

    .back-link:hover {
      color: var(--color-primary);
    }

    .form-card {
      padding: var(--space-2xl);
    }

    .form-header {
      margin-bottom: var(--space-2xl);
    }

    .form-header h1 {
      margin-bottom: var(--space-sm);
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--space-2xl);
      gap: var(--space-md);
    }

    .student-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      margin-bottom: var(--space-sm);
    }

    .required {
      color: var(--color-error);
    }

    .optional {
      font-weight: 400;
      font-size: 0.8rem;
      color: var(--color-text-muted);
    }

    .field-error {
      margin-top: var(--space-sm);
      font-size: 0.8rem;
      color: var(--color-error);
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

    .form-actions {
      display: flex;
      gap: var(--space-md);
      justify-content: flex-end;
      padding-top: var(--space-lg);
      border-top: 1px solid var(--color-border);
      margin-top: var(--space-md);
    }

    .form-actions .spinner {
      width: 18px;
      height: 18px;
      border-width: 2px;
      border-top-color: white;
    }

    @media (max-width: 640px) {
      .form-card {
        padding: var(--space-lg);
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .form-actions .btn {
        width: 100%;
      }
    }
  `]
})
export class StudentFormComponent implements OnInit {
  student: Student = {
    name: '',
    email: '',
    phone: ''
  };
  
  isEditMode = signal(false);
  loadingStudent = signal(false);
  saving = signal(false);
  error = signal('');
  
  private studentId: number | null = null;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if we're in edit mode
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.studentId = parseInt(idParam, 10);
      this.isEditMode.set(true);
      this.loadStudent();
    }
  }

  private loadStudent(): void {
    if (!this.studentId) return;
    
    this.loadingStudent.set(true);
    
    this.studentService.getById(this.studentId).subscribe({
      next: (student) => {
        this.student = { ...student };
        this.loadingStudent.set(false);
      },
      error: (err) => {
        this.loadingStudent.set(false);
        this.error.set('Failed to load student data');
        console.error('Load error:', err);
      }
    });
  }

  onSubmit(): void {
    // Basic validation
    if (!this.student.name?.trim() || !this.student.email?.trim()) {
      this.error.set('Please fill in all required fields');
      return;
    }

    this.saving.set(true);
    this.error.set('');

    const operation = this.isEditMode() && this.studentId
      ? this.studentService.update(this.studentId, this.student)
      : this.studentService.create(this.student);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/students']);
      },
      error: (err) => {
        this.saving.set(false);
        const message = err.error?.message || err.error?.data?.email || 'Failed to save student';
        this.error.set(message);
        console.error('Save error:', err);
      }
    });
  }
}

