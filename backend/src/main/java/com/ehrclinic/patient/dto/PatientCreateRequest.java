package com.ehrclinic.patient.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientCreateRequest {
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Gender is required")
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
}
