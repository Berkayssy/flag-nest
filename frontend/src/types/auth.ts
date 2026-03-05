export type UserRole = "employee" | "manager" | "admin";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface ApiSuccess<T> {
  data: T;
}

export interface ApiError {
  error: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
}

export interface MeResponse {
  user: AuthUser;
}
