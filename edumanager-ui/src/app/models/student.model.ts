export interface Student {
  id?: number;
  name: string;
  email: string;
  phone?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

