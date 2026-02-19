package com.ehrclinic.config;

import com.ehrclinic.appointment.repository.AppointmentRepository;
import com.ehrclinic.auth.repository.UserRepository;
import com.ehrclinic.lab.repository.LabOrderRepository;
import com.ehrclinic.patient.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final LabOrderRepository labOrderRepository;
    private final UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        LocalDate today = LocalDate.now();

        Map<String, Object> stats = Map.of(
                "totalPatients", patientRepository.countByIsActiveTrue(),
                "todayAppointments", appointmentRepository.countByAppointmentDate(today),
                "pendingLabOrders", labOrderRepository.countByStatus("ORDERED"),
                "totalUsers", userRepository.count()
        );

        return ResponseEntity.ok(stats);
    }
}
