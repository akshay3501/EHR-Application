package com.ehrclinic.auth.service;

import com.ehrclinic.auth.dto.*;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    LoginResponse register(RegisterRequest request);
    LoginResponse refreshToken(RefreshTokenRequest request);
    void changePassword(String username, ChangePasswordRequest request);
    LoginResponse.UserInfo getCurrentUser(String username);
}
