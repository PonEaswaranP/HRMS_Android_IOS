import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@env';
import { tokenStorage } from '../utils/tokenStorage';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenResponse,
  Employee,
  EmployeeCreateRequest,
  Attendance,
  AttendanceCheckInRequest,
  AttendanceCheckOutRequest,
  Leave,
  LeaveApplicationRequest,
  LeaveApprovalRequest,
  Payslip,
  DashboardSummary,
  PaginatedResponse,
  User,
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL || 'http://10.0.2.2:8000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - attach JWT token
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await tokenStorage.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => {
                return this.api(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await tokenStorage.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await this.refreshToken(refreshToken);
            await tokenStorage.setAccessToken(response.access);

            this.processQueue(null);
            return this.api(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            await tokenStorage.clearTokens();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });
    this.failedQueue = [];
  }

  // ===== Authentication APIs =====

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/api/auth/login/', data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/api/auth/register/', data);
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await this.api.post<RefreshTokenResponse>(
      '/api/auth/token/refresh/',
      { refresh: refreshToken }
    );
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get<User>('/api/auth/user/');
    return response.data;
  }

  async logout(): Promise<void> {
    await tokenStorage.clearTokens();
  }

  // ===== Employee APIs =====

  async getEmployees(page = 1, search?: string): Promise<PaginatedResponse<Employee>> {
    const params: any = { page };
    if (search) {
      params.search = search;
    }
    const response = await this.api.get<PaginatedResponse<Employee>>(
      '/api/employees/',
      { params }
    );
    return response.data;
  }

  async getEmployee(id: number): Promise<Employee> {
    const response = await this.api.get<Employee>(`/api/employees/${id}/`);
    return response.data;
  }

  async createEmployee(data: EmployeeCreateRequest): Promise<Employee> {
    const response = await this.api.post<Employee>('/api/employees/', data);
    return response.data;
  }

  async updateEmployee(id: number, data: Partial<EmployeeCreateRequest>): Promise<Employee> {
    const response = await this.api.patch<Employee>(`/api/employees/${id}/`, data);
    return response.data;
  }

  async deleteEmployee(id: number): Promise<void> {
    await this.api.delete(`/api/employees/${id}/`);
  }

  // ===== Attendance APIs =====

  async getTodayAttendance(): Promise<Attendance | null> {
    try {
      const response = await this.api.get<Attendance>('/api/attendance/today/');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getAttendanceHistory(startDate?: string, endDate?: string): Promise<Attendance[]> {
    const params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await this.api.get<Attendance[]>('/api/attendance/', { params });
    return response.data;
  }

  async checkIn(data?: AttendanceCheckInRequest): Promise<Attendance> {
    const response = await this.api.post<Attendance>('/api/attendance/check-in/', data || {});
    return response.data;
  }

  async checkOut(attendanceId: number, notes?: string): Promise<Attendance> {
    const response = await this.api.post<Attendance>(
      `/api/attendance/${attendanceId}/check-out/`,
      { notes }
    );
    return response.data;
  }

  // ===== Leave APIs =====

  async getLeaves(status?: string): Promise<Leave[]> {
    const params: any = {};
    if (status) params.status = status;
    
    const response = await this.api.get<Leave[]>('/api/leaves/', { params });
    return response.data;
  }

  async getLeave(id: number): Promise<Leave> {
    const response = await this.api.get<Leave>(`/api/leaves/${id}/`);
    return response.data;
  }

  async applyLeave(data: LeaveApplicationRequest): Promise<Leave> {
    const response = await this.api.post<Leave>('/api/leaves/', data);
    return response.data;
  }

  async approveLeave(leaveId: number, rejectionReason?: string): Promise<Leave> {
    const response = await this.api.post<Leave>(
      `/api/leaves/${leaveId}/approve/`,
      { rejection_reason: rejectionReason }
    );
    return response.data;
  }

  async rejectLeave(leaveId: number, rejectionReason: string): Promise<Leave> {
    const response = await this.api.post<Leave>(
      `/api/leaves/${leaveId}/reject/`,
      { rejection_reason: rejectionReason }
    );
    return response.data;
  }

  async cancelLeave(leaveId: number): Promise<Leave> {
    const response = await this.api.post<Leave>(`/api/leaves/${leaveId}/cancel/`);
    return response.data;
  }

  // ===== Payroll APIs =====

  async getPayslips(year?: number, month?: number): Promise<Payslip[]> {
    const params: any = {};
    if (year) params.year = year;
    if (month) params.month = month;
    
    const response = await this.api.get<Payslip[]>('/api/payroll/payslips/', { params });
    return response.data;
  }

  async getPayslip(id: number): Promise<Payslip> {
    const response = await this.api.get<Payslip>(`/api/payroll/payslips/${id}/`);
    return response.data;
  }

  async getLatestPayslip(): Promise<Payslip | null> {
    try {
      const response = await this.api.get<Payslip>('/api/payroll/latest/');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // ===== Dashboard API =====

  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await this.api.get<DashboardSummary>('/api/dashboard/');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
