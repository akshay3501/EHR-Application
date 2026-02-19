package com.ehrclinic.patient.controller;

import com.ehrclinic.common.dto.PagedResponse;
import com.ehrclinic.patient.dto.*;
import com.ehrclinic.patient.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<PatientResponse> createPatient(@Valid @RequestBody PatientCreateRequest request,
                                                          Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(patientService.createPatient(request, authentication.getName()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    public ResponseEntity<PagedResponse<PatientSummaryResponse>> getPatients(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(patientService.getPatients(search, page, size));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    public ResponseEntity<PatientResponse> getPatient(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatient(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<PatientResponse> updatePatient(@PathVariable Long id,
                                                          @Valid @RequestBody PatientUpdateRequest request) {
        return ResponseEntity.ok(patientService.updatePatient(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/allergies")
    @PreAuthorize("hasAnyRole('DOCTOR', 'NURSE')")
    public ResponseEntity<List<AllergyDto>> getAllergies(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientAllergies(id));
    }

    @PostMapping("/{id}/allergies")
    @PreAuthorize("hasAnyRole('DOCTOR', 'NURSE')")
    public ResponseEntity<AllergyDto> addAllergy(@PathVariable Long id,
                                                  @Valid @RequestBody AllergyDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patientService.addAllergy(id, dto));
    }

    @GetMapping("/{id}/vitals")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public ResponseEntity<PagedResponse<VitalSignDto>> getVitals(@PathVariable Long id,
                                                                   @RequestParam(defaultValue = "0") int page,
                                                                   @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(patientService.getPatientVitals(id, page, size));
    }

    @PostMapping("/{id}/vitals")
    @PreAuthorize("hasAnyRole('DOCTOR', 'NURSE')")
    public ResponseEntity<VitalSignDto> addVitals(@PathVariable Long id,
                                                    @RequestBody VitalSignDto dto,
                                                    Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(patientService.addVitals(id, dto, authentication.getName()));
    }

    @GetMapping("/{id}/vitals/latest")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE')")
    public ResponseEntity<VitalSignDto> getLatestVitals(@PathVariable Long id) {
        VitalSignDto vitals = patientService.getLatestVitals(id);
        return vitals != null ? ResponseEntity.ok(vitals) : ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/medical-history")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<MedicalHistoryDto>> getMedicalHistory(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getMedicalHistory(id));
    }

    @PostMapping("/{id}/medical-history")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<MedicalHistoryDto> addMedicalHistory(@PathVariable Long id,
                                                                 @Valid @RequestBody MedicalHistoryDto dto,
                                                                 Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(patientService.addMedicalHistory(id, dto, authentication.getName()));
    }

    @PutMapping("/{id}/medical-history/{historyId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<MedicalHistoryDto> updateMedicalHistory(@PathVariable Long id,
                                                                    @PathVariable Long historyId,
                                                                    @RequestBody MedicalHistoryDto dto) {
        return ResponseEntity.ok(patientService.updateMedicalHistory(id, historyId, dto));
    }
}
