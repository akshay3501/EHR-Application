package com.ehrclinic.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponse {
    private Long id;
    private String medicalRecordNumber;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodType;
    private String phone;
    private String email;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String insuranceProvider;
    private String insurancePolicyNumber;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String emergencyContactRelationship;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private List<AllergyDto> allergies;
    private List<MedicalHistoryDto> medicalHistories;
    private VitalSignDto latestVitals;
}
