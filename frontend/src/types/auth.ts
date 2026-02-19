export interface UserInfo {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: UserInfo;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  specialization?: string;
  licenseNumber?: string;
  phone?: string;
  roles: string[];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
