package com.ehrclinic.patient.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientUpdateRequest {
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
}
