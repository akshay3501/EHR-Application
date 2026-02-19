package com.ehrclinic.auth.service.impl;

import com.ehrclinic.auth.config.JwtTokenProvider;
import com.ehrclinic.auth.dto.*;
import com.ehrclinic.auth.entity.Role;
import com.ehrclinic.auth.entity.RoleName;
import com.ehrclinic.auth.entity.User;
import com.ehrclinic.auth.repository.RoleRepository;
import com.ehrclinic.auth.repository.UserRepository;
import com.ehrclinic.auth.service.AuthService;
import com.ehrclinic.exception.BadRequestException;
import com.ehrclinic.exception.DuplicateResourceException;
import com.ehrclinic.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Override
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", request.getUsername()));

        return buildLoginResponse(user, accessToken, refreshToken);
    }

    @Override
    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already exists: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
        }

        Set<Role> roles = new HashSet<>();
        for (String roleName : request.getRoles()) {
            RoleName rn = RoleName.valueOf(roleName.toUpperCase());
            Role role = roleRepository.findByName(rn)
                    .orElseThrow(() -> new ResourceNotFoundException("Role", "name", roleName));
            roles.add(role);
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .specialization(request.getSpecialization())
                .licenseNumber(request.getLicenseNumber())
                .phone(request.getPhone())
                .roles(roles)
                .isActive(true)
                .build();

        user = userRepository.save(user);

        String accessToken = tokenProvider.generateAccessTokenFromUsername(user.getUsername());
        String refreshToken = tokenProvider.generateRefreshTokenFromUsername(user.getUsername());

        return buildLoginResponse(user, accessToken, refreshToken);
    }

    @Override
    public LoginResponse refreshToken(RefreshTokenRequest request) {
        if (!tokenProvider.validateToken(request.getRefreshToken())) {
            throw new BadRequestException("Invalid or expired refresh token");
        }

        String username = tokenProvider.getUsernameFromToken(request.getRefreshToken());
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        String accessToken = tokenProvider.generateAccessTokenFromUsername(username);
        String refreshToken = tokenProvider.generateRefreshTokenFromUsername(username);

        return buildLoginResponse(user, accessToken, refreshToken);
    }

    @Override
    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponse.UserInfo getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        return LoginResponse.UserInfo.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roles(user.getRoles().stream()
                        .map(r -> r.getName().name())
                        .collect(Collectors.toSet()))
                .build();
    }

    private LoginResponse buildLoginResponse(User user, String accessToken, String refreshToken) {
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .roles(user.getRoles().stream()
                                .map(r -> r.getName().name())
                                .collect(Collectors.toSet()))
                        .build())
                .build();
    }
}
