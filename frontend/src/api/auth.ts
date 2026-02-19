import api from './axios-instance';
import type { LoginRequest, LoginResponse, RegisterRequest, ChangePasswordRequest, UserInfo } from '@/types/auth';

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/v1/auth/login', data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    api.post<LoginResponse>('/v1/auth/register', data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    api.post<LoginResponse>('/v1/auth/refresh', { refreshToken }).then((r) => r.data),

  changePassword: (data: ChangePasswordRequest) =>
    api.post('/v1/auth/change-password', data),

  getMe: () =>
    api.get<UserInfo>('/v1/auth/me').then((r) => r.data),
};
