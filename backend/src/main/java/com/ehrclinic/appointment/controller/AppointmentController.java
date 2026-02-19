package com.ehrclinic.appointment.controller;

import com.ehrclinic.appointment.dto.*;
import com.ehrclinic.appointment.service.AppointmentService;
import com.ehrclinic.common.dto.PagedResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping("/appointments")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR')")
    public ResponseEntity<AppointmentResponse> createAppointment(
            @Valid @RequestBody AppointmentCreateRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(appointmentService.createAppointment(request, authentication.getName()));
    }

    @GetMapping("/appointments")
    public ResponseEntity<PagedResponse<AppointmentResponse>> getAppointments(
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(appointmentService.getAppointments(doctorId, patientId, status, page, size));
    }

    @PatchMapping("/appointments/{id}/reschedule")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<AppointmentResponse> reschedule(@PathVariable Long id,
                                                            @Valid @RequestBody RescheduleRequest request) {
        return ResponseEntity.ok(appointmentService.rescheduleAppointment(id, request));
    }

    @PatchMapping("/appointments/{id}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR')")
    public ResponseEntity<AppointmentResponse> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id));
    }

    @PatchMapping("/appointments/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    public ResponseEntity<AppointmentResponse> updateStatus(@PathVariable Long id,
                                                              @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, request));
    }

    @GetMapping("/doctors/{id}/availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<List<DoctorAvailabilityDto>> getDoctorAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getDoctorAvailability(id));
    }

    @PostMapping("/doctors/{id}/availability")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<DoctorAvailabilityDto> setDoctorAvailability(@PathVariable Long id,
                                                                        @Valid @RequestBody DoctorAvailabilityDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(appointmentService.setDoctorAvailability(id, dto));
    }

    @GetMapping("/doctors/{id}/slots")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'DOCTOR')")
    public ResponseEntity<List<TimeSlotResponse>> getAvailableSlots(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(appointmentService.getAvailableSlots(id, startDate, endDate));
    }
}
