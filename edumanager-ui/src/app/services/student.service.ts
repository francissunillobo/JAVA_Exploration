import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Student, ApiResponse } from '../models/student.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  /**
   * Get all students
   */
  getAll(): Observable<Student[]> {
    return this.http.get<ApiResponse<Student[]>>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  /**
   * Get student by ID
   */
  getById(id: number): Observable<Student> {
    return this.http.get<ApiResponse<Student>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  /**
   * Search students by name
   */
  search(name: string): Observable<Student[]> {
    return this.http.get<ApiResponse<Student[]>>(`${this.apiUrl}/search`, {
      params: { name }
    }).pipe(map(response => response.data));
  }

  /**
   * Create a new student
   */
  create(student: Student): Observable<Student> {
    return this.http.post<ApiResponse<Student>>(this.apiUrl, student)
      .pipe(map(response => response.data));
  }

  /**
   * Update an existing student
   */
  update(id: number, student: Student): Observable<Student> {
    return this.http.put<ApiResponse<Student>>(`${this.apiUrl}/${id}`, student)
      .pipe(map(response => response.data));
  }

  /**
   * Delete a student (requires ADMIN role)
   */
  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => void 0));
  }
}

