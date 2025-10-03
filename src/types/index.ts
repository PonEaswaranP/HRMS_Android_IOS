// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user?: User;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

// Employee Types
export interface Employee {
  id: number;
  user?: number | User;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  date_of_joining: string;
  status: 'active' | 'inactive';
  profile_picture?: string;
  address?: string;
  date_of_birth?: string;
  salary?: number;
}

export interface EmployeeCreateRequest {
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  date_of_joining: string;
  status?: 'active' | 'inactive';
  address?: string;
  date_of_birth?: string;
}

// Attendance Types
export interface Attendance {
  id: number;
  employee: number | Employee;
  date: string;
  check_in_time: string;
  check_out_time?: string;
  status: 'present' | 'absent' | 'half_day' | 'leave';
  work_hours?: number;
  notes?: string;
}

export interface AttendanceCheckInRequest {
  employee?: number;
  notes?: string;
}

export interface AttendanceCheckOutRequest {
  attendance_id: number;
  notes?: string;
}

export interface AttendanceResponse {
  id: number;
  employee: number;
  date: string;
  check_in_time: string;
  check_out_time?: string;
  status: string;
  work_hours?: number;
}

// Leave Types
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type LeaveType = 'sick' | 'casual' | 'annual' | 'maternity' | 'paternity' | 'unpaid';

export interface Leave {
  id: number;
  employee: number | Employee;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  days_count: number;
  reason: string;
  status: LeaveStatus;
  applied_on: string;
  approved_by?: number | User;
  approved_on?: string;
  rejection_reason?: string;
}

export interface LeaveApplicationRequest {
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
}

export interface LeaveApprovalRequest {
  leave_id: number;
  status: 'approved' | 'rejected';
  rejection_reason?: string;
}

// Payroll Types
export interface Payslip {
  id: number;
  employee: number | Employee;
  month: number;
  year: number;
  basic_salary: number;
  hra: number;
  da: number;
  medical_allowance: number;
  transport_allowance: number;
  other_allowances: number;
  gross_salary: number;
  pf_deduction: number;
  tax_deduction: number;
  other_deductions: number;
  total_deductions: number;
  net_salary: number;
  payment_date?: string;
  status: 'draft' | 'processed' | 'paid';
  created_at: string;
}

export interface PayslipSummary {
  latest_payslip?: Payslip;
  total_paid_current_year: number;
  average_monthly_salary: number;
}

// Dashboard Types
export interface DashboardSummary {
  attendance_today?: Attendance;
  pending_leaves_count: number;
  pending_leaves: Leave[];
  latest_payslip?: Payslip;
  total_employees?: number;
  total_present_today?: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}
