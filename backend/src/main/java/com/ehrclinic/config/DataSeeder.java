package com.ehrclinic.config;

import com.ehrclinic.auth.entity.Role;
import com.ehrclinic.auth.entity.RoleName;
import com.ehrclinic.auth.entity.User;
import com.ehrclinic.auth.repository.RoleRepository;
import com.ehrclinic.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername("admin").isEmpty()) {
            Role adminRole = roleRepository.findByName(RoleName.ADMIN)
                    .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

            User admin = User.builder()
                    .username("admin")
                    .email("admin@ehrclinic.com")
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .firstName("System")
                    .lastName("Administrator")
                    .isActive(true)
                    .roles(Set.of(adminRole))
                    .build();

            userRepository.save(admin);
            log.info("Admin user created: admin / Admin@123");
        } else {
            // Update the existing admin password to make sure it works
            User admin = userRepository.findByUsername("admin").get();
            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
            userRepository.save(admin);
            log.info("Admin user password updated");
        }
    }
}
